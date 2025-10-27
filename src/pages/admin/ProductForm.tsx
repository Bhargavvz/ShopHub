import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from '../../services/productService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ArrowLeft, Save } from 'lucide-react';
import { Loader } from '../../components/common/Loader';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
}

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>();

  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      setPageLoading(true);
      const product = await productService.getProductById(id);
      if (product) {
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
          category: product.category || '',
        });
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setPageLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (isEditMode && id) {
        await productService.updateProduct(id, data);
        setSuccess('Product updated successfully!');
      } else {
        await productService.createProduct(data);
        setSuccess('Product created successfully!');
        reset();
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>

          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onDismiss={() => setError('')} />
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Product name is required',
                minLength: {
                  value: 3,
                  message: 'Product name must be at least 3 characters',
                },
              })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter product description"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                })}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                error={errors.price?.message}
                {...register('price', {
                  required: 'Price is required',
                  min: {
                    value: 0.01,
                    message: 'Price must be greater than 0',
                  },
                  valueAsNumber: true,
                })}
              />

              <Input
                label="Stock Quantity"
                type="number"
                placeholder="0"
                error={errors.stock?.message}
                {...register('stock', {
                  required: 'Stock quantity is required',
                  min: {
                    value: 0,
                    message: 'Stock cannot be negative',
                  },
                  valueAsNumber: true,
                })}
              />
            </div>

            <Input
              label="Image URL"
              type="url"
              placeholder="https://example.com/image.jpg"
              error={errors.image_url?.message}
              {...register('image_url', {
                required: 'Image URL is required',
                pattern: {
                  value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                  message: 'Please enter a valid image URL',
                },
              })}
            />

            <Input
              label="Category (Optional)"
              placeholder="e.g., Electronics, Fashion, Home"
              error={errors.category?.message}
              {...register('category')}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" loading={loading} className="flex-1">
                <Save className="w-4 h-4" />
                {isEditMode ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
