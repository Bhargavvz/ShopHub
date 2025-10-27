# ⚡ Razorpay Quick Start - 5 Minutes Setup

## 🎯 **Quick Setup (Follow in Order)**

### **1. Get Razorpay Credentials** (2 min)

```
1. Go to https://razorpay.com
2. Sign up (free test account)
3. Dashboard → Settings → API Keys
4. Generate Test Keys
5. Copy:
   - Key ID (starts with rzp_test_)
   - Key Secret
```

---

### **2. Update Environment Variables** (30 sec)

Open `.env` and update:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
VITE_RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

---

### **3. Run Database Migration** (1 min)

```sql
-- Open Supabase Dashboard → SQL Editor
-- Run this migration:
```

Copy and run: `supabase/migrations/20250127_add_payment_fields.sql`

---

### **4. Deploy Edge Functions** (2 min)

**Option A - Using CLI:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref cchddzyamdlytfvawvam

# Set secrets
supabase secrets set RAZORPAY_KEY_ID=rzp_test_YOUR_KEY
supabase secrets set RAZORPAY_KEY_SECRET=YOUR_SECRET

# Deploy functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

**Option B - Manual (if CLI doesn't work):**
```
1. Supabase Dashboard → Edge Functions
2. Create: create-razorpay-order
   - Copy from: supabase/functions/create-razorpay-order/index.ts
3. Create: verify-razorpay-payment
   - Copy from: supabase/functions/verify-razorpay-payment/index.ts
4. Settings → Secrets → Add:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
```

---

### **5. Test Payment** (30 sec)

```bash
# Start dev server
npm run dev

# Test payment:
1. Add product to cart
2. Go to checkout
3. Fill shipping details
4. Click "Proceed to Payment"
5. Use test card: 4111 1111 1111 1111
6. CVV: 123, Expiry: any future date
7. Payment should succeed!
```

---

## 🧪 **Test Cards**

```
SUCCESS:
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

UPI:
UPI ID: success@razorpay

FAILURE (for testing):
Card: 4000 0000 0000 0002
```

---

## ✅ **Verification Checklist**

- [ ] Razorpay account created
- [ ] API keys copied
- [ ] .env updated with keys
- [ ] Dev server restarted
- [ ] Database migration run
- [ ] Edge Functions deployed
- [ ] Secrets added to Edge Functions
- [ ] Test payment successful

---

## 🐛 **Quick Troubleshooting**

**"Razorpay configuration is missing"**
→ Check `.env` file, restart dev server

**"Failed to create payment order"**
→ Edge Functions not deployed or secrets missing

**"Payment verification failed"**
→ Wrong secret key in Edge Functions

**Razorpay modal doesn't open**
→ Check browser console, disable ad blockers

---

## 📞 **Need Help?**

1. Check [`RAZORPAY_INTEGRATION_GUIDE.md`](file://c:\Users\adepu\Desktop\{Projects}\Sparsha\project\RAZORPAY_INTEGRATION_GUIDE.md) for detailed docs
2. Browser Console (F12) for errors
3. Supabase Edge Function logs
4. Razorpay Dashboard → Payments → Logs

---

## 🎉 **You're Done!**

Payment gateway is ready to accept payments! 🚀

**For Production:**
- Switch to Live keys
- Complete KYC
- See full guide for checklist
