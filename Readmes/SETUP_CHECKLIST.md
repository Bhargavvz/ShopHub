# ✅ ShopHub Setup Checklist

## 🎯 Follow These Steps in Order

### Step 1: Database Setup (CRITICAL - DO THIS FIRST!)
- [ ] Go to [Supabase Dashboard](https://app.supabase.com)
- [ ] Open your project
- [ ] Navigate to **SQL Editor**
- [ ] Open file: `supabase/setup_database.sql`
- [ ] Copy all the SQL code
- [ ] Paste into Supabase SQL Editor
- [ ] Click **"Run"** button
- [ ] Wait for success message
- [ ] Verify tables created (run verification query from DATABASE_SETUP.md)

### Step 2: Environment Check
- [ ] Verify `.env` file exists
- [ ] Check `VITE_SUPABASE_URL` is set correctly
- [ ] Check `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] Both values match your Supabase project

### Step 3: Install Dependencies
- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Check for any error messages

### Step 4: Start Development Server
- [ ] Run: `npm run dev`
- [ ] Server should start on `http://localhost:5173`
- [ ] Open browser to that URL
- [ ] Landing page should display

### Step 5: Create Your Account
- [ ] Click **"Sign Up"** or **"Register"**
- [ ] Fill in your details:
  - Name: Your Name
  - Email: your-email@example.com
  - Password: (at least 6 characters)
  - Confirm Password
- [ ] Click **"Create Account"**
- [ ] Should be logged in and redirected

### Step 6: Make Yourself Admin
- [ ] Go to [Supabase Dashboard](https://app.supabase.com)
- [ ] Navigate to **Authentication** → **Users**
- [ ] Find your user and copy the **ID**
- [ ] Go to **SQL Editor**
- [ ] Run this query (replace YOUR_USER_ID):
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID';
```
- [ ] Refresh your website
- [ ] Log out and log back in
- [ ] You should now see **"Admin Dashboard"** in navbar

### Step 7: Add Sample Products
Option A - Using Admin Panel:
- [ ] Click **Admin Dashboard**
- [ ] Click **Manage Products**
- [ ] Click **"Add Product"** button
- [ ] Fill in product details
- [ ] Click **"Create Product"**
- [ ] Repeat for more products

Option B - Using SQL (Faster):
- [ ] Go to Supabase SQL Editor
- [ ] Copy the sample products SQL from `QUICK_START_GUIDE.md`
- [ ] Run the SQL
- [ ] Refresh the Products page

### Step 8: Test All Features

#### Test Landing Page
- [ ] Visit `/` (landing page displays)
- [ ] All sections load correctly
- [ ] Images display properly
- [ ] Buttons work

#### Test Product Browsing
- [ ] Click **"Products"** or **"Start Shopping"**
- [ ] Products display in grid
- [ ] Category filters work
- [ ] Search functionality works

#### Test Shopping Cart
- [ ] Click **"Add"** on a product
- [ ] Cart icon shows item count
- [ ] Click cart icon
- [ ] Product appears in cart
- [ ] Can update quantity
- [ ] Can remove items
- [ ] Total calculates correctly

#### Test Checkout
- [ ] From cart, click **"Proceed to Checkout"**
- [ ] Fill in shipping address form
- [ ] Click **"Place Order"**
- [ ] Redirects to order success page
- [ ] Order details display correctly

#### Test Orders
- [ ] Click **"Orders"** in navbar
- [ ] Order history displays
- [ ] Click on an order
- [ ] Order details show correctly

#### Test Profile
- [ ] Click your name → **"My Profile"**
- [ ] Can update name
- [ ] Can change password
- [ ] Changes save correctly

#### Test Admin Dashboard
- [ ] Click **"Admin Dashboard"**
- [ ] Stats display (orders, revenue, products)
- [ ] Recent orders show
- [ ] Quick action buttons work

#### Test Product Management
- [ ] Admin → **Manage Products**
- [ ] All products listed
- [ ] Can add new product
- [ ] Can edit existing product
- [ ] Can delete product

#### Test Order Management
- [ ] Admin → **Manage Orders**
- [ ] All orders from all users display
- [ ] Can filter by status
- [ ] Can update order status
- [ ] Status changes save

#### Test 404 Page
- [ ] Visit a non-existent URL (e.g., `/test123`)
- [ ] 404 page displays
- [ ] Navigation buttons work

### Step 9: Verify Code Quality
- [ ] Run: `npm run typecheck`
- [ ] Should complete with no errors
- [ ] Run: `npm run lint`
- [ ] Fix any linting issues if needed

### Step 10: Final Checks
- [ ] All pages load without errors
- [ ] All links work correctly
- [ ] Forms submit properly
- [ ] Data persists in database
- [ ] Images load correctly
- [ ] Mobile responsive (test on small screen)
- [ ] No console errors in browser

---

## ✅ Completion Checklist

Once all steps above are complete:

- [ ] Database is set up and working
- [ ] Website runs without errors
- [ ] Can register and login
- [ ] Admin role is configured
- [ ] Products are added
- [ ] Can add items to cart
- [ ] Can complete checkout
- [ ] Can view orders
- [ ] Admin features work
- [ ] All tests passed

---

## 🎉 You're Done!

If all checkboxes are checked, your ShopHub e-commerce website is fully functional!

## 📚 Reference Documents

- **README.md** - Full documentation
- **DATABASE_SETUP.md** - Database details
- **QUICK_START_GUIDE.md** - Detailed testing guide
- **PROJECT_SUMMARY.md** - What was built

## 🆘 If Something Doesn't Work

1. Check the console for errors (F12 in browser)
2. Verify database setup completed successfully
3. Check `.env` file has correct values
4. Try clearing browser cache
5. Restart development server
6. Review the troubleshooting section in QUICK_START_GUIDE.md

---

**Need Help?** All documentation files have detailed instructions and troubleshooting tips!
