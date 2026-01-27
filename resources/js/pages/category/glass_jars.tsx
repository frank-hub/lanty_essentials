import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Filter ,Plus } from 'lucide-react';
import Layout from '../Layout';
import { usePage ,router} from '@inertiajs/react';

interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  compare_price?: number;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
   images: ProductImage[];
  createdAt: string;
  sales: number;
}

interface JarsPageProps {
  JarsName?: string;
  JarsDescription?: string;
}

const LantyJarsPage: React.FC<JarsPageProps> = ({
  JarsName = "Glass Jars",
  JarsDescription = "Store, organize, and display with elegance using our high-quality glass jars designed for both functionality and style. Perfect for kitchens, laundry rooms, and home organization, our jars offer a clean, modern way to keep your essentials fresh and visible."
}) => {
  const [filterBy, setFilterBy] = useState('Availability');
  const [sortBy, setSortBy] = useState('Featured');

  const products = usePage().props.jarProducts as Product[];

  const productCount = products.length;
    const [addingToCart, setAddingToCart] = useState<number | null>(null);

     const handleAddToCart = (product: Product) => {
          setAddingToCart(product.id);

          router.post('/cart/add', {
            product_id: product.id,
            quantity: 1,
            price: product.price,
            variant : product.sku,
          }, {
            preserveScroll: true,
            onSuccess: () => {
              setAddingToCart(null);
            },
            onError: (errors) => {
              setAddingToCart(null);
              console.error('Error adding to cart:', errors);
              alert('Failed to add product to cart');
            }
          });
      };

  return (
    <Layout>
              {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Jars Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{JarsName}</h1>
          <div className="max-w-4xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              {JarsDescription}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Crafted from durable, food-safe glass, they are ideal for storing detergents, spices, grains,
              snacks, and household items while maintaining a neat and clutter-free space.
            </p>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              >
                <option value="Availability">Availability</option>
                <option value="Price">Price</option>
                <option value="Brand">Brand</option>
                <option value="Size">Size</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Sort and Product Count */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                  <option value="Best Selling">Best Selling</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
            <span className="text-sm text-gray-600">{productCount} products</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
                const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
                return (
                <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="relative aspect-square bg-gray-100">
                          <img
                            src={primaryImage ? `/${primaryImage.image_path}` : '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                            onClick={() => router.visit(`/product_details/${product.id}`)}
                          />

                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}

                          {/* Quick Add Button */}
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0 || addingToCart === product.id}
                            className="absolute bottom-3 right-3 bg-[#98a69e] text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {addingToCart === product.id ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Plus className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="p-4">
                          <h3
                            className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-[#98a69e] transition-colors"
                            onClick={() => router.visit(`/product_details/${product.id}`)}
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {product.compare_price && (
                                <span className="text-sm text-gray-500 line-through">
                                  KSh {product.compare_price.toLocaleString()}
                                </span>
                              )}
                              <span className="text-lg font-bold text-gray-900">
                                KSh {product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span
                              className={`text-xs font-medium ${
                                product.stock > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                            <button
                              onClick={() => router.visit(`/product_details/${product.id}`)}
                              key={product.id}
                              className="text-sm text-[#98a69e] hover:text-gray-700 font-medium"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                );
            })}
        </div>
        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-[#98a69e] text-white px-8 py-3 font-medium hover:bg-gray-700 transition-colors duration-200">
            Load More Products
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default LantyJarsPage;
