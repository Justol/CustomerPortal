-- Add new role types to the check constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN (
    'super_admin',
    'admin',
    'location_admin',
    'location_staff',
    'customer_service',
    'customer'
  ));

-- Update existing admin roles to super_admin if needed
UPDATE public.profiles 
SET role = 'super_admin' 
WHERE role = 'admin' 
AND id IN (
  -- Only update the first admin user to super_admin
  SELECT id 
  FROM public.profiles 
  WHERE role = 'admin' 
  ORDER BY created_at 
  LIMIT 1
);

-- Update the is_admin_or_service function to include new roles
CREATE OR REPLACE FUNCTION public.is_admin_or_service()
RETURNS boolean AS $$
BEGIN
  RETURN (
    current_setting('role') = 'service_role' OR
    EXISTS (
      SELECT 1 
      FROM public.profiles
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'location_admin')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add group_type column to admin_groups
ALTER TABLE public.admin_groups
ADD COLUMN IF NOT EXISTS group_type text NOT NULL DEFAULT 'custom'
CHECK (group_type IN (
  'system',
  'location',
  'customer',
  'custom'
));

-- Update existing groups with appropriate types
UPDATE public.admin_groups
SET group_type = CASE
  WHEN name = 'Super Admin' THEN 'system'
  WHEN name = 'Location Administrators' THEN 'location'
  WHEN name = 'Location Staff' THEN 'location'
  WHEN name = 'Customer Service' THEN 'system'
  WHEN name = 'Customers' THEN 'customer'
  ELSE 'custom'
END;