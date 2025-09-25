import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Minus, Plus, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';

// Then use it in your buttons
<button 
  onClick={() => router.visit('/laundry-detergents')}
  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
>
  Laundry Detergents
</button>
interface RelatedProduct {
  id: string;
  name: string;
  originalPrice?: string;
  salePrice: string;
  fromPrice?: string;
  image: string;
  onSale?: boolean;
}

const LantyProductDetail: React.FC = () => {
  const [quantity, setQuantity] = useState(2);
  const [selectedVariant, setSelectedVariant] = useState('1 Bottle');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productImages = [
    'https://www.malory.com.au/cdn/shop/files/3e9b4c31c67413c55ff1042ab9594d2.jpg?v=1753501380&width=2000',
    'https://www.malory.com.au/cdn/shop/collections/11_81b78de9-4ad7-406c-bc01-e8da581ea931.jpg?v=1758272387',
    'https://www.malory.com.au/cdn/shop/collections/0cd85820ed6b69d896d3210b1850ea55.jpg?v=1753502092&width=1000',
    'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070'
  ];

  const relatedProducts: RelatedProduct[] = [
    {
      id: '1',
      name: 'Lanty tableware cleaner & vegetable cleaner',
      originalPrice: 'KSh 9,000',
      salePrice: 'KSh 3,000',
      image: 'https://www.malory.com.au/cdn/shop/files/IMG_4748.jpg?v=1753499132&width=1000',
      onSale: true
    },
    {
      id: '2',
      name: 'LANTY New Underwear-Shaped Pads',
      fromPrice: 'From KSh 5,000',
      salePrice: '',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
      onSale: false
    },
    {
      id: '3',
      name: 'LANTY Laundry Pods Combo',
      originalPrice: 'KSh 26,000',
      salePrice: 'KSh 16,000',
      image: 'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070',
      onSale: true
    },
    {
      id: '4',
      name: 'LANTY 5 in 1 Laundry pods 80 Packs',
      originalPrice: 'KSh 23,000',
      salePrice: 'KSh 19,000',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=300&fit=crop',
      onSale: true
    }
  ];

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <div className="bg-purple-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
          <p className="text-sm text-gray-800 text-center">
            Order in Kenya above KSh 5,000, can enjoy Free Shipping Service
          </p>
          <ChevronRight className="w-5 h-5 text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">LANTY</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Sanitary Pads
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium border-b-2 border-gray-900">
                Laundry Detergents
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Laundry Pods
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Combo
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Skin Care
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home Cleaning
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                FAQS
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Contact Us
              </a>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">              
              <User className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <ShoppingCart className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[currentImageIndex]}
                alt="LANTY Antibacterial Concentrated Underwear Laundry Detergent"
                className="w-full h-full object-contain"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-[#98a69e]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Video Section */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070"
                alt="Product video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <button className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-sm">
                LANTY
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm">
                Gentle Care for Every Inch of Fabric...
              </div>
            </div>

            {/* Share Button */}
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <p className="text-sm text-gray-600 mb-2">LANTY</p>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                LANTY Antibacterial Concentrated Underwear Laundry Detergent 300ml
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-lg text-gray-500 line-through">KSh 9,000</span>
              <span className="text-2xl font-bold text-gray-900">KSh 4,000</span>
              <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">
                Sale
              </span>
            </div>

            {/* Shipping Info */}
            <p className="text-sm text-gray-600">
              <a href="#" className="underline hover:text-gray-900">Shipping</a> calculated at checkout.
            </p>

            {/* Variant Selection */}
            <div className="space-y-3">
              <p className="font-medium text-gray-900">Bottle</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedVariant('1 Bottle')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedVariant === '1 Bottle'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  1 Bottle
                </button>
                <button
                  onClick={() => setSelectedVariant('2 Bottles')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedVariant === '2 Bottles'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  2 Bottles
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="font-medium text-gray-900">Quantity</p>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="flex-1 text-center py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
            onClick={() => router.visit('/cart')}
              className="w-full bg-white border-2 border-black text-black py-4 font-medium hover:bg-black hover:text-white transition-colors duration-200">
              Add to cart
            </button>

            {/* PayPal Button */}
            <button className="w-full bg-yellow-400 text-black py-4 font-medium rounded hover:bg-yellow-500 transition-colors duration-200 flex items-center justify-center space-x-2">
              <span>Pay with</span>
              <span className="font-bold text-blue-800">PayPal</span>
            </button>

            {/* More Payment Options */}
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 underline">
              More payment options
            </button>
          </div>
        </div>
      </main>

      {/* You may also like Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.onSale && (
                  <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium rounded">
                    Sale
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 group-hover:text-[#98a69e] line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-3">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.salePrice && (
                    <span className="font-semibold text-gray-900">
                      {product.salePrice}
                    </span>
                  )}
                  {product.fromPrice && (
                    <span className="font-semibold text-gray-900">
                      {product.fromPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Customer Service */}
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

            {/* Shop */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Shop</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">search</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blogs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">collections</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Talk to us</a></li>
              </ul>
            </div>

            {/* Get in touch */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Get in touch</h4>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-small">Contact time:</span> Monday-Friday 9am-5pm AEST
                </p>
                <p className="text-gray-600">
                  <span className="font-small">Email:</span> service@Lanty.com.au
                </p>
                <p className="text-gray-600">
                  <span className="font-small">Company Address:</span> D7/11-15 Moxon Rd, Punchbowl NSW 2196 Australia
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Shop Now</h4>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="px-6 py-3 bg-gray-900 text-white rounded-r-md hover:bg-gray-800 transition-colors duration-200">
                →
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LantyProductDetail;