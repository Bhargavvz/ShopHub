# 🔧 Razorpay 400 Error - Complete Troubleshooting Guide

## ❌ **Error You're Seeing:**

```
Failed to load resource: the server responded with a status of 400 ()
Error creating Razorpay order: FunctionsHttpError: Edge Function returned a non-2xx status code
```

---

## 🎯 **Root Cause**

The 400 error means the Supabase Edge Function is either:
1. ❌ Not deployed
2. ❌ Missing environment secrets (Razorpay API keys)
3. ❌ Razorpay API credentials are invalid
4. ❌ Request format is incorrect

---

## ✅ **COMPLETE FIX (Step-by-Step)**

### **Step 1: Verify Environment Variables (Frontend)**

Check your `.env` file:

```bash
# Open .env file
cat .env | grep RAZORPAY
```

**Should show:**
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here
```

**If missing or incorrect:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → API Keys
3. Generate Test Keys
4. Copy Key ID and Secret
5. Add to `.env` file
6. **Restart dev server:** `npm run dev`

---

### **Step 2: Deploy Edge Functions** 🔴 **CRITICAL**

This is the most common cause of the 400 error!

#### **Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref cchddzyamdlytfvawvam

# Deploy both functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment

# Set secrets (IMPORTANT!)
supabase secrets set RAZORPAY_KEY_ID=rzp_test_your_key_here
supabase secrets set RAZORPAY_KEY_SECRET=your_secret_key_here
```

#### **Option B: Using Supabase Dashboard (If CLI doesn't work)**

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/cchddzyamdlytfvawvam

2. **Create First Function:**
   - Click "Edge Functions" in sidebar
   - Click "Create a new function"
   - Name: `create-razorpay-order`
   - Copy code from: `supabase/functions/create-razorpay-order/index.ts`
   - Click "Deploy"

3. **Create Second Function:**
   - Click "Create a new function"
   - Name: `verify-razorpay-payment`
   - Copy code from: `supabase/functions/verify-razorpay-payment/index.ts`
   - Click "Deploy"

4. **Add Secrets:**
   - Edge Functions → Settings (gear icon)
   - Secrets tab
   - Add new secret:
     - Name: `RAZORPAY_KEY_ID`
     - Value: `rzp_test_xxxxxxxxxxxxx`
   - Add another secret:
     - Name: `RAZORPAY_KEY_SECRET`
     - Value: `your_secret_key`
   - Click "Save"

---

### **Step 3: Verify Edge Functions are Deployed**

```bash
# List deployed functions
supabase functions list

# Should show:
# - create-razorpay-order
# - verify-razorpay-payment
```

**Or check in Dashboard:**
- Edge Functions tab should show both functions

---

### **Step 4: Test Edge Function**

**Method 1: Browser Console**
```javascript
// Open browser console (F12)
// Run this in checkout page console:
import { runRazorpayDiagnostics } from './src/utils/razorpayDiagnostics';
await runRazorpayDiagnostics();
```

**Method 2: Navigate to Setup Page**
```
http://localhost:5173/admin/razorpay-setup
```

**Method 3: Manual Test**
```bash
# Test the Edge Function
curl -X POST \
  https://cchddzyamdlytfvawvam.supabase.co/functions/v1/create-razorpay-order \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"currency":"INR","receipt":"test123"}'
```

---

### **Step 5: Check Edge Function Logs**

```bash
# View logs for create-razorpay-order
supabase functions logs create-razorpay-order

# Or in Dashboard:
# Edge Functions → create-razorpay-order → Logs tab
```

**Look for errors like:**
- `RAZORPAY_KEY_ID is undefined` → Secrets not set
- `Invalid API key` → Wrong Razorpay credentials
- `Missing required fields` → Request format issue

---

## 🔍 **Common Error Messages & Fixes**

### **Error: "Edge Function returned a non-2xx status code"**

**Cause:** Function not deployed or crashed

**Fix:**
```bash
# Redeploy the function
supabase functions deploy create-razorpay-order

# Check logs
supabase functions logs create-razorpay-order
```

---

### **Error: "Function not found" or "404"**

**Cause:** Function not deployed

**Fix:**
```bash
# Deploy the function
supabase functions deploy create-razorpay-order
```

---

### **Error: "Missing required fields: amount, currency, or receipt"**

**Cause:** Request body format incorrect

**Fix:** Check Checkout.tsx sends correct data:
```typescript
{
  amount: Math.round(total * 100),
  currency: 'INR',
  receipt: orderId
}
```

---

### **Error: "Razorpay API credentials are missing"**

**Cause:** Secrets not set in Edge Function

**Fix:**
```bash
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxx
supabase secrets set RAZORPAY_KEY_SECRET=xxx

# Verify secrets
supabase secrets list
```

---

### **Error: "Invalid API key" from Razorpay**

