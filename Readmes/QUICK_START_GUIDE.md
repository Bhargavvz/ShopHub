# 🚀 Quick Start Guide - ShopHub

## ✅ Step-by-Step Setup

### 1. Database Setup (⚠️ IMPORTANT - Do This First!)

#### Option A: Using Supabase SQL Editor (Recommended)
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Open your project: `cchddzyamdlytfvawvam`
3. Click **SQL Editor** in the left sidebar
4. Copy the entire content from `supabase/setup_database.sql`
5. Paste into the SQL Editor
6. Click **Run** button
7. Wait for success message

#### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### 2. Verify Database Setup

Run this query in SQL Editor to verify tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- ✅ cart_items
- ✅ order_items
- ✅ orders
- ✅ products
- ✅ profiles

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The website should open at: **http://localhost:5173**

---

## 🎯 Testing the Website Flow

### Test 1: Landing Page ✨
1. **Visit**: `http://localhost:5173/`
2. **Expected**: Beautiful landing page with:
   - Hero section with "Welcome to ShopHub"
   - Features section (Free Shipping, Secure Payment, etc.)
   - Category cards
   - Stats section
   - Call-to-action buttons

### Test 2: User Registration 📝
1. Click **"Sign Up"** or **"Register"**
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **"Create Account"**
4. **Expected**: Redirected to home page, logged in

### Test 3: Browse Products 🛍️
1. Click **"Products"** in navbar or **"Start Shopping"**
2. **Expected**: 
   - Product grid (may be empty if no products added)
   - Category filters
   - Search functionality

### Test 4: Add Sample Products (Admin Only) 👨‍💼

**First, make yourself an admin:**
1. Go to Supabase > Authentication > Users
2. Copy your user ID
3. Go to SQL Editor and run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID_HERE';
```

**Then add products:**
1. Refresh the website and log in again
2. You should now see **"Admin Dashboard"** in the navbar
3. Click **Admin Dashboard** → **Manage Products**
4. Click **"Add Product"**
5. Fill in product details:
   - Name: `Wireless Headphones`
   - Description: `High-quality wireless headphones with noise cancellation`
   - Price: `99.99`
   - Stock: `50`
   - Image URL: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500`
   - Category: `Electronics`
6. Click **"Create Product"**
7. Repeat for more products!

### Test 5: Shopping Cart 🛒
1. Go to **Products** page
2. Click **"Add"** on any product
3. Click cart icon in navbar
4. **Expected**:
   - Product appears in cart
   - Can update quantity
   - Can remove items
   - Total calculated correctly

### Test 6: Checkout Process 💳
1. Add items to cart
2. Click **"Proceed to Checkout"**
3. Fill in shipping address:
   - Full Name: `John Doe`
   - Address: `123 Main St`
   - City: `New York`
   - State: `NY`
   - Postal Code: `10001`
   - Country: `USA`
   - Phone: `+1 555-123-4567`
4. Click **"Place Order"**
5. **Expected**: Redirected to order success page

### Test 7: Order History 📦
1. Click **"Orders"** in navbar
2. **Expected**: List of all your orders
3. Click on an order
4. **Expected**: Detailed order information

### Test 8: User Profile 👤
1. Click your name in navbar → **"My Profile"**
2. **Expected**:
   - Can update name
   - Can change password
   - View account info

### Test 9: Admin Dashboard 👨‍💼 (Admin Only)
1. Click **"Admin Dashboard"**
2. **Expected**:
   - Total orders count
   - Total revenue
   - Pending orders
   - Total products
   - Recent orders list
   - Quick action buttons

### Test 10: Manage Orders (Admin Only) 📋
1. **Admin Dashboard** → **Manage Orders**
2. **Expected**:
   - All orders from all users
   - Filter by status
   - Can update order status
   - View order details

### Test 11: 404 Page 🚫
1. Visit: `http://localhost:5173/nonexistent-page`
2. **Expected**: 404 Not Found page with navigation options

---

## 🎨 Website Flow Map

```
Landing Page (/)
    ├── Sign Up → Register Page
    ├── Login → Login Page
    └── Start Shopping → Products Page
    
Products Page (/products)
    ├── Product Card → Product Detail Page
    │   └── Add to Cart → Cart Page
    └── Search/Filter → Filtered Products

Cart Page (/cart)
    └── Checkout → Checkout Page
        └── Place Order → Order Success
            └── View Orders → Orders Page

Orders Page (/orders)
    └── Order Item → Order Detail Page

Profile Page (/profile)
    ├── Update Profile
    └── Change Password

Admin Dashboard (/admin)
    ├── Manage Products
    │   ├── Add Product → Product Form
    │   └── Edit Product → Product Form (Edit)
    └── Manage Orders
        └── Update Status
```

---

## 📊 Database Sample Data (Optional)

To add sample products quickly, run this in Supabase SQL Editor:

```sql
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'Electronics'),
('Smart Watch', 'Feature-rich smartwatch with fitness tracking', 199.99, 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'Electronics'),
('Running Shoes', 'Comfortable running shoes for all terrains', 79.99, 100, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'Footwear'),
('Laptop Backpack', 'Durable backpack with laptop compartment', 49.99, 75, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 'Accessories'),
('Coffee Maker', 'Automatic coffee maker with timer', 129.99, 25, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 'Home'),
('Yoga Mat', 'Non-slip yoga mat with carrying strap', 29.99, 150, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 'Fitness'),
('Bluetooth Speaker', 'Portable waterproof bluetooth speaker', 59.99, 60, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 'Electronics'),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 45, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 'Home')
ON CONFLICT DO NOTHING;
```

---

## ✅ Checklist for Complete Setup

- [ ] Database tables created (run setup_database.sql)
- [ ] Environment variables configured (.env file)
- [ ] Dependencies installed (npm install)
- [ ] Development server running (npm run dev)
- [ ] User account created
- [ ] Admin account created (updated role in database)
- [ ] Sample products added
- [ ] Tested registration/login
- [ ] Tested product browsing
- [ ] Tested cart functionality
- [ ] Tested checkout process
- [ ] Tested order viewing
- [ ] Tested admin dashboard
- [ ] Tested product management
- [ ] Tested order management

---

## 🐛 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Check your `.env` file has correct values

### Issue: Products not showing
**Solution**: Add products via Admin Dashboard or run sample data SQL

### Issue: Can't access admin pages
**Solution**: Make sure you updated your role to 'admin' in the database

### Issue: Cart items not saving
**Solution**: Verify cart_items table exists and RLS policies are correct

### Issue: Orders not creating
**Solution**: Check orders and order_items tables and RLS policies

---

## 🎉 You're All Set!

Your ShopHub e-commerce website is now ready to use!

**Next Steps:**
1. Add more products
2. Customize the landing page
3. Add payment integration (Stripe)
4. Deploy to production

**Need Help?**
- Check `README.md` for detailed documentation
- Check `DATABASE_SETUP.md` for database info
- Review the code in `src/` folder

Happy Shopping! 🛍️
