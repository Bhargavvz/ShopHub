# 🗺️ ShopHub Website Flow Diagram

## Complete Navigation & User Journey Map

### 🏠 Landing Page (/)
```
┌─────────────────────────────────────────┐
│         LANDING PAGE (/)                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Hero Section                   │   │
│  │  - Welcome Message              │   │
│  │  - "Start Shopping" Button ───┐ │   │
│  │  - "Sign Up" Button ─────────┐│ │   │
│  └──────────────────────────────┘││ │   │
│                                  ││ │   │
│  Features, Categories, Stats    ││ │   │
└──────────────────────────────────┼┼─┘   │
                                  ││      │
                                  ↓│      │
                          /products│      │
                                   │      │
                                   ↓      │
                              /register   │
```

---

## 🔐 Authentication Flow

### Registration Path
```
Landing Page (/) 
    → Click "Sign Up" 
    → Register Page (/register)
        → Fill Form:
            • Name
            • Email  
            • Password
            • Confirm Password
        → Submit
        → Auto Login
        → Redirect to Home/Landing
```

### Login Path
```
Any Page
    → Click "Login"
    → Login Page (/login)
        → Enter:
            • Email
            • Password
        → Submit
        → Redirect to Home/Landing
```

---

## 🛍️ Shopping Flow

### Browse Products
```
┌──────────────────────────────────────────────┐
│           PRODUCTS PAGE (/products)          │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────┐          │
│  │  Category Filters              │          │
│  │  [All] [Electronics] [Fashion] │          │
│  └────────────────────────────────┘          │
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ Product │  │ Product │  │ Product │      │
│  │  Card   │  │  Card   │  │  Card   │      │
│  │ [Add ▼] │  │ [Add ▼] │  │ [Add ▼] │      │
│  └─────────┘  └─────────┘  └─────────┘      │
│       ↓             ↓             ↓          │
│       └─────────────┴─────────────┘          │
│                     ↓                        │
│          Product Detail Page                 │
│          (/products/:id)                     │
└──────────────────────────────────────────────┘
```

### Product Detail to Cart
```
Product Detail (/products/:id)
    ↓
┌─────────────────────────────┐
│  • Product Image            │
│  • Description              │
│  • Price                    │
│  • Stock Status             │
│  • Quantity Selector        │
│  • [Add to Cart] Button     │
└─────────────────────────────┘
    ↓ Click "Add to Cart"
    ↓
Shopping Cart (/cart)
```

### Shopping Cart Flow
```
┌──────────────────────────────────────┐
│      SHOPPING CART (/cart)           │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  Cart Item 1                   │  │
│  │  [−] Qty: 2 [+]    [Remove]    │  │
│  ├────────────────────────────────┤  │
│  │  Cart Item 2                   │  │
│  │  [−] Qty: 1 [+]    [Remove]    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Order Summary                 │  │
│  │  Subtotal: $199.98             │  │
│  │  Tax (10%): $19.98             │  │
│  │  Total: $219.96                │  │
│  │                                │  │
│  │  [Proceed to Checkout]         │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
            ↓
    Checkout Page
```

### Checkout to Order
```
Checkout (/checkout)
    ↓
┌──────────────────────────────┐
│  Shipping Address Form       │
│  • Full Name                 │
│  • Address Line 1            │
│  • Address Line 2            │
│  • City, State, Zip          │
│  • Country                   │
│  • Phone Number              │
│                              │
│  Order Summary:              │
│  • Items List                │
│  • Total Amount              │
│                              │
│  [Place Order] ────────────┐ │
└────────────────────────────┼─┘
                            ↓
                Order Success Page
                (/order-success/:id)
                            ↓
                    ┌───────────────┐
                    │ ✓ Confirmed!  │
                    │ Order Details │
                    │ [View Orders] │
                    └───────┬───────┘
                            ↓
                    Orders Page
```

---

## 📦 Order Management Flow

### User Order History
```
┌────────────────────────────────────┐
│      ORDERS PAGE (/orders)         │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ Order #12345678              │  │
│  │ Date: Jan 15, 2025           │  │
│  │ Status: [Delivered]          │  │
│  │ Total: $219.96               │  │
│  │ 2 items                   [→]│  │
│  └──────────────────────────────┘  │
│                ↓ Click Order       │
│  ┌──────────────────────────────┐  │
│  │ Order #87654321              │  │
│  │ Date: Jan 10, 2025           │  │
│  │ Status: [Shipped]            │  │
│  │ Total: $149.99               │  │
│  │ 1 item                    [→]│  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
            ↓
    Order Detail Page
    (/orders/:id)
```

### Order Detail View
```
Order Detail (/orders/:id)
┌────────────────────────────────────┐
│  Order #12345678                   │
│  Status: [Delivered]               │
│                                    │
│  Shipping Address:                 │
│  John Doe                          │
│  123 Main St                       │
│  New York, NY 10001                │
│                                    │
│  Order Items:                      │
│  • Product 1 × 2    $99.98         │
│  • Product 2 × 1    $100.00        │
│                                    │
│  Subtotal:          $199.98        │
│  Tax:               $19.98         │
│  Total:             $219.96        │
│                                    │
│  [Back to Orders]                  │
└────────────────────────────────────┘
```

---

## 👤 User Profile Flow

