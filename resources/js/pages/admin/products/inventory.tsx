import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Grid,
  List,
  DollarSign,
  Boxes,
  BarChart3,
  Calendar,
  Tag,
  Loader
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorder_level: number;
  unit_price: number;
  total_value: number;
  last_restocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  movement_30_days: number;
  supplier: string;
}

interface PageProps {
  inventory: InventoryItem[];
}

const LantyInventoryDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const { inventory = [] } = usePage<PageProps>().props;

  React.useEffect(() => {
    setInventoryData(inventory);
  }, [inventory]);

  const categories = Array.from(new Set(inventoryData.map(item => item.category)));

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_stock: { bg: 'bg-green-100', text: 'text-green-800', icon: Package },
      low_stock: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.in_stock;
  };

  const getTotalInventoryValue = () => {
    return filteredItems.reduce((sum, item) => sum + item.total_value, 0);
  };

  const getLowStockItems = () => {
    return inventoryData.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  };

  const getAverageTurnover = () => {
    if (filteredItems.length === 0) return 0;
    return (filteredItems.reduce((sum, item) => sum + item.movement_30_days, 0) / filteredItems.length).toFixed(1);
  };

  const formatCurrency = (amount: number) => {
    return 'KSh ' + amount.toLocaleString('en-KE', { maximumFractionDigits: 0 });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUpdateStock = async (itemId: string, newQuantity: number) => {
    setLoadingItemId(itemId);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch(`/admin/inventory/${itemId}/update-stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Failed to update stock');
        return;
      }

      setInventoryData(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      alert('Failed to update stock. Please try again.');
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.visit('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
              <p className="text-gray-600">Manage stock levels and warehouse inventory</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => router.visit('/add_product')} className="px-6 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Boxes className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inventoryData.length}</p>
                <p className="text-sm text-gray-600">Total SKUs</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inventoryData.filter(i => i.status === 'in_stock').length}</p>
                <p className="text-sm text-gray-600">In Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getLowStockItems()}</p>
                <p className="text-sm text-gray-600">Low/Out of Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(getTotalInventoryValue() / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAverageTurnover()}</p>
                <p className="text-sm text-gray-600">Avg Turnover (30d)</p>
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
                placeholder="Search by name, SKU or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
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
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
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

        {/* Inventory Table/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Stock Level</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                const StatusIcon = statusBadge.icon;
                const stockPercentage = (item.quantity / (item.reorder_level * 3)) * 100;

                return (
                  <div key={item.id}>
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                        />
                        <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                          {/* Product */}
                          <div className="col-span-3">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.sku}</p>
                          </div>

                          {/* Category */}
                          <div className="col-span-2">
                            <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {item.category}
                            </span>
                          </div>

                          {/* Stock Level */}
                          <div className="col-span-2">
                            <div className="space-y-1">
                              <p className="font-semibold text-gray-900">{item.quantity} units</p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    stockPercentage > 50 ? 'bg-green-500' :
                                    stockPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Unit Price */}
                          <div className="col-span-2">
                            <p className="font-semibold text-gray-900">{formatCurrency(item.unit_price)}</p>
                            <p className="text-xs text-gray-500">Value: {formatCurrency(item.total_value)}</p>
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            <div className="flex items-center space-x-1">
                              <StatusIcon className="w-4 h-4 text-gray-600" />
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                {item.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                className="p-1 text-gray-400 hover:text-[#98a69e] transition-colors"
                                title="View details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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

                    {/* Expanded Details */}
                    {expandedItem === item.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Stock Information</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-gray-500">Current Stock</p>
                                <p className="font-semibold text-gray-900">{item.quantity} units</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Reorder Level</p>
                                <p className="font-semibold text-gray-900">{item.reorder_level} units</p>
                              </div>
                              <div>
                                <p className="text-gray-500">30-Day Movement</p>
                                <p className="font-semibold text-gray-900">{item.movement_30_days} units</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Pricing</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-gray-500">Unit Price</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.unit_price)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Total Value</p>
                                <p className="font-semibold text-gray-900">{formatCurrency(item.total_value)}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Supplier</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-gray-500">Supplier Name</p>
                                <p className="font-semibold text-gray-900">{item.supplier}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Last Restocked</p>
                                <p className="font-semibold text-gray-900">{formatDate(item.last_restocked)}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Quick Update</h4>
                            <div className="space-y-2">
                              <input
                                type="number"
                                placeholder="New stock qty"
                                disabled={loadingItemId === item.id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const value = parseInt((e.target as HTMLInputElement).value);
                                    if (!isNaN(value)) {
                                      handleUpdateStock(item.id, value);
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = (e.currentTarget as any).previousElementSibling;
                                  const value = parseInt(input.value);
                                  if (!isNaN(value)) {
                                    handleUpdateStock(item.id, value);
                                    input.value = '';
                                  }
                                }}
                                disabled={loadingItemId === item.id}
                                className="w-full px-3 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-1"
                              >
                                {loadingItemId === item.id ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Updating...</span>
                                  </>
                                ) : (
                                  <span>Update Stock</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              const StatusIcon = statusBadge.icon;
              const stockPercentage = (item.quantity / (item.reorder_level * 3)) * 100;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                        <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="w-4 h-4 text-gray-600" />
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Stock Level</p>
                      <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            stockPercentage > 50 ? 'bg-green-500' :
                            stockPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Reorder: {item.reorder_level} units</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Unit Price</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.unit_price)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Value</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(item.total_value)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
                      <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{item.category}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                        className="flex-1 px-3 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No inventory items registered yet'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredItems.length} of {inventoryData.length} items
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
  );
};

export default LantyInventoryDashboard;
