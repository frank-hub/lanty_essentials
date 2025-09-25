import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Minus, Plus, X, Truck, Shield, Clock, Tag, CheckCircle } from 'lucide-react';
import { router } from '@inertiajs/react';

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

const LantyCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'LANTY Antibacterial Concentrated Underwear Laundry Detergent 300ml',
      variant: '1 Bottle',
      price: 4000,
      originalPrice: 9000,
      quantity: 2,
      image: 'https://www.malory.com.au/cdn/shop/files/3e9b4c31c67413c55ff1042ab9594d2.jpg?v=1753501380&width=2000'
    },
    {
      id: '2',
      name: 'LANTY Laundry Pods Combo',
      variant: 'Family Pack',
      price: 16000,
      originalPrice: 26000,
      quantity: 1,
      image: 'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070'
    },
    {
      id: '3',
      name: 'LANTY Tableware Cleaner & Vegetable Cleaner',
      variant: 'Standard',
      price: 3000,
      originalPrice: 9000,
      quantity: 1,
      image: 'https://www.malory.com.au/cdn/shop/files/IMG_4748.jpg?v=1753499132&width=1000'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
  );
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const shippingCost = subtotal >= 5000 ? 0 : 500;
  const total = subtotal - promoDiscount + shippingCost;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">LANTY</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Sanitary Pads</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Laundry Detergents</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Laundry Pods</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Combo</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Skin Care</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home Cleaning</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact Us</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Kenya | KSh</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <User className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#98a69e]" />
                <span className="absolute -top-2 -right-2 bg-[#98a69e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#98a69e] text-white flex items-center justify-center">
                1
              </div>
              <span className="font-medium text-[#98a69e]">Shopping Cart</span>
            </div>
            <div className="h-0.5 w-16 bg-gray-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                2
              </div>
              <span className="font-medium text-gray-500">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
              <span className="text-sm text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <button className="bg-[#98a69e] text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Variant: {item.variant}</p>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="font-semibold text-gray-900">KSh {item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              KSh {item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <Tag className="w-5 h-5 text-[#98a69e]" />
                    <h3 className="font-medium text-gray-900">Promo Code</h3>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Enter promo code (try: SAVE10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        promoApplied
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : 'bg-[#98a69e] text-white hover:bg-gray-700'
                      }`}
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      10% discount applied!
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span className="font-medium">-KSh {savings.toLocaleString()}</span>
                  </div>
                )}
                
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount (10%)</span>
                    <span className="font-medium">-KSh {promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'FREE' : `KSh ${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Shipping Benefits */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700">
                    {subtotal >= 5000 
                      ? 'Congratulations! You qualify for FREE shipping'
                      : `Add KSh ${(5000 - subtotal).toLocaleString()} more for FREE shipping`
                    }
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.visit('/checkout')}
                disabled={cartItems.length === 0}
                className={`w-full mt-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                  cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#98a69e] text-white hover:bg-gray-700'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
              </button>

              {/* Trust Indicators */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="w-6 h-6 text-[#98a69e]" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Truck className="w-6 h-6 text-[#98a69e]" />
                  <span className="text-xs text-gray-600">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Clock className="w-6 h-6 text-[#98a69e]" />
                  <span className="text-xs text-gray-600">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="text-center">
              <button className="text-gray-600 hover:text-gray-900 underline">
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Secure Checkout</h4>
              <p className="text-sm text-gray-600">SSL encrypted and secure</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Free shipping over KSh 5,000</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Clock className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-sm text-gray-600">We're here to help anytime</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2024 LANTY. All rights reserved. | 
              <a href="#" className="hover:text-gray-700 ml-1">Privacy Policy</a> | 
              <a href="#" className="hover:text-gray-700 ml-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LantyCartPage;