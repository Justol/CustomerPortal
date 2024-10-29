-- First, update the user_role enum to include super_admin
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Drop existing policies and functions
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP FUNCTION IF EXISTS public.check_is_admin();

-- Create an improved function to check admin status that includes super_admin
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role IN ('super_admin'::user_role, 'admin'::user_role)
    );
END;
$$;

-- Create a function to check if the user is a super admin
CREATE OR REPLACE FUNCTION public.check_is_super_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role = 'super_admin'::user_role
    );
END;
$$;

-- Create new policies with super_admin support
CREATE POLICY "profiles_select_policy"
    ON public.profiles
    FOR SELECT
    USING (
        id = auth.uid() -- Users can always see their own profile
        OR 
        public.check_is_admin() -- Admins and super admins can see all profiles
    );

CREATE POLICY "profiles_insert_policy"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        public.check_is_admin() -- Only admins and super admins can insert new profiles
    );

CREATE POLICY "profiles_update_policy"
    ON public.profiles
    FOR UPDATE
    USING (
        id = auth.uid() -- Users can update their own profile
        OR 
        public.check_is_admin() -- Admins and super admins can update any profile
    )
    WITH CHECK (
        (id = auth.uid() AND role = 'customer'::user_role) -- Regular users can't change their role
        OR 
        (role != 'super_admin'::user_role AND public.check_is_admin()) -- Admins can't create super admins
        OR
        public.check_is_super_admin() -- Super admins can do anything
    );

CREATE POLICY "profiles_delete_policy"
    ON public.profiles
    FOR DELETE
    USING (
        public.check_is_super_admin() -- Only super admins can delete profiles
    );

-- Update the prevent_self_role_elevation trigger
CREATE OR REPLACE FUNCTION prevent_self_role_elevation()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Allow super_admin to make any changes
    IF public.check_is_super_admin() THEN
        RETURN NEW;
    END IF;

    -- Prevent regular users from elevating their role
    IF (auth.uid() = NEW.id AND 
        OLD.role != 'admin'::user_role AND 
        NEW.role IN ('admin'::user_role, 'super_admin'::user_role)) THEN
        RAISE EXCEPTION 'Users cannot elevate their own role to admin or super_admin';
    END IF;

    -- Prevent admins from creating or modifying super_admin roles
    IF (NOT public.check_is_super_admin() AND NEW.role = 'super_admin'::user_role) THEN
        RAISE EXCEPTION 'Only super_admin users can create or modify super_admin roles';
    END IF;

    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS prevent_role_elevation ON public.profiles;
CREATE TRIGGER prevent_role_elevation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_self_role_elevation();

-- Update the handle_new_user function to support super_admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    default_role user_role;
    user_metadata jsonb;
BEGIN
    -- Get user metadata
    user_metadata := NEW.raw_user_meta_data;

    -- Determine role (default to customer if not specified)
    IF user_metadata->>'role' IS NOT NULL AND 
       user_metadata->>'role' IN ('super_admin', 'admin', 'location_admin', 'location_staff', 'customer_service', 'customer') THEN
        default_role := (user_metadata->>'role')::user_role;
    ELSE
        default_role := 'customer'::user_role;
    END IF;

    -- Insert new profile
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
        COALESCE(user_metadata->>'firstName', ''),
        COALESCE(user_metadata->>'lastName', ''),
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
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_is_super_admin() TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Make sure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;