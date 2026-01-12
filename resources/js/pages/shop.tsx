import React, { useState } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Layout from './Layout';

interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock: number;
  category: string;
  images: ProductImage[];
}

interface PageProps {
  products: Product[];
  categories: string[];
  currentCategory?: string;
  searchQuery?: string;
}

const ShopPage: React.FC = () => {
  const { products, categories, currentCategory, searchQuery } = usePage<PageProps>().props;

  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory || 'all');
  const [search, setSearch] = useState(searchQuery || '');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (priceRange !== 'all') {
      const price = product.price;
      switch (priceRange) {
        case '0-1000':
          if (price > 1000) return false;
          break;
        case '1000-5000':
          if (price < 1000 || price > 5000) return false;
          break;
        case '5000-10000':
          if (price < 5000 || price > 10000) return false;
          break;
        case '10000+':
          if (price < 10000) return false;
          break;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: Product) => {
    setAddingToCart(product.id);

    router.post('/cart/add', {
      product_id: product.id,
      quantity: 1,
      price: product.price
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

  const handleSearch = () => {
    router.get('/products', {
      search,
      category: selectedCategory !== 'all' ? selectedCategory : undefined
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearch('');
    setPriceRange('all');
    setSortBy('featured');
    router.get('/shop', {}, { preserveState: true });
  };

  const discountPercentage = (product: Product) => {
    if (!product.compare_price) return 0;
    return Math.round(((product.compare_price - product.price) / product.compare_price) * 100);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#98a69e] to-gray-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
            <p className="text-lg text-gray-100">Discover our wide range of quality products</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || priceRange !== 'all' || search) && (
              <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#98a69e] text-white">
                    {selectedCategory}
                    <X
                      className="w-4 h-4 ml-1 cursor-pointer"
                      onClick={() => setSelectedCategory('all')}
                    />
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#98a69e] text-white">
                    KSh {priceRange}
                    <X
                      className="w-4 h-4 ml-1 cursor-pointer"
                      onClick={() => setPriceRange('all')}
                    />
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#98a69e] text-white">
                    "{search}"
                    <X
                      className="w-4 h-4 ml-1 cursor-pointer"
                      onClick={() => setSearch('')}
                    />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <aside
              className={`lg:block ${
                showFilters ? 'block' : 'hidden'
              } bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">All Products</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                      />
                      <span className="ml-2 text-gray-700 capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="all"
                      checked={priceRange === 'all'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">All Prices</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="0-1000"
                      checked={priceRange === '0-1000'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">Under KSh 1,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="1000-5000"
                      checked={priceRange === '1000-5000'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">KSh 1,000 - 5,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="5000-10000"
                      checked={priceRange === '5000-10000'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">KSh 5,000 - 10,000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="10000+"
                      checked={priceRange === '10000+'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-4 h-4 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <span className="ml-2 text-gray-700">KSh 10,000+</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{sortedProducts.length}</span> products
                </p>
              </div>

              {sortedProducts.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-gray-600 text-lg">No products found</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-[#98a69e] hover:text-gray-700 underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => {
                    const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
                    const discount = discountPercentage(product);

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
                            onClick={() => router.visit(`/products/${product.id}`)}
                          />
                          {discount > 0 && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                              -{discount}%
                            </span>
                          )}
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
                            onClick={() => router.visit(`/products/${product.id}`)}
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
                              onClick={() => router.visit(`/products/${product.id}`)}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