```
┌────────────────────────────────────┐
│      PROFILE PAGE (/profile)       │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  👤 User Info                │  │
│  │  Name: John Doe              │  │
│  │  Email: john@example.com     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Edit Profile                │  │
│  │  Name: [Input]               │  │
│  │  [Save Changes]              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  🔒 Change Password          │  │
│  │  New Password: [Input]       │  │
│  │  Confirm: [Input]            │  │
│  │  [Update Password]           │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  📦 Order History            │  │
│  │  [View All Orders]           │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

---

## 👨‍💼 Admin Flow

### Admin Dashboard
```
Admin Dashboard (/admin)
┌────────────────────────────────────┐
│       ADMIN DASHBOARD              │
├────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐          │
│  │ Orders  │ │ Revenue │          │
│  │  150    │ │ $15,000 │          │
│  └─────────┘ └─────────┘          │
│                                    │
│  ┌─────────┐ ┌─────────┐          │
│  │ Pending │ │Products │          │
│  │   25    │ │   500   │          │
│  └─────────┘ └─────────┘          │
│                                    │
│  Recent Orders:                    │
│  • Order #123... $99.99            │
│  • Order #124... $149.99           │
│                                    │
│  Quick Actions:                    │
│  ┌──────────────────────────────┐  │
│  │ 📦 Manage Products        [→]│  │
│  ├──────────────────────────────┤  │
│  │ 🛍️  Manage Orders         [→]│  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### Product Management
```
Manage Products (/admin/products)
┌────────────────────────────────────┐
│  [+ Add Product]                   │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ Product Name   | Category    │  │
│  │ Price | Stock | [Edit][Del] │  │
│  ├──────────────────────────────┤  │
│  │ Headphones    | Electronics  │  │
│  │ $99.99 | 50  | [✏️] [🗑️]   │  │
│  ├──────────────────────────────┤  │
│  │ Smart Watch   | Electronics  │  │
│  │ $199.99 | 30 | [✏️] [🗑️]   │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
        ↓ Click "Add" or "Edit"
        ↓
Product Form (/admin/products/new)
┌────────────────────────────────────┐
│  Add/Edit Product Form             │
│  • Name: [Input]                   │
│  • Description: [Textarea]         │
│  • Price: [Input]                  │
│  • Stock: [Input]                  │
│  • Image URL: [Input]              │
│  • Category: [Input]               │
│                                    │
│  [Create/Update]  [Cancel]         │
└────────────────────────────────────┘
```

### Order Management
```
Manage Orders (/admin/orders)
┌────────────────────────────────────┐
│  Filter: [All][Pending][Shipped]   │
├────────────────────────────────────┤
│  Order ID  | Date      | Status    │
│  Total     | Items     | Actions   │
│  ┌──────────────────────────────┐  │
│  │ #12345678 | Jan 15   | Status▼│  │
│  │ $219.96   | 2 items  | [→]    │  │
│  ├──────────────────────────────┤  │
│  │ #87654321 | Jan 10   | Status▼│  │
│  │ $149.99   | 1 item   | [→]    │  │
│  └──────────────────────────────┘  │
│                                    │
│  Status Options:                   │
│  • Pending                         │
│  • Processing                      │
│  • Shipped                         │
│  • Delivered                       │
│  • Cancelled                       │
└────────────────────────────────────┘
```

---

## 🔄 Complete User Journey Examples

### Example 1: First-time Visitor
```
Landing Page (/)
    → Browse Products
    → Click "Sign Up"
    → Register
    → Browse Products
    → Add to Cart
    → Checkout
    → Place Order
    → View Order Success
```

### Example 2: Returning Customer
```
Login Page
    → Enter Credentials
    → View Products
    → Search for Item
    → Add to Cart
    → View Cart
    → Checkout
    → View Orders
```

### Example 3: Admin User
```
Login (as admin)
    → Admin Dashboard
    → View Stats
    → Manage Products
    → Add New Product
    → Manage Orders
    → Update Order Status
    → View Reports
```

---

## 🧭 Navigation Structure

### Main Navigation (Navbar)
```
┌──────────────────────────────────────────────┐
│  🏪 ShopHub  [Search]  [Home][Products]      │
│                        [Orders][Cart][User▼] │
└──────────────────────────────────────────────┘
                                            │
                                            ↓
                        ┌───────────────────────┐
                        │ My Profile            │
                        │ Admin Dashboard (⭐)  │
                        │ Logout                │
                        └───────────────────────┘
```

### Footer Navigation
```
┌──────────────────────────────────────────────┐
│  Quick Links:                                │
│  • Home                                      │
│  • Products                                  │
│  • Orders                                    │
│  • Profile                                   │
│                                              │
│  Customer Service:                           │
│  • Shipping Info                             │
│  • Returns                                   │
│  • Privacy Policy                            │
│  • Terms of Service                          │
└──────────────────────────────────────────────┘
```

---

## 🚫 Error Handling

### 404 Not Found
```
Any Invalid URL
    → 404 Page (/*)
    → Display:
        • 404 Message
        • "Page Not Found"
        • [Go Home] Button
        • [Browse Products] Button
```

### Authentication Errors
```
Protected Page (not logged in)
    → Redirect to Login (/login)
    → Show message: "Please log in"
    → After login → Redirect back
```

### Admin Access Denied
```
Admin Page (not admin role)
    → Redirect to Home (/)
    → (No error shown - silent redirect)
```

---

## 📱 Responsive Behavior

All pages are fully responsive:
- **Desktop**: Full navigation, side-by-side layouts
- **Tablet**: Adjusted grids, collapsible menus
- **Mobile**: 
  - Hamburger menu
  - Single column layouts
  - Touch-friendly buttons
  - Optimized forms

---

**This flow diagram covers all major user journeys through the ShopHub e-commerce website! 🎯**
