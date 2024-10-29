-- This migration must run in its own transaction
BEGIN;
  -- Add super_admin to the enum if it doesn't exist
  DO $$ 
  BEGIN 
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END $$;
COMMIT;

-- Create a function to create a super admin user
CREATE OR REPLACE FUNCTION create_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    auth_user_id uuid;
BEGIN
    -- First check if we already have a super admin
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE role = 'super_admin'::user_role
    ) THEN
        RETURN;
    END IF;

    -- Create auth user first (this requires proper auth.users access)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(), -- Generate a new UUID for the user
        'authenticated',
        'authenticated',
        'admin@example.com',
        crypt('admin123', gen_salt('bf')), -- Default password: admin123
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"role": "super_admin"}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO auth_user_id;

    -- Now create the profile with the same UUID
    INSERT INTO profiles (
        id,
        email,
        first_name,
        last_name,
        role,
        status
    ) VALUES (
        auth_user_id,
        'admin@example.com',
        'Super',
        'Admin',
        'super_admin'::user_role,
        'active'
    );

EXCEPTION
    WHEN others THEN
        -- Log error details
        RAISE NOTICE 'Error creating super admin: %', SQLERRM;
END;
$$;

-- Execute the function to create super admin
SELECT create_super_admin();