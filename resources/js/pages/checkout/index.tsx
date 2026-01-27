import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, ChevronRight, Truck, Shield, CreditCard, MapPin, Gift, CheckCircle, Menu, X, AlertCircle } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Layout from '../Layout';

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
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+254',
    address: '',
    city: '',
    postalCode: ''
  });

  const promoDiscount = subtotal * 0.1;
  const shippingCost = shippingMethod === 'express' ? 300 : (subtotal >= 5000 ? 0 : shipping);
  const finalTotal = subtotal  + shippingCost;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!shippingInfo.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!shippingInfo.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!shippingInfo.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!shippingInfo.city.trim()) {
      setError('City is required');
      return false;
    }
    return true;
  };

  const completeOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      if (!csrfToken) {
        throw new Error('Security token not found. Please refresh the page and try again.');
      }

      const response = await fetch('/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          shippingMethod: shippingMethod,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Order processing failed');
      }

      setOrderCompleted(true);
      setTimeout(() => {
        router.visit('/products');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing LANTY! Your order has been confirmed and will be processed within 24 hours.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3">
            <div>
              <p className="text-xs text-gray-600">Order Total</p>
              <p className="font-semibold text-lg">KSh {finalTotal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Shipping Method</p>
              <p className="text-sm font-medium text-[#98a69e]">
                {shippingMethod === 'express' ? 'Express (1-2 Business Days)' : 'Standard (3-5 Business Days)'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Shipping To</p>
              <p className="text-sm font-medium">{shippingInfo.city}, Kenya</p>
            </div>
          </div>

          <button
            onClick={() => router.visit('/products')}
            className="w-full bg-[#98a69e] text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mb-4"
          >
            Continue Shopping
          </button>

          <p className="text-xs text-gray-500">
            A confirmation email has been sent to <strong>{shippingInfo.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#98a69e]" />
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" required value={shippingInfo.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" required value={shippingInfo.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required value={shippingInfo.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="john@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" required value={shippingInfo.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+254 712 345 678" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input type="text" required value={shippingInfo.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="123 Main Street, Apt 4B" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input type="text" required value={shippingInfo.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="Nairobi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input type="text" value={shippingInfo.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" placeholder="00100" />
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
                      <span className="font-medium text-gray-900">Same Day Delivery</span>
                      <span className="font-semibold text-gray-900">{subtotal >= 5000 ? 'FREE' : 'KSh 150'}</span>
                    </div>
                    <p className="text-sm text-gray-600">Within Nairobi (Pick Up Mtaani)</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: shippingMethod === 'express' ? '#98a69e' : undefined}}>
                  <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={(e) => setShippingMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Same Day Delivery</span>
                      <span className="font-semibold text-gray-900">{subtotal >= 5000 ? 'FREE' : 'KSh 300'}</span>
                    </div>
                    <p className="text-sm text-gray-600">Outside Nairobi</p>
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
                {/* <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: paymentMethod === 'card' ? '#98a69e' : undefined}}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-900">Credit/Debit Card</span>
                    <div className="flex space-x-2 mt-2">
                      <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">VISA</div>
                      <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">MC</div>
                    </div>
                  </div>
                </label> */}

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#98a69e] transition-colors" style={{borderColor: paymentMethod === 'mpesa' ? '#98a69e' : undefined}}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                  {/* TODO: Add M-Pesa Feature all backend is ready */}
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">M-Pesa</span>
                    <p className="text-sm text-gray-600">Pay with your mobile money</p>
                  </div>
                </label>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                    💳 Payment processing is in development. We'll call you to arrange delivery and payment.
                </p>
              </div>
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
                      <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                    </div>

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
                    <span>{isSubmitting ? 'Processing Order...' : 'Complete Order'}</span>
                    {!isSubmitting && <ChevronRight className="w-5 h-5" />}
                  </button>

                  <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Your payment is secure and encrypted</span>
                  </div>
                </>
              )}
            </div>



            <button onClick={() => router.visit('/cart')} className="w-full text-center text-gray-600 hover:text-gray-900 py-2 transition-colors flex items-center justify-center space-x-1">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LantyCheckoutPage;
