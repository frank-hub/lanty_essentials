import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Grid,
  List,
  DollarSign,
  Calendar,
  FileText,
  Trash2,
  Download,
  Edit
} from 'lucide-react';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  billing_address: string;
  default_shipping_address: string;
  created_at: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string | null;
}

interface PageProps {
  customers: Customer[];
}

const LantyCustomersDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [filterCountry, setFilterCountry] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const { customers = [] } = usePage<PageProps>().props;

  const countries = Array.from(new Set(customers.map(c => c.country)));

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);

    const matchesCountry = filterCountry === 'all' || customer.country === filterCountry;

    return matchesSearch && matchesCountry;
  });

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const getTotalRevenue = () => {
    return filteredCustomers.reduce((sum, c) => sum + c.total_spent, 0);
  };

  const getAverageSpent = () => {
    if (filteredCustomers.length === 0) return 0;
    return getTotalRevenue() / filteredCustomers.length;
  };

  const getCustomerValue = (customer: Customer) => {
    if (customer.total_spent === 0) return { label: 'New', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (customer.total_spent < 50000) return { label: 'Standard', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (customer.total_spent < 100000) return { label: 'Premium', color: 'text-green-600', bg: 'bg-green-100' };
    return { label: 'VIP', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return 'KSh ' + amount.toLocaleString();
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
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600">Manage and analyze customer data</p>
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
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.total_orders > 0).length}</p>
                <p className="text-sm text-gray-600">Active Customers</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.total_orders === 0).length}</p>
                <p className="text-sm text-gray-600">Inactive/New</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(getTotalRevenue() / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(getAverageSpent() / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600">Avg Spent</p>
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
                placeholder="Search by name, email or phone..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterCountry('all');
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

        {/* Customers Table/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Contact</div>
                  <div className="col-span-2">Orders</div>
                  <div className="col-span-2">Total Spent</div>
                  <div className="col-span-1">Tier</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const tier = getCustomerValue(customer);

                return (
                  <div key={customer.id}>
                    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                        />
                        <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                          {/* Customer Name */}
                          <div className="col-span-3">
                            <p className="font-medium text-gray-900">{customer.full_name}</p>
                            <p className="text-xs text-gray-500">{customer.country}</p>
                          </div>

                          {/* Contact */}
                          <div className="col-span-2">
                            <div className="flex flex-col space-y-1 text-sm">
                              <a href={`mailto:${customer.email}`} className="text-[#98a69e] hover:underline truncate">{customer.email}</a>
                              <a href={`tel:${customer.phone}`} className="text-gray-600 hover:text-gray-900">{customer.phone}</a>
                            </div>
                          </div>

                          {/* Orders */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">{customer.total_orders} orders</span>
                            </div>
                          </div>

                          {/* Total Spent */}
                          <div className="col-span-2">
                            <span className="font-semibold text-gray-900">{formatCurrency(customer.total_spent)}</span>
                          </div>

                          {/* Tier */}
                          <div className="col-span-1">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${tier.bg} ${tier.color}`}>
                              {tier.label}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
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
                    {expandedCustomer === customer.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Personal Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{customer.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{customer.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">Joined {formatDate(customer.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Billing Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Billing Address</h4>
                            <div className="flex items-start space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{customer.billing_address || 'Not provided'}</p>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                            <div className="flex items-start space-x-2 text-sm">
                              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{customer.default_shipping_address || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Stats */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{customer.total_orders}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.total_spent)}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.average_order_value)}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Order</p>
                            <p className="text-2xl font-bold text-gray-900">{customer.last_order_date ? formatDate(customer.last_order_date) : 'Never'}</p>
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
            {filteredCustomers.map((customer) => {
              const tier = getCustomerValue(customer);

              return (
                <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 border-b border-gray-200 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{customer.full_name}</h3>
                      <p className="text-sm text-gray-500">{customer.country}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${tier.bg} ${tier.color}`}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${customer.email}`} className="text-[#98a69e] hover:underline truncate">{customer.email}</a>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${customer.phone}`} className="text-gray-700 hover:text-gray-900">{customer.phone}</a>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Orders</p>
                        <p className="text-xl font-bold text-gray-900">{customer.total_orders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Spent</p>
                        <p className="text-xl font-bold text-gray-900">{(customer.total_spent / 1000).toFixed(1)}k</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                        className="flex-1 px-3 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600">
              {searchTerm || filterCountry !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No customers have been registered yet'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredCustomers.length} of {customers.length} customers
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

export default LantyCustomersDashboard;
