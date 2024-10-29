-- First drop all existing policies on the profiles table
DROP POLICY IF EXISTS "Allow admins to manage admin groups" ON public.profiles;
DROP POLICY IF EXISTS "Allow staff to view admin groups" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to manage group members" ON public.profiles;
DROP POLICY IF EXISTS "Allow staff to view group members" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own non-admin profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON public.profiles;

-- Create a security definer function to check admin status
-- This prevents recursive policy checking
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
        AND role = 'admin'::user_role
    );
END;
$$;

-- Create non-recursive policies using the security definer function
CREATE POLICY "profiles_select_policy"
    ON public.profiles
    FOR SELECT
    USING (
        id = auth.uid() -- Users can always see their own profile
        OR 
        public.check_is_admin() -- Admins can see all profiles
    );

CREATE POLICY "profiles_insert_policy"
    ON public.profiles
    FOR INSERT
    WITH CHECK (
        public.check_is_admin() -- Only admins can insert new profiles
    );

CREATE POLICY "profiles_update_policy"
    ON public.profiles
    FOR UPDATE
    USING (
        id = auth.uid() -- Users can update their own profile
        OR 
        public.check_is_admin() -- Admins can update any profile
    )
    WITH CHECK (
        (id = auth.uid() AND role = 'customer'::user_role) -- Regular users can't change their role
        OR 
        public.check_is_admin() -- Admins can change any field
    );

CREATE POLICY "profiles_delete_policy"
    ON public.profiles
    FOR DELETE
    USING (
        public.check_is_admin() -- Only admins can delete profiles
    );

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.check_is_admin() TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Make sure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a trigger to prevent users from elevating their own privileges
CREATE OR REPLACE FUNCTION prevent_self_role_elevation()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    IF (auth.uid() = NEW.id AND OLD.role != 'admin'::user_role AND NEW.role = 'admin'::user_role) THEN
        RAISE EXCEPTION 'Users cannot elevate their own role to admin';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_elevation ON public.profiles;
CREATE TRIGGER prevent_role_elevation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_self_role_elevation();