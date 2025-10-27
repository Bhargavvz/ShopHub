import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { razorpayService } from '../services/razorpayService';
import { ShippingAddress } from '../types';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Lock, CreditCard } from 'lucide-react';

export function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const onSubmit = async (data: ShippingAddress) => {
    if (!user) {
      setError('Please login to continue');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare order items
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_image: item.product?.image_url || '',
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      // Create order in database
      const order = await orderService.createOrder(
        user.id,
        orderItems,
        total,
        data
      );

      // Initiate Razorpay payment
      await initiateRazorpayPayment(order.id, data);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  const initiateRazorpayPayment = async (orderId: string, shippingAddress: ShippingAddress) => {
    try {
      setProcessingPayment(true);
      
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId) {
        throw new Error('Razorpay configuration is missing. Please contact support.');
      }

      // Create Razorpay order
      const razorpayOrder = await razorpayService.createRazorpayOrder(
        total,
        'INR',
        orderId
      );

      // Configure Razorpay checkout options
      const options = {
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ShopHub',
        description: `Order #${orderId.substring(0, 8)}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          await handlePaymentSuccess(orderId, response);
        },
        prefill: {
          name: shippingAddress.full_name,
          email: user?.email || '',
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563eb', // Blue color to match your theme
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setProcessingPayment(false);
            setError('Payment cancelled. Your order has been saved and you can complete payment later.');
          },
        },
      };

      // Display Razorpay checkout
      await razorpayService.displayRazorpayCheckout(options, razorpayKeyId);
    } catch (err: any) {
      console.error('Razorpay error:', err);
      
      // Provide more detailed error messages
      let userMessage = err.message || 'Failed to initiate payment. Please try again.';
      
      // Format multi-line error messages for display
      if (userMessage.includes('\n')) {
        // Convert to HTML breaks for display
        userMessage = userMessage.split('\n').join(' ');
      }
      
      setError(userMessage);
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, paymentResponse: any) => {
    try {
      // Verify payment signature
      const isValid = await razorpayService.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      if (!isValid) {
        throw new Error('Payment verification failed. Please contact support.');
      }

      // Update order with payment details
      await razorpayService.updateOrderPayment(orderId, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        payment_status: 'paid',
      });

      // Clear cart
      await clearCart();

      // Redirect to success page
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Payment completed but verification failed. Please contact support.');
    } finally {
      setLoading(false);
      setProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError('')} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.full_name?.message}
                  {...register('full_name', { required: 'Full name is required' })}
                />

                <Input
                  label="Address Line 1"
                  placeholder="123 Main St"
                  error={errors.address_line1?.message}
                  {...register('address_line1', { required: 'Address is required' })}
                />

                <Input
                  label="Address Line 2 (Optional)"
                  placeholder="Apt 4B"
                  {...register('address_line2')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="New York"
                    error={errors.city?.message}
                    {...register('city', { required: 'City is required' })}
                  />

                  <Input
                    label="State"
                    placeholder="NY"
                    error={errors.state?.message}
                    {...register('state', { required: 'State is required' })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    placeholder="10001"
                    error={errors.postal_code?.message}
                    {...register('postal_code', { required: 'Postal code is required' })}
                  />

                  <Input
                    label="Country"
                    placeholder="USA"
                    error={errors.country?.message}
                    {...register('country', { required: 'Country is required' })}
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                />

                <Button 
                  type="submit" 
                  loading={loading || processingPayment} 
                  className="w-full"
                  disabled={loading || processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-2">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Secure payment powered by Razorpay
                </p>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