**Cause:** Wrong Razorpay credentials

**Fix:**
1. Go to Razorpay Dashboard
2. Settings → API Keys
3. **Make sure you're in TEST mode** (top right)
4. Generate new test keys if needed
5. Update secrets in Supabase

---

## 🧪 **Complete Verification Checklist**

Run through this checklist:

```
[ ] Razorpay account created
[ ] Test mode enabled in Razorpay dashboard
[ ] Test API keys generated
[ ] .env file has VITE_RAZORPAY_KEY_ID
[ ] .env file has VITE_RAZORPAY_KEY_SECRET
[ ] Dev server restarted after updating .env
[ ] Supabase CLI installed
[ ] Logged into Supabase CLI
[ ] Project linked via CLI
[ ] create-razorpay-order function deployed
[ ] verify-razorpay-payment function deployed
[ ] RAZORPAY_KEY_ID secret set in Supabase
[ ] RAZORPAY_KEY_SECRET secret set in Supabase
[ ] Functions appear in "supabase functions list"
[ ] Function logs show no errors
[ ] Test from browser console works
```

---

## 🎯 **Quick Test Procedure**

After fixing, test in this order:

1. **Test Environment:**
   ```bash
   # Check .env
   cat .env | grep RAZORPAY
   
   # Should show your keys
   ```

2. **Test Edge Function:**
   ```bash
   # List functions
   supabase functions list
   
   # Check logs
   supabase functions logs create-razorpay-order
   ```

3. **Test from Browser:**
   - Go to checkout page
   - Add item to cart
   - Fill shipping details
   - Click "Proceed to Payment"
   - Check browser console (F12)
   - Should see: "Creating Razorpay order..." and "Razorpay order created successfully"

4. **If still fails:**
   - Check Network tab (F12 → Network)
   - Find the request to `create-razorpay-order`
   - Check Response tab for error details

---

## 📊 **Debug Flowchart**

```
400 Error
  ↓
Check: Functions deployed?
  NO → Deploy functions
  YES ↓
Check: Secrets set?
  NO → Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
  YES ↓
Check: Razorpay keys valid?
  NO → Generate new keys from Razorpay dashboard
  YES ↓
Check: Function logs
  ↓
Fix specific error shown in logs
```

---

## 🛠️ **Advanced Debugging**

### **View Detailed Error:**

Add this to Checkout.tsx temporarily:

```typescript
} catch (err: any) {
  console.error('Full error object:', err);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  
  // Show in UI
  setError(JSON.stringify(err, null, 2));
}
```

### **Test Edge Function Directly:**

Create a test file `test-razorpay.ts`:

```typescript
import { supabase } from './src/lib/supabase';

async function testRazorpay() {
  console.log('Testing Razorpay Edge Function...');
  
  const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
    body: {
      amount: 100,
      currency: 'INR',
      receipt: 'test_' + Date.now(),
    },
  });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

testRazorpay();
```

Run: `npx tsx test-razorpay.ts`

---

## 📞 **Still Not Working?**

### **Collect This Information:**

1. **Environment Check:**
   ```bash
   cat .env | grep RAZORPAY
   ```

2. **Function List:**
   ```bash
   supabase functions list
   ```

3. **Function Logs:**
   ```bash
   supabase functions logs create-razorpay-order --limit 50
   ```

4. **Browser Console:**
   - Open checkout page
   - F12 → Console
   - Try payment
   - Copy all error messages

5. **Network Tab:**
   - F12 → Network
   - Try payment
   - Find `create-razorpay-order` request
   - Copy Response

### **Check These Files:**

1. `.env` - Should have Razorpay keys
2. `supabase/functions/create-razorpay-order/index.ts` - Correct code
3. Supabase Dashboard → Edge Functions → Secrets

### **Common Mistakes:**

❌ Forgot to restart dev server after updating .env
❌ Using Live keys instead of Test keys
❌ Secrets set in .env instead of Supabase
❌ Function deployed but secrets not set
❌ Wrong project linked in Supabase CLI

---

## ✅ **Success Indicators**

You'll know it's working when you see:

**Browser Console:**
```
Creating Razorpay order... {amount: 10000, currency: "INR", receipt: "..."}
Razorpay order created successfully: {id: "order_xxx", ...}
```

**Network Tab:**
```
Status: 200 OK
Response: { id: "order_xxx", amount: 10000, currency: "INR", ... }
```

**Edge Function Logs:**
```
No errors, or successful order creation logs
```

---

## 🎉 **After Fixing**

Once working:

1. ✅ Remove any debug console.logs
2. ✅ Test with different amounts
3. ✅ Test payment success flow
4. ✅ Test payment failure flow
5. ✅ Test with test card: 4111 1111 1111 1111

---

**Follow these steps in order and your Razorpay integration will work! 🚀**
