# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## 🚨 URGENT: 401 Error on Signup/Login

### Symptoms:
- Getting 401 error when signing up
- User verification email received but can't login
- Error: `POST .../rest/v1/profiles 401 (Unauthorized)`

### Root Cause:
Profile creation fails due to RLS policies or missing database trigger.

### ✅ SOLUTION:

**Step 1: Run the Quick Fix**
1. Open Supabase SQL Editor
2. Copy ALL content from `supabase/FIX_SIGNUP_ISSUE.sql`
3. Paste and run in SQL Editor
4. Wait for completion

**Step 2: Verify Fix**
```sql
-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check users have profiles
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM profiles;
-- Numbers should match!
```

**Step 3: Test**
- Clear browser cache
- Try signup with NEW email
- Should work now ✅

**See [FIX_LOGIN_ISSUE.md](FIX_LOGIN_ISSUE.md) for detailed steps**

---

## 🔐 Authentication Issues

### Can't Register New Account

**Problem:** Registration form submits but nothing happens

**Solutions:**
1. Check browser console for errors
2. Verify `.env` file has correct Supabase credentials
3. Check Supabase Auth is enabled
4. Run FIX_SIGNUP_ISSUE.sql

### Can't Login with Existing Account

**Problem:** Correct credentials but login fails

**Solutions:**

1. **Check if profile exists:**
```sql
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

2. **If profile missing, create it:**
```sql
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  au.id,
  au.email,
  split_part(au.email, '@', 1),
  'user'
FROM auth.users au
WHERE au.email = 'your-email@example.com';
```

3. **Try login again**

### Email Not Verified

**Problem:** Can't login because email not verified

**Solutions:**
1. Check spam folder for verification email
2. Request new verification email:
   - Go to Supabase > Authentication > Users
   - Find your user
   - Click "Send verification email"
3. Or manually verify in Supabase dashboard

---

## 📦 Product Issues

### Products Not Showing

**Problem:** Products page is empty

**Solutions:**

1. **Check if products exist:**
```sql
SELECT COUNT(*) FROM products;
```

2. **Add sample products:**
```sql
-- Copy from QUICK_START_GUIDE.md or setup_database.sql
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Test Product', 'Test Description', 9.99, 10, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Test');
```

3. **Check RLS policies:**
```sql
-- Products should be viewable by everyone
SELECT * FROM products LIMIT 1;
-- If this fails, RLS policies are wrong
```

### Can't Add Products (Admin)

**Problem:** Add Product form doesn't work

**Solutions:**

1. **Verify you're admin:**
```sql
SELECT role FROM profiles WHERE email = 'your-email@example.com';
-- Should return 'admin'
```

2. **Make yourself admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

3. **Logout and login again**

---

## 🛒 Cart Issues

### Cart Items Not Saving

**Problem:** Items disappear from cart after page refresh

**Solutions:**

1. **Check if logged in** - Cart requires authentication

2. **Check RLS policies:**
```sql
-- Test cart access
SELECT * FROM cart_items WHERE user_id = auth.uid();
```

3. **Clear cart and try again:**
```sql
DELETE FROM cart_items WHERE user_id = auth.uid();
```

### Can't Update Cart Quantity

**Problem:** Quantity update button doesn't work

**Solutions:**
1. Check browser console for errors
2. Verify product still has stock
3. Check cart_items table has correct data

---

## 💳 Checkout Issues

### Checkout Button Disabled

**Problem:** Can't proceed to checkout

**Solutions:**
1. Make sure cart has items
2. Check all items have valid products
3. Verify you're logged in

### Order Not Creating

**Problem:** Checkout form submits but no order created

**Solutions:**

1. **Check orders table:**
```sql
SELECT * FROM orders WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 5;
```

2. **Check order_items:**
```sql
SELECT * FROM order_items WHERE order_id IN (
  SELECT id FROM orders WHERE user_id = auth.uid()
) LIMIT 10;
```

3. **Verify RLS policies allow order creation**

---

## 👨‍💼 Admin Issues

### Can't Access Admin Dashboard

**Problem:** Admin menu not showing or redirects

**Solutions:**

1. **Check role in database:**
```sql
SELECT id, email, name, role FROM profiles WHERE email = 'your-email@example.com';
```

2. **Update role to admin:**
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

3. **Logout and login again** (important!)

4. **Clear browser cache**

---

## 🗄️ Database Issues

### Tables Missing

**Problem:** Database tables don't exist

**Solution:**
1. Run `supabase/setup_database.sql` in Supabase SQL Editor
2. Verify all tables created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### RLS Policies Not Working

**Problem:** Getting permission errors

**Solution:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should all be 't' (true)

-- Recreate policies by running setup_database.sql again
```

### Trigger Not Firing

**Problem:** Profiles not auto-creating on signup

**Solution:**
```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## 🌐 Application Issues

### White Screen / Blank Page

**Problem:** Website shows blank page

**Solutions:**
1. Check browser console for errors
2. Verify dev server is running: `npm run dev`
3. Check `.env` file exists with correct values
4. Try: `npm install` then `npm run dev`

### TypeScript Errors

**Problem:** Type errors in code

**Solution:**
```bash
npm run typecheck
# Fix any errors shown
```

### Build Fails

**Problem:** `npm run build` fails

**Solutions:**
1. Run `npm run typecheck` first
2. Fix all TypeScript errors
3. Run `npm install` to ensure all deps installed
4. Try build again

---

## 🔍 Debugging Tips

### Enable Detailed Logging

Add this to your code temporarily:

```typescript
// In authService.ts
console.log('Auth response:', authData);
console.log('Profile data:', profile);

// In cartService.ts
console.log('Cart items:', data);
```

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try the action that's failing
4. Look for red (failed) requests
5. Click on them to see error details

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Look for errors around the time of your action

### Verify Environment Variables

```bash
# In your project root
cat .env
# or on Windows
type .env

# Should show:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

---

## 🆘 Still Stuck?

### Checklist Before Asking for Help

- [ ] Ran `supabase/FIX_SIGNUP_ISSUE.sql`
- [ ] Cleared browser cache
- [ ] Checked browser console for errors
- [ ] Verified `.env` file has correct values
- [ ] Confirmed database tables exist
- [ ] Checked user role in database
- [ ] Tried in incognito/private window
- [ ] Restarted dev server

### How to Report Issues

Include:
1. **Error message** (exact text or screenshot)
2. **When it happens** (signup, login, checkout, etc.)
3. **Browser console errors** (screenshot)
4. **What you tried** (list solutions you attempted)
5. **SQL query results** (if database-related)

---

## 📚 Helpful SQL Queries

### Check Everything

```sql
-- User info
SELECT id, email, name, role, created_at FROM profiles WHERE email = 'YOUR_EMAIL';

-- Products count
SELECT COUNT(*) as product_count FROM products;

-- Cart items
SELECT ci.*, p.name, p.price FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = auth.uid();

-- Recent orders
SELECT * FROM orders WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 5;

-- Triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- RLS status
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

---

**Remember:** Most issues are fixed by:
1. Running FIX_SIGNUP_ISSUE.sql
2. Clearing browser cache
3. Logging out and back in
4. Checking database for correct data

Good luck! 🚀
