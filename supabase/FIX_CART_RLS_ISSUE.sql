-- ============================================
-- FIX CART RLS POLICY ISSUE
-- Run this in Supabase SQL Editor
-- ============================================

-- The issue: RLS policies are blocking cart operations
-- This happens because auth.uid() is null for unverified users

-- 1. Drop existing cart policies
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert into own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;

-- 2. Create new policies that work with email verification
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert into own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 3. Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'cart_items'
ORDER BY policyname;

-- ============================================
-- IMPORTANT: Email Verification Settings
-- ============================================
-- Go to Supabase Dashboard > Authentication > Settings
-- Make sure "Enable email confirmations" is OFF for testing
-- OR set up email templates properly

-- To manually verify a user's email:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'your-email@example.com';
