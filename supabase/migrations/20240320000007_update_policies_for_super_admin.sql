-- Now we can safely use the super_admin enum value in our policies
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Create new policies with super_admin support
CREATE POLICY "profiles_select_policy"
    ON public.profiles
    FOR SELECT
    USING (
        auth.uid() = id
        OR EXISTS (
            SELECT 1
            FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('super_admin'::user_role, 'admin'::user_role)
        )
    );

CREATE POLICY "profiles_insert_policy"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('super_admin'::user_role, 'admin'::user_role)
        )
    );

-- Create a function to handle role update checks
CREATE OR REPLACE FUNCTION check_role_update(updating_user_id uuid, target_user_id uuid, new_role user_role)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Allow super admins to do anything
    IF EXISTS (
        SELECT 1
        FROM profiles p
        WHERE p.id = updating_user_id
        AND p.role = 'super_admin'::user_role
    ) THEN
        RETURN TRUE;
    END IF;

    -- Users can only update their own non-role fields
    IF updating_user_id = target_user_id THEN
        RETURN (
            SELECT role = new_role
            FROM profiles
            WHERE id = target_user_id
        );
    END IF;

    -- Regular admins can't create/modify super admins
    IF EXISTS (
        SELECT 1
        FROM profiles p
        WHERE p.id = updating_user_id
        AND p.role = 'admin'::user_role
    ) THEN
        RETURN new_role != 'super_admin'::user_role;
    END IF;

    RETURN FALSE;
END;
$$;

-- Create update policy using the check function
CREATE POLICY "profiles_update_policy"
    ON public.profiles
    FOR UPDATE
    USING (
        auth.uid() = id
        OR EXISTS (
            SELECT 1
            FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role IN ('super_admin'::user_role, 'admin'::user_role)
        )
    )
    WITH CHECK (
        check_role_update(auth.uid(), id, role::user_role)
    );

CREATE POLICY "profiles_delete_policy"
    ON public.profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1
            FROM profiles p
            WHERE p.id = auth.uid()
            AND p.role = 'super_admin'::user_role
        )
    );

-- Update the role check functions
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role IN ('super_admin'::user_role, 'admin'::user_role)
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'super_admin'::user_role
    );
END;
$$;

-- Update the handle_new_user function to properly handle metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    default_role user_role;
    meta_data jsonb;
BEGIN
    -- Get metadata from the trigger
    meta_data := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

    -- Set default role based on metadata
    IF meta_data->>'role' IS NOT NULL AND 
       meta_data->>'role' IN ('super_admin', 'admin', 'location_admin', 'location_staff', 'customer_service', 'customer') THEN
        default_role := (meta_data->>'role')::user_role;
    ELSE
        default_role := 'customer'::user_role;
    END IF;

    -- Create profile
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        status
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(meta_data->>'firstName', ''),
        COALESCE(meta_data->>'lastName', ''),
        default_role,
        'active'
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role,
        updated_at = now();

    RETURN NEW;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.check_role_update(uuid, uuid, user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

COMMIT;