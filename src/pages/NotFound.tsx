import { useNavigate } from 'react-router-dom';
import { Home, Search, Package } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8 relative">
          <div className="text-[150px] font-bold text-gray-200 leading-none">404</div>
          <Package className="w-24 h-24 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate('/')} className="w-full sm:w-auto">
            <Home className="w-5 h-5" />
            Go Home
          </Button>
          <Button onClick={() => navigate('/products')} variant="outline" className="w-full sm:w-auto">
            <Search className="w-5 h-5" />
            Browse Products
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Lost? Try using the navigation menu above or search for products.
          </p>
        </div>
      </div>
    </div>
  );
}
