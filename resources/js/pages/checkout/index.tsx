import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Truck, Shield, CreditCard, MapPin, Gift, CheckCircle, Menu, X } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface CartItem {
  id: number;
  product_id: number;
  variant: string | null;
  price: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    sku: string;
    images: { id: number; image_path: string; is_primary: boolean }[];
  };
  subtotal: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface PageProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const LantyCheckoutPage: React.FC = () => {
  const { cartItems = [], subtotal = 0, shipping = 0, total = 0 } = usePage<PageProps>().props;

  const [orderCompleted, setOrderCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const promoDiscount = subtotal * 0.1;
  const shippingCost = shippingMethod === 'express' ? 1000 : (subtotal >= 5000 ? 0 : shipping);
  const finalTotal = subtotal - promoDiscount + shippingCost;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const completeOrder = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOrderCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing LANTY! Your order has been confirmed and will be processed within 24 hours.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Order Total</p>
                <p className="font-semibold text-lg">KSh {finalTotal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Estimated Delivery</p>
                <p className="text-sm font-medium text-[#98a69e]">
                  {shippingMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Shipped To</p>
                <p className="text-sm font-medium">{shippingInfo.city}, Kenya</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.visit('/products')}
            className="w-full bg-[#98a69e] text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mb-4"
          >
            Continue Shopping
          </button>

          <p className="text-xs text-gray-500">
            A confirmation email has been sent to {shippingInfo.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button onClick={() => router.visit('/')} className="hover:opacity-80">
                <h1 className="text-2xl font-bold text-gray-900">LANTY</h1>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <button onClick={() => router.visit('/products/category/sanitary-pads')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Sanitary Pads</button>
              <button onClick={() => router.visit('/products/category/laundry-detergents')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Laundry Detergents</button>
              <button onClick={() => router.visit('/products/category/laundry-pods')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Laundry Pods</button>
              <button onClick={() => router.visit('/products/category/combo')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Combo</button>
              <button onClick={() => router.visit('/products/category/skin-care')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Skin Care</button>
              <button onClick={() => router.visit('/faqs')} className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">FAQs</button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
              <User className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" onClick={() => router.visit('/account')} />
              <div className="relative cursor-pointer" onClick={() => router.visit('/cart')}>
                <ShoppingCart className="w-5 h-5 text-[#98a69e]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#98a69e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <button onClick={() => { router.visit('/products/category/sanitary-pads'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Sanitary Pads</button>
              <button onClick={() => { router.visit('/products/category/laundry-detergents'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Laundry Detergents</button>
              <button onClick={() => { router.visit('/products/category/laundry-pods'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Laundry Pods</button>
              <button onClick={() => { router.visit('/products/category/combo'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Combo</button>
              <button onClick={() => { router.visit('/products/category/skin-care'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">Skin Care</button>
              <button onClick={() => { router.visit('/faqs'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900">FAQs</button>
            </div>
          )}
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            <button onClick={() => router.visit('/cart')} className="flex items-center space-x-2 hover:opacity-75 transition">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">1</div>
              <span className="text-sm font-medium text-gray-500">Shopping Cart</span>
            </button>
            <div className="h-0.5 w-12 bg-[#98a69e]"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#98a69e] text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-medium text-[#98a69e]">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#98a69e]" />
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" required value={shippingInfo.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" required value={shippingInfo.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required value={shippingInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" required value={shippingInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+254 7XX XXX XXX" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input type="text" required value={shippingInfo.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" required value={shippingInfo.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input type="text" value={shippingInfo.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-[#98a69e]" />
                Shipping Method
              </h3>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: shippingMethod === 'standard' ? '#98a69e' : undefined}}>
                  <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={(e) => setShippingMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Standard Delivery</span>
                      <span className="font-semibold text-gray-900">{subtotal >= 5000 ? 'FREE' : 'KSh 500'}</span>
                    </div>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: shippingMethod === 'express' ? '#98a69e' : undefined}}>
                  <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={(e) => setShippingMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Express Delivery</span>
                      <span className="font-semibold text-gray-900">KSh 1,000</span>
                    </div>
                    <p className="text-sm text-gray-600">1-2 business days</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-[#98a69e]" />
                Payment Method
              </h3>

              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: paymentMethod === 'card' ? '#98a69e' : undefined}}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-900">Credit/Debit Card</span>
                    <div className="flex space-x-2 mt-2">
                      <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">VISA</div>
                      <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">MC</div>
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: paymentMethod === 'mpesa' ? '#98a69e' : undefined}}>
                  <input type="radio" name="payment" value="mpesa" checked={paymentMethod === 'mpesa'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">M-Pesa</span>
                    <p className="text-sm text-gray-600">Pay with your mobile money</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: paymentMethod === 'paypal' ? '#98a69e' : undefined}}>
                  <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">PayPal</span>
                    <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'mpesa' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
                  <input type="tel" placeholder="254 7XX XXX XXX" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                  <p className="text-sm text-gray-600 mt-2">You will receive an STK push to complete payment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              {cartItems.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => {
                      const primaryImage = item.product.images.find(img => img.is_primary) || item.product.images[0];
                      return (
                        <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                          <div className="relative flex-shrink-0">
                            <img src={primaryImage ? `/${primaryImage.image_path}` : '/placeholder.jpg'} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                            <span className="absolute -top-2 -right-2 bg-[#98a69e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.quantity}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                            <p className="text-sm text-gray-600">KSh {item.subtotal}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <hr className="border-gray-200 mb-4" />

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">KSh {subtotal}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (10%)</span>
                        <span className="font-medium">-KSh {promoDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>{shippingCost === 0 ? 'FREE' : `KSh ${shippingCost.toLocaleString()}`}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200 my-4" />

                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="text-[#98a69e]">KSh {finalTotal.toLocaleString()}</span>
                  </div>

                  <button onClick={completeOrder} disabled={isSubmitting} className="w-full bg-[#98a69e] text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                    <span>{isSubmitting ? 'Processing...' : 'Complete Order'}</span>
                    {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                  </button>

                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Your payment is secure and encrypted</span>
                  </div>
                </>
              )}
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-[#98a69e] to-green-400 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <Gift className="w-6 h-6" />
                <h3 className="font-semibold">Special Offer!</h3>
              </div>
              <p className="text-sm mb-4">Add any sanitary pad to your order and get 15% off your next purchase!</p>
              <button onClick={() => router.visit('/products/category/sanitary-pads')} className="bg-white text-[#98a69e] px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">Browse Sanitary Pads</button>
            </div>

            <button onClick={() => router.visit('/cart')} className="w-full text-center text-gray-600 hover:text-gray-900 py-2 transition-colors flex items-center justify-center space-x-1">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Secure Checkout</h4>
              <p className="text-sm text-gray-600">SSL encrypted</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Free over KSh 5,000</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CreditCard className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-600">Multiple options</p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
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

export default LantyCheckoutPage;
