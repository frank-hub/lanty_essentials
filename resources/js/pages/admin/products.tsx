import React, { useState } from 'react';
import { router } from '@inertiajs/react';

import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  ChevronDown, 
  Package, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  ArrowLeft,
  Upload,
  Download,
  Grid,
  List
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  createdAt: string;
  sales: number;
}

const LantyProductsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const products: Product[] = [
    {
      id: '1',
      sku: 'LT-001',
      name: 'LANTY Antibacterial Concentrated Underwear Laundry Detergent 300ml',
      category: 'Laundry Detergents',
      price: 4000,
      stock: 156,
      status: 'active',
      image: 'https://www.malory.com.au/cdn/shop/files/3e9b4c31c67413c55ff1042ab9594d2.jpg?v=1753501380&width=2000',
      createdAt: '2024-01-10',
      sales: 234
    },
    {
      id: '2',
      sku: 'LT-002',
      name: 'LANTY Laundry Pods Combo Family Pack',
      category: 'Laundry Pods',
      price: 16000,
      stock: 89,
      status: 'active',
      image: 'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070',
      createdAt: '2024-01-08',
      sales: 189
    },
    {
      id: '3',
      sku: 'LT-003',
      name: 'LANTY Tableware Cleaner & Vegetable Cleaner',
      category: 'Home Cleaning',
      price: 3000,
      stock: 12,
      status: 'active',
      image: 'https://www.malory.com.au/cdn/shop/files/IMG_4748.jpg?v=1753499132&width=1000',
      createdAt: '2024-01-05',
      sales: 145
    },
    {
      id: '4',
      sku: 'LT-004',
      name: 'LANTY Premium Sanitary Pads Ultra Thin',
      category: 'Sanitary Pads',
      price: 2500,
      stock: 0,
      status: 'inactive',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
      createdAt: '2024-01-03',
      sales: 98
    },
    {
      id: '5',
      sku: 'LT-005',
      name: 'LANTY Skin Care Bundle Premium Collection',
      category: 'Skin Care',
      price: 8500,
      stock: 45,
      status: 'draft',
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop',
      createdAt: '2024-01-01',
      sales: 67
    }
  ];

  const categories = ['Laundry Detergents', 'Laundry Pods', 'Sanitary Pads', 'Skin Care', 'Home Cleaning'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', icon: AlertTriangle };
    if (stock < 20) return { color: 'text-yellow-600', icon: AlertTriangle };
    return { color: 'text-green-600', icon: CheckCircle };
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
              <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={()=> router.visit('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            
            <button 
            onClick={() => router.visit('/add_product')}
              className="px-6 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Product
            </button>
          </div>
        </div>
      </div>
    <div className="p-6">
            {/* Header */}
      <div className="mb-6">
      <div className=''>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock < 20).length}</p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.reduce((sum, p) => sum + p.sales, 0)}</p>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#98a69e] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#98a69e] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedProducts.length})</span>
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Export
                </button>
              </div>
            )}

            {/* Export/Import */}
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('all');
                  setFilterCategory('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Table/Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
              />
              <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-1">Stock</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Sales</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const StockIcon = stockStatus.icon;
              
              return (
                <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                    <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                      {/* Product */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                      </div>
                      
                      {/* Category */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-900">{product.category}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2">
                        <span className="font-semibold text-gray-900">KSh {product.price.toLocaleString()}</span>
                      </div>
                      
                      {/* Stock */}
                      <div className="col-span-1">
                        <div className="flex items-center space-x-1">
                          <StockIcon className={`w-4 h-4 ${stockStatus.color}`} />
                          <span className="text-sm font-medium">{product.stock}</span>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-1">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      
                      {/* Sales */}
                      <div className="col-span-1">
                        <span className="text-sm font-medium text-gray-900">{product.sales}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-[#98a69e] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const StockIcon = stockStatus.icon;
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                  <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-lg text-gray-900">KSh {product.price.toLocaleString()}</span>
                    <div className="flex items-center space-x-1">
                      <StockIcon className={`w-4 h-4 ${stockStatus.color}`} />
                      <span className="text-sm font-medium">{product.stock} in stock</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{product.sales} sales</span>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-[#98a69e] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first product'
            }
          </p>
          <button className="bg-[#98a69e] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
            Add Product
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-3 py-2 bg-[#98a69e] text-white rounded-lg">1</span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
  );
};

export default LantyProductsPage;