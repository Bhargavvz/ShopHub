# 🔧 Fix Signup/Login Issue - Step by Step

## ❌ Problem
You're getting a 401 error when signing up:
```
POST https://cchddzyamdlytfvawvam.supabase.co/rest/v1/profiles 401 (Unauthorized)
```

**Why this happens:**
- User gets created in Supabase Auth ✅
- But profile creation fails due to RLS policies ❌
- User can't login because profile doesn't exist ❌

---

## ✅ Solution - Follow These Steps

### Step 1: Run the Quick Fix SQL (URGENT)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project
3. Click **SQL Editor** in the left sidebar
4. Open the file: `supabase/FIX_SIGNUP_ISSUE.sql`
5. Copy **ALL** the SQL code
6. Paste into the Supabase SQL Editor
7. Click **Run** button
8. Wait for success message

This will:
- ✅ Fix the RLS policies
- ✅ Create an automatic trigger for new signups
- ✅ Create profiles for existing users who are missing them

### Step 2: Verify the Fix

Run these queries in SQL Editor to verify:

```sql
-- Check if trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Expected:** Should return 1 row with the trigger name

```sql
-- Check all users have profiles
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM profiles) as profiles;
```

**Expected:** Both numbers should be equal

### Step 3: Test Signup Again

1. **Clear your browser cache** (important!)
2. Try to sign up with a **NEW email address**
3. Check your email for verification
4. Click the verification link
5. Try to login

**Expected:** ✅ Should work now!

### Step 4: Fix Your Existing Account (If Already Registered)

If you already created an account but can't login, run this:

```sql
-- Replace with YOUR email address
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  au.id,
  au.email,
  split_part(au.email, '@', 1) as name,
  'user' as role
FROM auth.users au
WHERE au.email = 'YOUR_EMAIL@example.com'
  AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = au.id);
```

Then try to login again.

---

## 🔍 How to Check if You Have This Issue

Run this in SQL Editor:

```sql
-- Find users without profiles
SELECT 
  au.email,
  au.created_at,
  CASE WHEN p.id IS NULL THEN '❌ Missing Profile' ELSE '✅ Has Profile' END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
```

If you see "❌ Missing Profile", you need to run the fix.

---

## 📝 What Changed

### Before (Broken):
```
User Signup → Auth Created ✅ → Manual Profile Insert ❌ (401 Error) → Can't Login ❌
```

### After (Fixed):
```
User Signup → Auth Created ✅ → Auto Profile Created ✅ (via trigger) → Can Login ✅
```

---

## 🎯 Technical Details

### The Fix Includes:

1. **Database Trigger:**
   - Automatically creates profile when user signs up
   - Runs with SECURITY DEFINER (bypasses RLS)
   - Handles duplicate prevention

2. **Updated RLS Policies:**
   - Allows authenticated users to insert their own profile
   - Prevents conflicts

3. **Retroactive Fix:**
   - Creates profiles for existing users
   - Ensures no one is locked out

4. **Code Update:**
   - `authService.ts` now waits for trigger to complete
   - Better error handling

---

## ✅ Testing Checklist

After running the fix:

- [ ] Can register new account
- [ ] Receive verification email
- [ ] Can verify email
- [ ] Can login successfully
- [ ] Profile appears in database
- [ ] Can access protected pages

---

## 🆘 Still Having Issues?

### Issue: "Still getting 401 error"
**Solution:** 
1. Clear browser cache completely
2. Try in incognito/private window
3. Make sure you ran ALL the SQL from FIX_SIGNUP_ISSUE.sql

### Issue: "Can't login with old account"
**Solution:**
1. Find your user ID in Supabase Auth > Users
2. Run the manual profile creation SQL (Step 4 above)

### Issue: "Trigger not working"
**Solution:**
```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Recreate trigger if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## 🎉 After Fix is Applied

Your signup flow will work perfectly:

1. User fills registration form
2. Supabase creates auth user
3. **Trigger automatically creates profile** ✨
4. User gets verification email
5. User verifies email
6. User can login
7. Profile data loads correctly
8. Everything works! 🎉

---

**Need More Help?** Check the verification queries in FIX_SIGNUP_ISSUE.sql
