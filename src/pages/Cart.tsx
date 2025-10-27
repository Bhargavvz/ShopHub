import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Loader } from '../components/common/Loader';
import { ShoppingCart as CartIcon } from 'lucide-react';
import { Button } from '../components/common/Button';

export function Cart() {
  const navigate = useNavigate();
  const { items, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateQuantity(id, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && items.length === 0) {
    return <Loader fullScreen />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CartIcon className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                loading={loading}
              />
            ))}
          </div>

          <div>
            <CartSummary
              subtotal={getCartTotal()}
              onCheckout={handleCheckout}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
