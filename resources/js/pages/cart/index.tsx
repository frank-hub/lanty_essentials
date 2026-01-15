import React, { useState } from 'react';
import { ShoppingCart, ChevronDown, Minus, Plus, X, Truck, Shield, Clock, Tag, CheckCircle } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../Layout';

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
      router.post('/cart/apply-promo', {
        code: promoCode
      }, {
        preserveScroll: true
      });
    }
  };

  const savings = cartItems.reduce((sum, item) => {
    return sum + 0; // Update this when you have compare_price
  }, 0);

//   const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
    const promoDiscount = 0;
  const finalTotal = total ;

  return (
    <Layout>
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
                  onClick={() => router.visit('/shop')}
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
                {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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
                </div> */}
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
                onClick={() => router.visit('/shop')}
                className="text-gray-600 hover:text-gray-900 underline"
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LantyCartPage;
