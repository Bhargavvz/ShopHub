# Database Setup Instructions

## 🚀 Quick Setup

### Step 1: Access Supabase SQL Editor
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: `cchddzyamdlytfvawvam`
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Setup Script
1. Open the file: `supabase/setup_database.sql`
2. Copy the entire SQL script
3. Paste it into the Supabase SQL Editor
4. Click **Run** to execute

### Step 3: Verify Tables Created
After running the script, verify all tables are created:
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

### Step 4: Create Your Admin Account
1. Register a new account through the website
2. Find your user ID in Supabase Authentication
3. Run this SQL to make yourself an admin:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Step 5 (Optional): Add Sample Products
Uncomment the sample data section in `setup_database.sql` and run it to add test products.

## 📋 Database Schema

### Tables Overview

#### 1. **profiles**
- User profile information
- Links to Supabase Auth
- Stores user role (user/admin)

#### 2. **products**
- Product catalog
- Includes pricing, stock, images
- Category filtering support

#### 3. **cart_items**
- Shopping cart items
- Links users to products
- Tracks quantities

#### 4. **orders**
- Order records
- Order status tracking
- Shipping address (JSON)

#### 5. **order_items**
- Individual items in orders
- Snapshot of product at order time
- Links to orders and products

## 🔐 Security Features

All tables have **Row Level Security (RLS)** enabled:

- ✅ Users can only access their own data
- ✅ Admins can access all data
- ✅ Products are publicly viewable
- ✅ Auth is required for cart/orders

## 🛠️ Useful SQL Queries

### View All Products
```sql
SELECT * FROM products ORDER BY created_at DESC;
```

### Check Your Profile
```sql
SELECT * FROM profiles WHERE id = auth.uid();
```

### View All Orders (Admin)
```sql
SELECT o.*, p.name as customer_name 
FROM orders o 
JOIN profiles p ON o.user_id = p.id 
ORDER BY o.created_at DESC;
```

### Get Order Statistics
```sql
SELECT 
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
FROM orders;
```

## ⚠️ Troubleshooting

### If migrations fail:
1. Drop all tables manually in Supabase
2. Re-run the setup script

### If RLS policies conflict:
The script includes `DROP POLICY IF EXISTS` to handle conflicts automatically.

### If you can't see data:
- Check you're logged in
- Verify RLS policies are set
- Ensure your user has the correct role

## 📞 Need Help?
Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
