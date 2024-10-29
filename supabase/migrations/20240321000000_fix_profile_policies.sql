-- First, drop all existing policies on profiles
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own non-admin profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admins to insert profiles" ON public.profiles;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_or_service CASCADE;

-- Create a simplified is_admin function that doesn't recursively query profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check if running as service role
  IF current_setting('role') = 'service_role' THEN
    RETURN true;
  END IF;

  -- Check user role from auth.jwt() claim
  RETURN coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role') = 'super_admin'
    OR
    (current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new simplified policies
CREATE POLICY "Enable read access for users"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id 
    OR 
    public.is_admin() 
    OR 
    current_setting('role') = 'service_role'
  );

CREATE POLICY "Enable insert access for service role"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    current_setting('role') = 'service_role'
    OR
    auth.uid() = id
  );

CREATE POLICY "Enable update for users based on role"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR
    public.is_admin()
    OR
    current_setting('role') = 'service_role'
  )
  WITH CHECK (
    CASE
      WHEN public.is_admin() OR current_setting('role') = 'service_role' THEN true
      WHEN auth.uid() = id THEN
        -- Regular users can't upgrade themselves to admin roles
        CASE 
          WHEN NEW.role IN ('super_admin', 'admin') THEN false
          ELSE true
        END
      ELSE false
    END
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;

-- Enable RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;