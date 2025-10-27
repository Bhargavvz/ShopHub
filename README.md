# 🛍️ ShopHub - Modern E-commerce Platform

A full-featured e-commerce web application built with React, TypeScript, Vite, and Supabase.

![ShopHub](https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop)

## ✨ Features

### 🔐 User Features
- **Authentication**: Secure login/register with Supabase Auth
- **Landing Page**: Beautiful, modern landing page with hero section
- **Product Browsing**: Browse products with category filtering and search
- **Product Details**: Detailed product pages with image, description, and stock info
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Complete checkout flow with shipping address
- **Order History**: View past orders and order details
- **User Profile**: Update profile info and change password
- **Responsive Design**: Mobile-first, fully responsive UI

### 👨‍💼 Admin Features
- **Admin Dashboard**: Overview with stats (revenue, orders, products)
- **Product Management**: Create, read, update, delete products
- **Order Management**: View all orders and update order status
- **Role-Based Access**: Admin-only routes and features

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time form validation with React Hook Form
- **Icons**: Beautiful icons from Lucide React
- **Animations**: Smooth transitions and hover effects

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **React Router DOM v7** - Client-side routing
- **React Hook Form** - Form handling
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Payment (Ready for Integration)
- **Stripe** - Payment processing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**
- Go to your Supabase project
- Navigate to SQL Editor
- Copy and run the SQL from `supabase/setup_database.sql`
- See `DATABASE_SETUP.md` for detailed instructions

5. **Create an admin user**
- Register a new account through the website
- In Supabase, run:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── cart/           # Cart components
│   │   ├── common/         # Common components (Button, Input, etc.)
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── products/       # Product components
│   │   └── routes/         # Route guards (PrivateRoute, AdminRoute)
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx # Authentication context
│   │   └── CartContext.tsx # Shopping cart context
│   ├── lib/                # Utility libraries
│   │   └── supabase.ts    # Supabase client
│   ├── pages/              # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── Cart.tsx       # Shopping cart page
│   │   ├── Checkout.tsx   # Checkout page
│   │   ├── Home.tsx       # Home/Landing page
│   │   ├── Landing.tsx    # Alternative landing page
│   │   ├── Login.tsx      # Login page
│   │   ├── NotFound.tsx   # 404 page
│   │   ├── Orders.tsx     # Order history
│   │   ├── Products.tsx   # Products listing
│   │   ├── Profile.tsx    # User profile
│   │   └── Register.tsx   # Registration page
│   ├── services/          # API service layer
│   │   ├── authService.ts # Authentication services
│   │   ├── cartService.ts # Cart services
│   │   ├── orderService.ts# Order services
│   │   └── productService.ts# Product services
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # All type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── supabase/
│   ├── migrations/        # Database migration files
│   └── setup_database.sql # Complete database setup script
├── .env                   # Environment variables
├── DATABASE_SETUP.md      # Database setup guide
└── package.json           # Dependencies and scripts
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/home` - Home page
- `/products` - Products listing
- `/products/:id` - Product details
- `/login` - User login
- `/register` - User registration

### Protected Routes (Requires Login)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - Order history
- `/orders/:id` - Order details
- `/order-success/:orderId` - Order confirmation
- `/profile` - User profile

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/products/new` - Add new product
- `/admin/products/edit/:id` - Edit product
- `/admin/orders` - Manage orders

### Other Routes
- `*` - 404 Not Found page

## 🗄️ Database Schema

### Tables
1. **profiles** - User profiles and roles
2. **products** - Product catalog
3. **cart_items** - Shopping cart items
4. **orders** - Order records
5. **order_items** - Order line items

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Admins have full access to all data
- ✅ Products are publicly viewable

## 🎯 Key Features Implementation

### Authentication Flow
1. User registers/logs in via Supabase Auth
2. Profile created automatically in `profiles` table
3. Auth state managed via `AuthContext`
4. Route guards protect sensitive pages

### Shopping Flow
1. Browse products on Products page
2. Add items to cart (stored in database)
3. Cart state managed via `CartContext`
4. Proceed to checkout
5. Enter shipping details
6. Place order (creates order + order items)
7. View order confirmation
8. Track order in order history

### Admin Workflow
1. Admin logs in with admin role
2. Access admin dashboard
3. View statistics (revenue, orders, products)
4. Manage products (CRUD operations)
5. Manage orders (view, update status)

## 🔒 Security Features

- Authentication via Supabase Auth
- Row Level Security policies
- Protected routes with route guards
- Admin role verification
- Secure password handling
- HTTPS-only environment variables

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Orange (#f59e0b)
- Error: Red (#ef4444)
- Neutral: Gray scale

### Components
- Consistent button styles with variants
- Form inputs with validation states
- Loading spinners
- Error messages
- Success notifications

## 📝 Environment Variables

Required environment variables in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Stripe (for payment integration)
# VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase URL and key in `.env`
- Check if database migrations ran successfully
- Ensure RLS policies are set up correctly

### Authentication Issues
- Clear browser cache and local storage
- Check Supabase Auth settings
- Verify email confirmation settings

### Build Issues
- Delete `node_modules` and reinstall: `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (18+ required)

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Connect repository in Netlify
3. Add environment variables
4. Deploy

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React, TypeScript, and Supabase

---

**Happy Shopping! 🛍️**
