/*
  # Fix infinite recursion in profiles RLS policy

  1. Security Policy Updates
    - Remove problematic admin policy that causes infinite recursion
    - Simplify RLS policies to prevent circular references
    - Maintain security while fixing the recursion issue

  2. Changes Made
    - Drop the problematic "Admins can read all profiles" policy
    - Keep essential policies for users to manage their own profiles
    - Add a simpler admin policy that doesn't cause recursion
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create a new admin policy that doesn't cause recursion
-- This policy allows service role to read all profiles (for admin operations)
CREATE POLICY "Service role can read all profiles"
  ON profiles
  FOR SELECT
  TO service_role
  USING (true);

-- Ensure the existing user policies are still in place
-- (These should already exist based on your schema, but we'll recreate them to be safe)

-- Drop and recreate user policies to ensure they're correct
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Keep the service role insert policy
-- (This should already exist, but ensure it's there)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);