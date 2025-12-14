# Supabase RLS Policies for Instructor Access

## Overview
This migration file enables instructors to view all student progress on tutorials. Without these policies, instructors will only be able to see their own progress (if any), not all students' progress.

## How to Apply

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `enable_instructor_access_to_progress.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI
If you have Supabase CLI set up:
```bash
supabase db push
```

Or manually:
```bash
supabase migration up
```

## What These Policies Do

### user_progress table policies:
1. **Users can view their own progress** - Students can see their own progress records
2. **Instructors can view all student progress** - Instructors can see all progress records for all students
3. **Users can insert their own progress** - Students can create their own progress records
4. **Users can update their own progress** - Students can update their own progress records

### users table policies:
1. **Users can view their own data** - Users can see their own user information
2. **Instructors can view all user data** - Instructors can see all users' data (needed to display student names/emails in progress views)

## Verification

After applying the policies, test by:
1. Sign in as an instructor
2. Navigate to any tutorial/course
3. You should see a "Student Progress" section showing all students who have started/completed that tutorial

If you see an error like "permission denied" or "policy violation", the policies may not have been applied correctly. Check:
- RLS is enabled on both `user_progress` and `users` tables
- The policies were created successfully
- Your user role is correctly set to 'instructor' in the database

## Troubleshooting

### If you're getting 500 errors after applying policies:

**First, drop all existing policies and start fresh:**

```sql
-- Drop all policies on user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Instructors can view all student progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;

-- Drop all policies on users
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Instructors can view all user data" ON users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS is_instructor();
```

Then re-run the migration SQL file.

### If instructors still can't see student progress:
1. Verify the user's role in the database:
   ```sql
   SELECT user_id, email, user_role FROM users WHERE email = 'instructor@example.com';
   ```
2. Check if RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user_progress', 'users');
   ```
3. List all policies:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('user_progress', 'users');
   ```
4. Test the helper function:
   ```sql
   SELECT is_instructor();
   ```
