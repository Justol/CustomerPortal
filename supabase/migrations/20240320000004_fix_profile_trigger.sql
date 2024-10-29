-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a more robust function to handle new user creation
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
       user_metadata->>'role' IN ('admin', 'location_admin', 'location_staff', 'customer_service', 'customer') THEN
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;