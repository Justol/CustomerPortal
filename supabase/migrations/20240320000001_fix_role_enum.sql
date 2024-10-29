-- First, check if the role column exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role') 
    THEN
        ALTER TABLE profiles ADD COLUMN role text;
    END IF;
END $$;

-- Drop existing enum if it exists
DROP TYPE IF EXISTS user_role CASCADE;

-- Create the user_role enum with correct values
CREATE TYPE user_role AS ENUM (
    'admin',
    'location_admin',
    'location_staff',
    'customer_service',
    'customer'
);

-- Set default role for existing users if role is null
UPDATE profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- Convert existing role values to match new enum
UPDATE profiles 
SET role = 'admin' 
WHERE role IN ('super_admin', 'administrator');

-- Now alter the column to use the enum
ALTER TABLE profiles 
    ALTER COLUMN role TYPE user_role USING role::user_role,
    ALTER COLUMN role SET DEFAULT 'customer'::user_role,
    ALTER COLUMN role SET NOT NULL;

-- Update admin groups related tables
CREATE TABLE IF NOT EXISTS admin_groups (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    group_type text NOT NULL CHECK (group_type IN ('system', 'location', 'customer', 'custom')) DEFAULT 'custom',
    status text NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_group_members (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id uuid REFERENCES admin_groups(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(group_id, user_id)
);

-- Enable RLS on the tables
ALTER TABLE admin_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_group_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admins to manage admin groups" ON admin_groups;
DROP POLICY IF EXISTS "Allow staff to view admin groups" ON admin_groups;
DROP POLICY IF EXISTS "Allow admins to manage group members" ON admin_group_members;
DROP POLICY IF EXISTS "Allow staff to view group members" ON admin_group_members;

-- Create new policies with correct role values
CREATE POLICY "Allow admins to manage admin groups"
    ON admin_groups
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'::user_role
        )
    );

CREATE POLICY "Allow staff to view admin groups"
    ON admin_groups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin'::user_role, 'location_admin'::user_role, 'location_staff'::user_role)
        )
    );

CREATE POLICY "Allow admins to manage group members"
    ON admin_group_members
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'::user_role
        )
    );

CREATE POLICY "Allow staff to view group members"
    ON admin_group_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin'::user_role, 'location_admin'::user_role, 'location_staff'::user_role)
        )
    );

-- Update or create the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid DEFAULT null)
RETURNS boolean AS $$
BEGIN
    -- If no user_id provided, check current user
    IF check_user_id IS NULL THEN
        check_user_id := auth.uid();
    END IF;
    
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles
        WHERE id = check_user_id 
        AND role = 'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admin_groups TO authenticated;
GRANT ALL ON public.admin_group_members TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Create default admin groups if they don't exist
INSERT INTO admin_groups (name, description, group_type, status)
VALUES 
    ('System Administrators', 'Full system access and control', 'system', 'active'),
    ('Location Administrators', 'Manage specific location operations', 'location', 'active'),
    ('Location Staff', 'Handle day-to-day location tasks', 'location', 'active'),
    ('Customer Service', 'Handle customer support and service', 'system', 'active')
ON CONFLICT (id) DO NOTHING;