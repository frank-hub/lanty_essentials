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
                onClick={() => router.visit('/login')}
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
                  Monday - Saturday: 10:00 AM - 6:30 PM
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

      {/* Social Handles */}
      {/* Floating Social Bar */}
<div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex flex-col">

  {/* Instagram */}
<a
    href="https://instagram.com/lantykenya"
    target="_blank"
    rel="noopener noreferrer"
    title="Instagram"
    className="group flex items-center bg-white border border-gray-200 border-b-0 px-2 py-3 shadow-sm hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 w-10 hover:w-36 overflow-hidden"
  >
    <svg className="w-5 h-5 text-pink-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
    <span className="ml-2 text-xs font-semibold text-pink-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Instagram
    </span>
  </a>

  {/* Facebook */}
<a
    href="https://www.facebook.com/lantyessentials"
    target="_blank"
    rel="noopener noreferrer"
    title="Facebook"
    className="group flex items-center bg-white border border-gray-200 border-b-0 px-2 py-3 shadow-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 w-10 hover:w-36 overflow-hidden"
  >
    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    <span className="ml-2 text-xs font-semibold text-blue-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      Facebook
    </span>
  </a>

  {/* TikTok */}
<a
    href="https://www.tiktok.com/@all_laundryessentials"
    target="_blank"
    rel="noopener noreferrer"
    title="TikTok"
    className="group flex items-center bg-white border border-gray-200 px-2 py-3 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-10 hover:w-36 overflow-hidden"
  >
    <svg className="w-5 h-5 text-gray-900 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.17 8.17 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/>
    </svg>
    <span className="ml-2 text-xs font-semibold text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      TikTok
    </span>
  </a>

</div>
    </div>
  );
};

export default Layout;
