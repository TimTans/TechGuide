-- Migration: Create trigger to automatically insert user records into public.users table
-- This trigger fires when a new user is created in auth.users

-- Create a function that will be called by the trigger
-- SECURITY DEFINER allows the function to bypass RLS policies
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_role_value TEXT;
  user_is_active BOOLEAN;
BEGIN
  -- Extract values safely
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'user_role', 'student');
  user_is_active := COALESCE((NEW.raw_user_meta_data->>'is_active')::boolean, true);
  
  -- Only proceed if we have a valid user_id
  IF NEW.id IS NULL THEN
    RAISE WARNING 'handle_new_user: user_id is NULL, skipping insert';
    RETURN NEW;
  END IF;
  
  -- Insert user record, handling conflicts gracefully
  INSERT INTO public.users (
    user_id,
    email,
    first_name,
    last_name,
    user_role,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    user_role_value::role,
    user_is_active,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Error in handle_new_user trigger for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop the trigger if it exists (for re-running the migration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that fires after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Ensure the function is owned by postgres (superuser) to bypass RLS
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
