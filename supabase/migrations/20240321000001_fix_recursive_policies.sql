-- First drop ALL existing functions with similar names
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.check_is_admin();
DROP FUNCTION IF EXISTS public.check_is_super_admin();
DROP FUNCTION IF EXISTS public.is_admin_or_service();
DROP FUNCTION IF EXISTS public.get_user_role();

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert access for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on role" ON public.profiles;

-- Create a new function with a unique name to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  -- First check if running as service_role
  IF current_setting('role') = 'service_role' THEN
    RETURN 'service_role';
  END IF;

  -- Get role from JWT claims
  RETURN coalesce(
    current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role',
    'customer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_current_user_role() IN ('super_admin', 'admin', 'location_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simple, non-recursive policies using the new functions
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (
  -- Users can read their own profile
  auth.uid() = id
  OR 
  -- Service role can read all profiles
  current_setting('role') = 'service_role'
  OR
  -- Admins can read all profiles
  public.is_user_admin()
);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (
  -- Service role can insert any profile
  current_setting('role') = 'service_role'
  OR
  -- Users can only insert their own profile
  auth.uid() = id
);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (
  -- Service role can update any profile
  current_setting('role') = 'service_role'
  OR
  -- Users can update their own profile
  auth.uid() = id
  OR
  -- Admins can update any profile
  public.is_user_admin()
)
WITH CHECK (
  -- Service role can update any profile
  current_setting('role') = 'service_role'
  OR
  -- Users can update their own profile but can't escalate privileges
  (auth.uid() = id AND NEW.role = OLD.role)
  OR
  -- Only super_admin can create other admins
  (public.get_current_user_role() = 'super_admin')
  OR
  -- Regular admins can update non-admin profiles
  (public.get_current_user_role() = 'admin' AND NEW.role NOT IN ('super_admin', 'admin'))
);

-- Create policy for delete operations
CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE USING (
  -- Only super_admin and service_role can delete profiles
  public.get_current_user_role() = 'super_admin'
  OR
  current_setting('role') = 'service_role'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_admin TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;