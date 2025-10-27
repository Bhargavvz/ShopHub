import { supabase } from '../lib/supabase';

// Razorpay types
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentVerification) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const razorpayService = {
  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  /**
   * Create Razorpay order via Edge Function
   */
  async createRazorpayOrder(amount: number, currency: string = 'INR', receipt: string): Promise<RazorpayOrderResponse> {
    try {
      console.log('Creating Razorpay order...', { amount, currency, receipt });
      
      // Call Supabase Edge Function to create Razorpay order
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
          currency,
          receipt,
        },
      });

      if (error) {
        console.error('Supabase Functions error:', error);
        
        // Check if it's a deployment issue
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          throw new Error(
            'Payment service is not configured. Please deploy the Razorpay Edge Functions. ' +
            'See RAZORPAY_INTEGRATION_GUIDE.md for setup instructions.'
          );
        }
        
        // Check if it's a configuration issue
        if (error.message?.includes('Missing required fields')) {
          throw new Error(
            'Razorpay API credentials are missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET ' +
            'in Supabase Edge Function secrets.'
          );
        }
        
        throw error;
      }
      
      // Check if response has error field (from Edge Function)
      if (data && data.error) {
        console.error('Razorpay API error:', data);
        throw new Error(data.error + (data.details ? `\nDetails: ${data.details}` : ''));
      }
      
      console.log('Razorpay order created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      
      // Provide helpful error message
      let errorMessage = error.message || 'Failed to create payment order';
      
      if (error.message?.includes('Edge Function returned a non-2xx')) {
        errorMessage = (
          'Payment gateway configuration error. ' +
          'Please ensure:\n' +
          '1. Razorpay Edge Functions are deployed\n' +
          '2. RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in Supabase\n' +
          '3. Your Razorpay account is active\n\n' +
          'See RAZORPAY_INTEGRATION_GUIDE.md for detailed setup instructions.'
        );
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Verify Razorpay payment signature via Edge Function
   */
  async verifyPayment(paymentData: RazorpayPaymentVerification): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
        body: paymentData,
      });

      if (error) throw error;
      return data.isValid;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw new Error(error.message || 'Payment verification failed');
    }
  },

  /**
   * Display Razorpay checkout
   */
  async displayRazorpayCheckout(
    options: Omit<RazorpayOptions, 'key'>,
    razorpayKey: string
  ): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    const razorpayOptions: RazorpayOptions = {
      ...options,
      key: razorpayKey,
    };

    const razorpayInstance = new window.Razorpay(razorpayOptions);
    razorpayInstance.open();
  },

  /**
   * Update order with payment details
   */
  async updateOrderPayment(
    orderId: string,
    paymentData: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      payment_status: 'paid' | 'failed';
    }
  ): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        payment_status: paymentData.payment_status,
        status: paymentData.payment_status === 'paid' ? 'processing' : 'pending',
      })
      .eq('id', orderId);

    if (error) throw error;
  },
};
