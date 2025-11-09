import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Minus, Plus, X, Truck, Shield, Clock, Tag, CheckCircle } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  images: ProductImage[];
}

interface CartItem {
  id: number;
  product_id: number;
  variant: string | null;
  price: number;
  quantity: number;
  product: Product;
  subtotal: number;
}

interface PageProps {
  cartItems: CartItem[];
  subtotal: CartItem['subtotal'];
  shipping: number;
  total: number;
}

const LantyCartPage: React.FC = () => {
  const { cartItems, subtotal, shipping, total } = usePage<PageProps>().props;

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }

    setUpdatingItem(itemId);

    router.patch(`/cart/${itemId}`, {
      quantity: newQuantity
    }, {
      preserveScroll: true,
      onFinish: () => setUpdatingItem(null)
    });
  };

  const removeItem = (itemId: number) => {
    if (confirm('Are you sure you want to remove this item?')) {
      router.delete(`/cart/${itemId}`, {
        preserveScroll: true
      });
    }
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      router.delete('/cart', {
        preserveScroll: true
      });
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
      // In real app, send to backend
      router.post('/cart/apply-promo', {
        code: promoCode
      }, {
        preserveScroll: true
      });
    }
  };

  // Calculate savings
  const savings = cartItems.reduce((sum, item) => {
    const product = item.product;
    // Assuming you have compare_price in your product model
    return sum + 0; // Update this when you have compare_price
  }, 0);

  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - promoDiscount;

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
                <h1 className="text-2xl font-bold text-gray-900">LANTY</h1>
              </button>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => router.visit('/products/category/sanitary-pads')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sanitary Pads
              </button>
              <button
                onClick={() => router.visit('/products/category/laundry-detergents')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Laundry Detergents
              </button>
              <button
                onClick={() => router.visit('/products/category/laundry-pods')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Laundry Pods
              </button>
              <button
                onClick={() => router.visit('/products/category/combo')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Combo
              </button>
              <button
                onClick={() => router.visit('/products/category/skin-care')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Skin Care
              </button>
              <button
                onClick={() => router.visit('/products/category/home-cleaning')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Home Cleaning
              </button>
              <button
                onClick={() => router.visit('/faqs')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                FAQS
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
              <div className="relative">
                <ShoppingCart
                  className="w-5 h-5 text-[#98a69e] cursor-pointer"
                  onClick={() => router.visit('/cart')}
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#98a69e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
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
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <button
                  onClick={() => router.visit('/products')}
                  className="bg-[#98a69e] text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => {
                  const primaryImage = item.product.images.find(img => img.is_primary) || item.product.images[0];

                  return (
                    <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={primaryImage ? `/${primaryImage.image_path}` : '/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mb-2">Variant: {item.variant}</p>
                          )}
                          <p className="text-xs text-gray-500 mb-2">SKU: {item.product.sku}</p>

                          <div className="flex items-center space-x-3 mb-3">
                            <span className="font-semibold text-gray-900">
                              KSh {item.price}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItem === item.id}
                                className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 font-medium min-w-[60px] text-center">
                                {updatingItem === item.id ? '...' : item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItem === item.id}
                                className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium text-gray-900">
                                Subtotal: KSh {subtotal}
                              </span>
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
                    </div>
                  );
                })}

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

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">KSh {subtotal}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You save</span>
                    <span className="font-medium">-KSh {savings}</span>
                  </div>
                )}

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo discount (10%)</span>
                    <span className="font-medium">-KSh {promoDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'FREE' : `KSh ${shipping}`}
                  </span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>KSh {finalTotal}</span>
                </div>
              </div>

              {/* Shipping Benefits */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3 text-sm">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700">
                    {subtotal >= 5000
                      ? 'Congratulations! You qualify for FREE shipping'
                      : `Add KSh ${(5000 - subtotal)} more for FREE shipping`
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
              <button
                onClick={() => router.visit('/products')}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Customer Service</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Shipping Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Return Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Refund Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms of Conditions</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Payment Method</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Shop</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">search</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blogs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">collections</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Talk to us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Get in touch</h4>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Contact time:</span> Monday-Friday 9am-5pm EAT
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> service@lanty.co.ke
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Company Address:</span> Nairobi, Kenya
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
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
