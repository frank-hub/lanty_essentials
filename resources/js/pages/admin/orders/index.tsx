import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  ChevronDown,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Grid,
  List,
  DollarSign,
  Users,
  Zap,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Printer,
  FileText,
  ShoppingBasketIcon,
  Loader
} from 'lucide-react';

interface Order {
  id: string;
  name: string;
  customer_id: string;
  order_amount: number;
  amount: number;
  order_email: string;
  order_address: string;
  shipping_address: string;
  order_date: string;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'payment_failed';
  details: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    sku: string;
  }>;
  customer: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

interface PageProps {
  orders: Order[];
}

const LantyOrdersDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);

  const { orders = [] } = usePage<PageProps>().props;

  React.useEffect(() => {
    setOrdersData(orders);
  }, [orders]);

  const statuses = ['pending', 'processing', 'completed', 'cancelled', 'payment_failed'];

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.order_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    setStatusDropdownOpen(null);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || data.error || 'Failed to update order status');
        return;
      }

      setOrdersData(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, order_status: newStatus as any }
            : order
        )
      );
    } catch (error) {
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Zap },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertTriangle },
      payment_failed: { bg: 'bg-orange-100', text: 'text-orange-800', icon: AlertTriangle }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(o => o.order_status === 'completed')
      .reduce((sum, o) => sum + (o.order_amount || o.amount || 0), 0);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600">Track and manage customer orders</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
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
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ordersData.length}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ordersData.filter(o => o.order_status === 'completed').length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ordersData.filter(o => o.order_status === 'pending' || o.order_status === 'processing').length}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ordersData.filter(o => o.order_status === 'cancelled' || o.order_status === 'payment_failed').length}</p>
                <p className="text-sm text-gray-600">Failed/Cancelled</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">KSh {(getTotalRevenue() / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600">Revenue</p>
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
                placeholder="Search by order ID, customer name or email..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStatus('all');
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

        {/* Orders Table/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-2">Customer</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.order_status);
                const StatusIcon = statusBadge.icon;

                return (
                  <div key={order.id}>
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                        />
                        <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                          {/* Order ID */}
                          <div className="col-span-2">
                            <p className="font-medium text-gray-900 font-mono text-sm">ORD-{String(order.id).substring(0, 8)}</p>
                          </div>

                          {/* Customer */}
                          <div className="col-span-2">
                            <p className="font-medium text-gray-900 text-sm">{order.customer.full_name}</p>
                            <p className="text-xs text-gray-500">{order.order_email}</p>
                          </div>

                          {/* Amount */}
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-900">KSh {(order.order_amount || order.amount || 0).toLocaleString()}</span>
                          </div>

                          {/* Date */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-900">{formatDate(order.order_date)}</p>
                            <p className="text-xs text-gray-500">{formatTime(order.order_date)}</p>
                          </div>

                          {/* Status */}
                          <div className="col-span-2 relative">
                            <button
                              onClick={() => setStatusDropdownOpen(statusDropdownOpen === order.id ? null : order.id)}
                              disabled={loadingOrderId === order.id}
                              className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 w-full justify-between"
                            >
                              <div className="flex items-center space-x-1">
                                {loadingOrderId === order.id ? (
                                  <Loader className="w-4 h-4 text-[#98a69e] animate-spin" />
                                ) : (
                                  <StatusIcon className="w-4 h-4 text-gray-600" />
                                )}
                                <span className={`text-xs rounded-full font-medium ${statusBadge.bg} ${statusBadge.text} px-2 py-1`}>
                                  {order.order_status.replace('_', ' ')}
                                </span>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform ${statusDropdownOpen === order.id ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Status Dropdown */}
                            {statusDropdownOpen === order.id && (
                              <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                                {statuses.map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(order.id, status)}
                                    disabled={loadingOrderId === order.id || status === order.order_status}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg ${
                                      status === order.order_status ? 'bg-blue-50 font-semibold text-[#98a69e]' : ''
                                    }`}
                                  >
                                    {status.replace('_', ' ')}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="p-1 text-gray-400 hover:text-[#98a69e] transition-colors"
                                title="View details">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Print">
                                <Printer className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Invoice">
                                <FileText className="w-4 h-4" />
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
                    {expandedOrder === order.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Customer Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{order.customer.full_name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{order.customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{order.customer.phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                            <div className="flex items-start space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-700">{order.shipping_address}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-gray-700">SKU</th>
                                  <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                                  <th className="px-4 py-2 text-right text-gray-700">Price</th>
                                  <th className="px-4 py-2 text-right text-gray-700">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {order.details.map((item) => (
                                  <tr key={item.id}>
                                    <td className="px-4 py-2 text-gray-900 font-mono">{item.sku}</td>
                                    <td className="px-4 py-2 text-gray-900">{item.quantity}</td>
                                    <td className="px-4 py-2 text-right text-gray-900">KSh {item.price.toLocaleString()}</td>
                                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">KSh {(item.price * item.quantity).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
            {filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.order_status);
              const StatusIcon = statusBadge.icon;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-900">ORD-{String(order.id).substring(0, 8)}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setStatusDropdownOpen(statusDropdownOpen === order.id ? null : order.id)}
                          disabled={loadingOrderId === order.id}
                          className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {loadingOrderId === order.id ? (
                            <Loader className="w-4 h-4 text-[#98a69e] animate-spin" />
                          ) : (
                            <StatusIcon className="w-4 h-4 text-gray-600" />
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {order.order_status.replace('_', ' ')}
                          </span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${statusDropdownOpen === order.id ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Status Dropdown */}
                        {statusDropdownOpen === order.id && (
                          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                            {statuses.map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusUpdate(order.id, status)}
                                disabled={loadingOrderId === order.id || status === order.order_status}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg ${
                                  status === order.order_status ? 'bg-blue-50 font-semibold text-[#98a69e]' : ''
                                }`}
                              >
                                {status.replace('_', ' ')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900">{order.customer.full_name}</p>
                      <p className="text-xs text-gray-500">{order.order_email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                        <p className="text-xl font-bold text-gray-900">KSh {(order.order_amount || order.amount || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Items</p>
                        <p className="text-xl font-bold text-gray-900">{order.details.length}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <p className="mb-1">{formatDate(order.order_date)}</p>
                      <p className="text-xs">{formatTime(order.order_date)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="flex-1 px-3 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <Printer className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {ordersData.length} orders
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

export default LantyOrdersDashboard;
