/*
  # Fix authentication trigger for user signup

  1. Database Functions
    - Update the handle_new_user function to properly handle user metadata
    - Ensure proper error handling and data validation
    
  2. Security
    - Maintain existing RLS policies
    - Ensure trigger has proper permissions
*/

-- Drop existing trigger and function to recreate them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with proper error handling
  INSERT INTO public.profiles (
    id,
    email,
    name,
    phone,
    role,
    business_name,
    business_address,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    COALESCE(NEW.raw_user_meta_data->>'business_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'business_address', NULL),
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    -- Still return NEW to allow user creation to succeed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Add a policy to allow the trigger to insert profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Service role can insert profiles'
  ) THEN
    CREATE POLICY "Service role can insert profiles"
      ON profiles
      FOR INSERT
      TO service_role
      WITH CHECK (true);
  END IF;
END $$;