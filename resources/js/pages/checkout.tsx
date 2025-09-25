import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Truck, Shield, CreditCard, MapPin, Gift, CheckCircle } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
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

const LantyCheckoutPage: React.FC = () => {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Sample cart items (in real app, this would come from props or context)
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'LANTY Antibacterial Concentrated Underwear Laundry Detergent 300ml',
      variant: '1 Bottle',
      price: 4000,
      quantity: 2,
      image: 'https://www.malory.com.au/cdn/shop/files/3e9b4c31c67413c55ff1042ab9594d2.jpg?v=1753501380&width=2000'
    },
    {
      id: '2',
      name: 'LANTY Laundry Pods Combo',
      variant: 'Family Pack',
      price: 16000,
      quantity: 1,
      image: 'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoDiscount = subtotal * 0.1; // Assuming 10% discount applied
  const shippingCost = shippingMethod === 'express' ? 1000 : (subtotal >= 5000 ? 0 : 500);
  const total = subtotal - promoDiscount + shippingCost;

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const completeOrder = () => {
    setOrderCompleted(true);
  };

  const goBackToCart = () => {
    // In real app, this would navigate back to cart
    console.log('Navigate back to cart');
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for choosing LANTY! Your order #LT-2024-001234 has been confirmed and will be processed within 24 hours.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Order Total</span>
              <span className="font-semibold">KSh {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Delivery</span>
              <span className="text-sm font-medium text-[#98a69e]">
                {shippingMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setOrderCompleted(false)}
            className="w-full bg-[#98a69e] text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors mb-4"
          >
            Continue Shopping
          </button>
          
          <p className="text-xs text-gray-500">
            A confirmation email has been sent to your registered email address.
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
              <h1 className="text-2xl font-bold text-gray-900">LANTY</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-400 px-3 py-2 text-sm font-medium">Sanitary Pads</a>
              <a href="#" className="text-gray-400 px-3 py-2 text-sm font-medium">Laundry Detergents</a>
              <a href="#" className="text-gray-400 px-3 py-2 text-sm font-medium">Laundry Pods</a>
              <a href="#" className="text-gray-400 px-3 py-2 text-sm font-medium">Combo</a>
              <a href="#" className="text-gray-400 px-3 py-2 text-sm font-medium">Skin Care</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-400" />
              <User className="w-5 h-5 text-gray-400" />
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
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                1
              </div>
              <span className="font-medium text-gray-500">Shopping Cart</span>
            </div>
            <div className="h-0.5 w-16 bg-[#98a69e]"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#98a69e] text-white flex items-center justify-center">
                2
              </div>
              <span className="font-medium text-[#98a69e]">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#98a69e]" />
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input 
                    type="text" 
                    required
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input 
                    type="text" 
                    value={shippingInfo.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                  />
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
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="text-[#98a69e] focus:ring-[#98a69e]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Standard Delivery</span>
                      <span className="font-semibold">{subtotal >= 5000 ? 'FREE' : 'KSh 500'}</span>
                    </div>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="text-[#98a69e] focus:ring-[#98a69e]"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Express Delivery</span>
                      <span className="font-semibold">KSh 1,000</span>
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
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#98a69e] focus:ring-[#98a69e]"
                  />
                  <div className="ml-3">
                    <span className="font-medium">Credit/Debit Card</span>
                    <div className="flex space-x-2 mt-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#98a69e] focus:ring-[#98a69e]"
                  />
                  <div className="ml-3">
                    <span className="font-medium">M-Pesa</span>
                    <p className="text-sm text-gray-600">Pay with your mobile money</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-[#98a69e] focus:ring-[#98a69e]"
                  />
                  <div className="ml-3">
                    <span className="font-medium">PayPal</span>
                    <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                  </div>
                </label>
              </div>

              {/* Payment Form (conditional based on selected method) */}
              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'mpesa' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="254 7XX XXX XXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    You will receive an STK push notification to complete the payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                      <span className="absolute -top-2 -right-2 bg-[#98a69e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-600">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="border-gray-200 mb-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span>
                  <span>-KSh {promoDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `KSh ${shippingCost.toLocaleString()}`}</span>
                </div>
              </div>
              
              <hr className="border-gray-200 my-4" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>KSh {total.toLocaleString()}</span>
              </div>

              <button
                onClick={completeOrder}
                className="w-full mt-6 bg-[#98a69e] text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Complete Order
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Special Offer */}
            <div className="bg-gradient-to-r from-[#98a69e] to-green-400 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-3">
                <Gift className="w-6 h-6" />
                <h3 className="font-semibold">Special Offer!</h3>
              </div>
              <p className="text-sm mb-4 text-green-50">
                Add any sanitary pad to your order and get 15% off your next purchase!
              </p>
              <button className="bg-white text-[#98a69e] px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                Browse Sanitary Pads
              </button>
            </div>

            {/* Back to Cart */}
            <button
              onClick={goBackToCart}
              className="w-full text-center text-gray-600 hover:text-gray-900 py-2 transition-colors"
            >
              ← Back to Cart
            </button>
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
              <CreditCard className="w-8 h-8 text-[#98a69e]" />
              <h4 className="font-semibold text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-600">Multiple payment options</p>
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

export default LantyCheckoutPage;