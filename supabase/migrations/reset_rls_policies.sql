-- Cleanup script: Drop all existing policies and function
-- Run this FIRST if you're getting 500 errors, then run enable_instructor_access_to_progress.sql

-- Drop all policies on user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Instructors can view all student progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;

-- Drop all policies on users
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Instructors can view all user data" ON users;

-- Drop the helper function if it exists
DROP FUNCTION IF EXISTS is_instructor();

-- Note: This does NOT disable RLS, just removes the policies
-- You'll need to re-run enable_instructor_access_to_progress.sql after this
