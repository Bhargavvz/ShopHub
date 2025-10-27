import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { ShippingAddress } from '../types';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Lock } from 'lucide-react';

export function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const onSubmit = async (data: ShippingAddress) => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const orderItems = items.map(item => ({
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_image: item.product?.image_url || '',
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const order = await orderService.createOrder(
        user.id,
        orderItems,
        total,
        data
      );

      await clearCart();
      navigate(`/order-success/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
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

                <Button type="submit" loading={loading} className="w-full">
                  <Lock className="w-4 h-4" />
                  Place Order
                </Button>
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
