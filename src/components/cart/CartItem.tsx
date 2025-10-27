import { CartItem as CartItemType } from '../../types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  loading?: boolean;
}

export function CartItem({ item, onUpdateQuantity, onRemove, loading }: CartItemProps) {
  const product = item.product;

  if (!product) return null;

  const subtotal = product.price * item.quantity;
  const isOutOfStock = product.stock === 0;
  const exceedsStock = item.quantity > product.stock;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

        {(isOutOfStock || exceedsStock) && (
          <p className="text-sm text-red-600 font-medium mb-2">
            {isOutOfStock ? 'Out of stock' : `Only ${product.stock} available`}
          </p>
        )}

        <div className="flex items-center gap-4 mt-auto">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={loading || item.quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 border-x border-gray-300 font-medium min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={loading || item.quantity >= product.stock}
              className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <span className="text-lg font-bold text-gray-900">
            ${subtotal.toFixed(2)}
          </span>

          <button
            onClick={() => onRemove(item.id)}
            disabled={loading}
            className="ml-auto text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
