import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tag,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Package2,
  UserCheck,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  url:string;
  badge?: string;
  submenu?: { id: string; label: string ;url:string}[];
}

const LantyAdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      url: '/dashboard'
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      url: '',
      badge: '234',
      submenu: [
        { id: 'all-products', label: 'All Products', url: '/products' },
        { id: 'add-product', label: 'Add Product' , url: '/add_product'},
        { id: 'categories', label: 'Categories', url: '/products' },
        { id: 'inventory', label: 'Inventory', url: '/products' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      url:'',
      badge: '12',
      submenu: [
        { id: 'all-orders', label: 'All Orders' , url: '/orders'},
        { id: 'pending-orders', label: 'Pending Orders', url: '/orders/pending' },
        { id: 'completed-orders', label: 'Completed Orders', url: '/orders/completed' },
        { id: 'refunds', label: 'Refunds' , url: '/orders/refunds'}
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      url: '',
      badge: '1,234'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      url: '',
      submenu: [
        { id: 'sales-report', label: 'Sales Report' , url: '/products'},
        { id: 'product-analytics', label: 'Product Analytics' , url: '/products'},
        { id: 'customer-insights', label: 'Customer Insights', url: '/products' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Tag,
      url: '',
      submenu: [
        { id: 'coupons', label: 'Coupons & Discounts' , url: '/products'},
        { id: 'email-campaigns', label: 'Email Campaigns' , url: '/products'},
        { id: 'seo', label: 'SEO Settings', url: '/products' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      url: ''
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      url: '',
      submenu: [
        { id: 'general', label: 'General Settings' , url: '/products'},
        { id: 'payment', label: 'Payment Settings' , url: '/products'},
        { id: 'shipping', label: 'Shipping Settings' , url: '/products'},
        { id: 'users', label: 'User Management', url: '/products' }
      ]
    }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: 'KSh 2,456,789',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Products',
      value: '234',
      change: '+5.1%',
      trend: 'up',
      icon: Package2,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Active Customers',
      value: '5,678',
      change: '-2.1%',
      trend: 'down',
      icon: UserCheck,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const recentOrders = [
    { id: '#LT-001234', customer: 'John Doe', amount: 'KSh 4,500', status: 'Completed', date: '2024-01-15' },
    { id: '#LT-001235', customer: 'Jane Smith', amount: 'KSh 2,300', status: 'Pending', date: '2024-01-15' },
    { id: '#LT-001236', customer: 'Mike Johnson', amount: 'KSh 6,780', status: 'Processing', date: '2024-01-14' },
    { id: '#LT-001237', customer: 'Sarah Wilson', amount: 'KSh 1,890', status: 'Completed', date: '2024-01-14' },
    { id: '#LT-001238', customer: 'David Brown', amount: 'KSh 3,456', status: 'Shipped', date: '2024-01-13' }
  ];

  const topProducts = [
    { name: 'LANTY Antibacterial Laundry Detergent', sales: 156, revenue: 'KSh 624,000' },
    { name: 'LANTY Laundry Pods Combo', sales: 142, revenue: 'KSh 568,000' },
    { name: 'LANTY Tableware Cleaner', sales: 98, revenue: 'KSh 294,000' },
    { name: 'LANTY Sanitary Pads Premium', sales: 87, revenue: 'KSh 435,000' },
    { name: 'LANTY Skin Care Bundle', sales: 76, revenue: 'KSh 380,000' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#98a69e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">LANTY</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeNav === item.id
                    ? 'bg-[#98a69e] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeNav === item.id
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
              {sidebarOpen && item.submenu && activeNav === item.id && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                     onClick={()=> router.visit(subItem.url)}
                      key={subItem.id}
                      className="block w-full text-left px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@lanty.co.ke</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="w-8 h-8 bg-[#98a69e] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{order.amount}</p>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-[#98a69e] hover:text-gray-700 font-medium">
                    View All Orders
                  </button>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{product.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-[#98a69e] hover:text-gray-700 font-medium">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button onClick={()=> router.visit('/add_product')}
               className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <Package className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Add Product</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <Tag className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Create Coupon</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <Users className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">View Customers</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <BarChart3 className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Sales Report</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <Settings className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">Settings</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#98a69e] hover:bg-green-50 transition-colors">
                <Eye className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">View Site</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LantyAdminDashboard;
