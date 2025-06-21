/*
  # Fix infinite recursion in profiles RLS policies

  1. Policy Changes
    - Remove the problematic "Admins can read all profiles" policy that causes infinite recursion
    - Add a safe service role policy for admin operations
    - Ensure user policies are properly configured

  2. Security
    - Maintain RLS protection for user data
    - Allow service role access for admin operations
    - Prevent infinite recursion in policy evaluation
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
-- Drop and recreate user policies to ensure they're correct
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Recreate all necessary policies
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

CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);