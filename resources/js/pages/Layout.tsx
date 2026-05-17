import React, { ReactNode } from 'react';
import { User, ShoppingCart } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface LayoutProps {
  children: ReactNode;
}

interface CartItem {
  id: number;
  quantity: number;
}

interface LayoutPageProps {
  cartItems?: CartItem[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { cartItems = [] } = usePage<LayoutPageProps>().props;

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promotional Banner */}
      <div className="bg-purple-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-800">
            Order in Kenya above KSh 5,000, can enjoy Free Shipping Service
          </p>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button onClick={() => router.visit('/')}>
                {/* <h1 className="text-2xl font-bold text-gray-900">LANTY</h1> */}
                <img src="/assets/logo.png" alt="LANTY Logo" className="h-8 w-auto" />
              </button>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => router.visit('/category/product/laundry')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Laundry Products
              </button>
              <button
                onClick={() => router.visit('/category/product/washing_machines')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Washing Machines
              </button>
              <button
                onClick={() => router.visit('/category/product/glass_jar')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Glass Jars
              </button>
              <button
                onClick={() => router.visit('/category/product/home')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Lanty Home
              </button>
              <button
                onClick={() => router.visit('/front/blog')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                BLOG
              </button>
              <button
                onClick={() => router.visit('/contact')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Contact Us
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <User
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => router.visit('/account')}
              />
              <button
                onClick={() => router.visit('/cart')}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Customer Service</h4>
              <ul className="space-y-4">
                <li><a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="/shipping-policy" className="text-gray-600 hover:text-gray-900">Shipping Policy</a></li>
                <li><a href="/return-policy" className="text-gray-600 hover:text-gray-900">Return Policy</a></li>
                <li><a href="/refund-policy" className="text-gray-600 hover:text-gray-900">Refund Policy</a></li>
                <li><a href="/privacy-policy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="/payment-method" className="text-gray-600 hover:text-gray-900">Payment Method</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Shop</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Search</a></li>
                <li><a href="/front/blog" className="text-gray-600 hover:text-gray-900">Blogs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Collections</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-gray-900">Talk to us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Get in touch</h4>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Contact time:</span>
                  <br />
                  Monday - Saturday: 9:00 AM - 6:00 PM
                  <br />
                  Public Holidays: 11:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> support@lantyessentials.co.ke
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Company Address:</span> Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2026 LANTY. All rights reserved. |
              <a href="#" className="hover:text-gray-700 ml-1">Privacy Policy</a> |
              <a href="#" className="hover:text-gray-700 ml-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
