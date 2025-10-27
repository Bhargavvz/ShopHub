# 🎯 Razorpay Payment Gateway Integration Guide

## 📋 Overview

This guide will help you integrate Razorpay payment gateway into your ShopHub e-commerce application. Razorpay is a popular payment solution in India that supports multiple payment methods including cards, UPI, net banking, and wallets.

---

## ✅ **What's Been Implemented**

### **Frontend Changes:**
1. ✅ **Razorpay SDK** - Dynamic script loading
2. ✅ **Payment Service** - `razorpayService.ts` with full payment flow
3. ✅ **Updated Checkout** - Integrated Razorpay checkout modal
4. ✅ **Type Definitions** - Added payment fields to Order interface
5. ✅ **Error Handling** - Comprehensive error messages
6. ✅ **Loading States** - Payment processing indicators

### **Backend Changes:**
1. ✅ **Database Schema** - Added payment columns to orders table
2. ✅ **Edge Functions** - Created 2 Supabase Edge Functions
   - `create-razorpay-order` - Creates Razorpay order
   - `verify-razorpay-payment` - Verifies payment signature
3. ✅ **Environment Variables** - Added Razorpay configuration

---

## 🚀 **Setup Instructions**

### **Step 1: Get Razorpay Credentials**

1. **Create Razorpay Account:**
   - Go to [https://razorpay.com](https://razorpay.com)
   - Click "Sign Up" (free account)
   - Complete KYC for live mode

2. **Get API Keys:**
   - Dashboard → Settings → API Keys
   - Generate Test Keys first
   - Copy **Key ID** and **Key Secret**

3. **Enable Test Mode:**
   - Switch to "Test Mode" in dashboard
   - Use test keys for development

---

### **Step 2: Configure Environment Variables**

Update your `.env` file:

```env
# Replace with your actual Razorpay credentials
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here
```

⚠️ **IMPORTANT:** 
- Use **Test** keys for development
- Use **Live** keys only in production
- **NEVER commit** `.env` file to git

---

### **Step 3: Run Database Migration**

Run the payment fields migration in Supabase SQL Editor:

1. Open [Supabase Dashboard](https://app.supabase.com/project/cchddzyamdlytfvawvam)
2. SQL Editor → New Query
3. Copy and run: `supabase/migrations/20250127_add_payment_fields.sql`

```sql
-- This adds payment columns to orders table
-- payment_status, razorpay_order_id, razorpay_payment_id, etc.
```

**Verify Migration:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders'
AND column_name LIKE '%payment%' OR column_name LIKE '%razorpay%';
```

Expected output:
- `payment_status`
- `payment_id`
- `razorpay_order_id`
- `razorpay_payment_id`
- `razorpay_signature`

---

### **Step 4: Deploy Supabase Edge Functions**

You need to deploy 2 edge functions to Supabase:

#### **Method 1: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref cchddzyamdlytfvawvam

# Set environment secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=your_secret_key

# Deploy functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

#### **Method 2: Manual Deployment via Dashboard**

1. Go to Supabase Dashboard → Edge Functions
2. Create new function: `create-razorpay-order`
3. Copy code from `supabase/functions/create-razorpay-order/index.ts`
4. Deploy
5. Repeat for `verify-razorpay-payment`
6. Add secrets in Settings → Edge Functions → Secrets

---

### **Step 5: Test the Integration**

#### **Test Mode Payment Flow:**

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Add items to cart**
3. **Go to checkout**
4. **Fill shipping details**
5. **Click "Proceed to Payment"**
6. **Razorpay modal opens**

#### **Test Cards (Test Mode):**

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name

UPI: success@razorpay
```

#### **Expected Flow:**
```
Fill Checkout Form
→ Click "Proceed to Payment"
→ Order created in DB (status: pending)
→ Razorpay modal opens
→ Enter test card details
→ Payment succeeds
→ Signature verified
→ Order updated (status: processing, payment_status: paid)
→ Cart cleared
→ Redirect to success page
```

---

## 🔧 **How It Works**

### **Payment Flow Diagram:**

```
1. User fills checkout form
   ↓
2. Creates order in DB (pending)
   ↓
3. Calls Edge Function → Creates Razorpay order
   ↓
4. Opens Razorpay checkout modal
   ↓
5. User completes payment
   ↓
6. Razorpay returns payment details
   ↓
7. Edge Function verifies signature
   ↓
8. Updates order (paid, processing)
   ↓
9. Clears cart
   ↓
10. Shows success page
```

### **Security Features:**

✅ **Server-side verification** - Payment signature verified on server
✅ **Environment secrets** - Keys stored in Edge Functions
✅ **HTTPS only** - All API calls encrypted
✅ **Signature validation** - HMAC-SHA256 signature verification
✅ **Amount validation** - Server controls order amount

---

## 📁 **Files Modified/Created**

### **Frontend:**
1. ✅ `src/services/razorpayService.ts` - NEW
   - Razorpay SDK integration
   - Payment creation & verification
   - Order update functions

2. ✅ `src/pages/Checkout.tsx` - UPDATED
   - Razorpay payment flow
   - Error handling
   - Loading states

3. ✅ `src/types/index.ts` - UPDATED
   - Added payment fields to Order interface

4. ✅ `.env` - UPDATED
   - Added Razorpay credentials

### **Backend:**
5. ✅ `supabase/migrations/20250127_add_payment_fields.sql` - NEW
   - Adds payment columns to orders table

6. ✅ `supabase/functions/create-razorpay-order/index.ts` - NEW
   - Creates Razorpay order via API

7. ✅ `supabase/functions/verify-razorpay-payment/index.ts` - NEW
   - Verifies payment signature

### **Documentation:**
8. ✅ `RAZORPAY_INTEGRATION_GUIDE.md` - NEW (this file)

---

## 🐛 **Troubleshooting**

### **Issue 1: "Failed to load Razorpay SDK"**

**Cause:** Internet connection or script blocked

**Solution:**
```javascript
// Check browser console for errors
// Verify internet connection
// Disable ad blockers
// Clear browser cache
```

---

### **Issue 2: "Razorpay configuration is missing"**

**Cause:** Environment variables not set

**Solution:**
```bash
# Check .env file
cat .env | grep RAZORPAY

# Restart dev server
npm run dev
```

---

### **Issue 3: "Failed to create payment order"**

**Cause:** Edge Function not deployed or secrets missing

**Solution:**
```bash
# Verify Edge Functions deployed
supabase functions list

# Verify secrets
supabase secrets list

# Check function logs
supabase functions logs create-razorpay-order
```

---

### **Issue 4: "Payment verification failed"**

**Cause:** Signature mismatch or wrong secret key

**Solution:**
```sql
-- Check order in database
SELECT 
  id,
  payment_status,
  razorpay_order_id,
  razorpay_payment_id
FROM orders 
WHERE id = 'your-order-id';

-- Verify Edge Function has correct secret
```

---

### **Issue 5: "Payment succeeded but order not updated"**

**Cause:** Database RLS policies or update error

**Solution:**
```sql
-- Check RLS policies allow update
SELECT * FROM pg_policies 
WHERE tablename = 'orders' 
AND cmd = 'UPDATE';

-- Manually update order for testing
UPDATE orders 
SET payment_status = 'paid',
    status = 'processing'
WHERE id = 'your-order-id';
```

---

## 🧪 **Testing Checklist**

- [ ] Environment variables configured
- [ ] Database migration run successfully
- [ ] Edge Functions deployed
- [ ] Secrets added to Edge Functions
- [ ] Dev server running
- [ ] Can add items to cart
- [ ] Can proceed to checkout
- [ ] Razorpay modal opens
- [ ] Test payment succeeds
- [ ] Order updated with payment details
- [ ] Cart cleared after payment
- [ ] Redirected to success page
- [ ] Payment visible in Razorpay dashboard

---

## 🎨 **Customization Options**

### **Change Payment Gateway Theme:**

```typescript
// In Checkout.tsx
theme: {
  color: '#2563eb', // Change to your brand color
}
```

### **Add Payment Methods Filter:**

```typescript
// In razorpayService.ts options
const options = {
  // ... other options
  config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay using UPI',
          instruments: [
            {
              method: 'upi'
            }
          ]
        }
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: false
      }
    }
  }
};
```

### **Add Custom Notes:**

```typescript
// In create order
notes: {
  order_type: 'ecommerce',
  customer_id: user.id,
  customer_email: user.email,
}
```

---

## 📊 **Production Checklist**

Before going live:

- [ ] Switch to Live Razorpay keys
- [ ] Complete KYC verification
- [ ] Enable required payment methods
- [ ] Set up webhooks (optional)
- [ ] Configure payment success/failure URLs
- [ ] Test with real cards (small amount)
- [ ] Set up email notifications
- [ ] Enable auto-refunds (if needed)
- [ ] Configure settlements
- [ ] Add payment analytics

---

## 🔐 **Security Best Practices**

1. ✅ **Never expose secret key** - Keep in Edge Functions only
2. ✅ **Always verify signature** - Server-side verification mandatory
3. ✅ **Use HTTPS** - Required for production
4. ✅ **Validate amounts** - Server controls final amount
5. ✅ **Log all transactions** - For auditing
6. ✅ **Handle errors gracefully** - Don't expose internal errors
7. ✅ **Rate limit API calls** - Prevent abuse
8. ✅ **Monitor for fraud** - Use Razorpay dashboard

---

## 📞 **Support & Resources**

### **Razorpay Documentation:**
- [Official Docs](https://razorpay.com/docs/)
- [Payment Gateway Integration](https://razorpay.com/docs/payment-gateway/)
- [Test Cards](https://razorpay.com/docs/payment-gateway/test-card-details/)
- [Webhooks](https://razorpay.com/docs/webhooks/)

### **Supabase Edge Functions:**
- [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deploy Functions](https://supabase.com/docs/guides/functions/deploy)

### **Need Help?**
- Check browser console for errors
- Check Supabase Edge Function logs
- Check Razorpay dashboard logs
- Contact Razorpay support

---

## ✅ **Summary**

**What You Have Now:**
- ✅ Complete Razorpay integration
- ✅ Secure payment processing
- ✅ Payment verification
- ✅ Order status management
- ✅ Error handling
- ✅ Test mode ready

**Next Steps:**
1. Get Razorpay account & keys
2. Update .env file
3. Run database migration
4. Deploy Edge Functions
5. Test with test cards
6. Go live when ready!

---

**Your payment gateway is ready! Follow the setup steps and you'll be accepting payments in no time! 🎉**
