interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
  loading?: boolean;
}

export function CartSummary({ subtotal, onCheckout, loading }: CartSummaryProps) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={loading || subtotal === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Shipping calculated at checkout
      </p>
    </div>
  );
}
