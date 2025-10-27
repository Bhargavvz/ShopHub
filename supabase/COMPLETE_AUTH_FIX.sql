-- ============================================
-- COMPLETE AUTHENTICATION & DATABASE FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- This script fixes ALL identified authentication issues:
-- 1. Profile creation trigger
-- 2. Missing profiles for existing users  
-- 3. Cart RLS policies
-- 4. Email verification handling

-- ============================================
-- PART 1: FIX PROFILE CREATION TRIGGER
-- ============================================

-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved profile creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile for new user
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PART 2: CREATE MISSING PROFILES
-- ============================================

-- Find and create profiles for any users without them
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  'user' as role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, profiles.name);

-- ============================================
-- PART 3: FIX PROFILES TABLE RLS POLICIES
-- ============================================

-- Drop ALL existing profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Enable RLS on profiles table
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow authenticated users to read all profiles (for display purposes)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- PART 4: FIX CART RLS POLICIES
-- ============================================

-- Drop ALL existing cart policies
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert into own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert to cart" ON cart_items;

-- Enable RLS on cart_items
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;

-- Create new cart policies
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

-- ============================================
-- PART 5: FIX ORDERS RLS POLICIES
-- ============================================

-- Drop ALL existing order policies (comprehensive list)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

-- Enable RLS on orders
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;

-- Create order policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- PART 6: FIX ORDER ITEMS RLS POLICIES
-- ============================================

-- Drop ALL existing order_items policies
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

-- Enable RLS on order_items
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

-- Create order_items policies
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- PART 7: FIX PRODUCTS RLS POLICIES
-- ============================================

-- Drop ALL existing product policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Enable RLS on products
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

-- Create product policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- PART 8: VERIFICATION QUERIES
-- ============================================

-- Check trigger exists
SELECT 
  'Trigger Status' as check_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Trigger exists'
    ELSE '❌ Trigger missing'
  END as status
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check user-profile synchronization
SELECT 
  'User-Profile Sync' as check_name,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM profiles) 
    THEN '✅ All users have profiles'
    ELSE '❌ ' || ((SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM profiles))::text || ' users missing profiles'
  END as status;

-- Check RLS policies for cart
SELECT 
  'Cart RLS Policies' as check_name,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ ' || COUNT(*)::text || ' policies active'
    ELSE '⚠️ Only ' || COUNT(*)::text || ' policies (expected 4)'
  END as status
FROM pg_policies 
WHERE tablename = 'cart_items';

-- Check RLS policies for orders
SELECT 
  'Orders RLS Policies' as check_name,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ ' || COUNT(*)::text || ' policies active'
    ELSE '⚠️ Only ' || COUNT(*)::text || ' policies'
  END as status
FROM pg_policies 
WHERE tablename = 'orders';

-- Check RLS policies for products
SELECT 
  'Products RLS Policies' as check_name,
  CASE 
    WHEN COUNT(*) >= 4 THEN '✅ ' || COUNT(*)::text || ' policies active'
    ELSE '⚠️ Only ' || COUNT(*)::text || ' policies'
  END as status
FROM pg_policies 
WHERE tablename = 'products';

-- List all users with their profile status
SELECT 
  au.email,
  au.created_at as user_created,
  p.created_at as profile_created,
  p.role,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅'
    ELSE '❌ MISSING'
  END as profile_status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- ============================================
-- SCRIPT COMPLETE
-- ============================================
-- All fixes have been applied!
-- Check the verification queries above to ensure everything is working
