-- First, ensure the profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    first_name text,
    last_name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

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

-- Add role column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        -- Add column without default first
        ALTER TABLE public.profiles ADD COLUMN role text;
        -- Then update all existing rows to 'customer'
        UPDATE public.profiles SET role = 'customer' WHERE role IS NULL;
    END IF;
EXCEPTION
    WHEN others THEN
        NULL;
END $$;

-- Ensure all existing roles are valid before conversion
UPDATE public.profiles
SET role = 'customer'
WHERE role IS NULL OR role NOT IN ('admin', 'location_admin', 'location_staff', 'customer_service', 'customer');

-- Convert any existing admin roles
UPDATE public.profiles
SET role = 'admin'
WHERE role IN ('super_admin', 'administrator');

-- Now alter the column to use the enum
ALTER TABLE public.profiles 
    ALTER COLUMN role TYPE user_role USING role::user_role;

-- After conversion, set the default and not null constraint
ALTER TABLE public.profiles 
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

-- Create policies for admin groups
CREATE POLICY "Allow admins to manage admin groups"
    ON admin_groups
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role::text = 'admin'
        )
    );

CREATE POLICY "Allow staff to view admin groups"
    ON admin_groups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role::text IN ('admin', 'location_admin', 'location_staff')
        )
    );

-- Create policies for group members
CREATE POLICY "Allow admins to manage group members"
    ON admin_group_members
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role::text = 'admin'
        )
    );

CREATE POLICY "Allow staff to view group members"
    ON admin_group_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role::text IN ('admin', 'location_admin', 'location_staff')
        )
    );

-- Create or replace the is_admin function
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
        AND role::text = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.admin_groups TO authenticated;
GRANT ALL ON public.admin_group_members TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Insert default admin groups
INSERT INTO admin_groups (name, description, group_type, status)
VALUES 
    ('System Administrators', 'Full system access and control', 'system', 'active'),
    ('Location Administrators', 'Manage specific location operations', 'location', 'active'),
    ('Location Staff', 'Handle day-to-day location tasks', 'location', 'active'),
    ('Customer Service', 'Handle customer support and service', 'system', 'active')
ON CONFLICT (id) DO NOTHING;