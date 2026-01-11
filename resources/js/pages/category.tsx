import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Filter } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  originalPrice?: string;
  salePrice: string;
  image: string;
  onSale?: boolean;
}

interface CategoryPageProps {
  categoryName?: string;
  categoryDescription?: string;
}

const LantyCategoryPage: React.FC<CategoryPageProps> = ({
  categoryName = "Laundry Detergent",
  categoryDescription = "Lanty Laundry Detergents are made with non-irritating, mild, skin-friendly and plant-based ingredients. All washing liquid are origin in Australia which are eco-friendly.We make the ultimate balance between effect and health and make the hypoallergenic laundry detergent as gentle as possible to the body's skin while ensuring the cleaning effect."
}) => {
  const [filterBy, setFilterBy] = useState('Availability');
  const [sortBy, setSortBy] = useState('Featured');

  const products: Product[] = [
    {
      id: '1',
      name: 'Lanty Antibacterial Concentrated Underwear Laundry Detergent 300ml',
      originalPrice: 'KSh 9,000',
      salePrice: 'KSh 4,000',
      image: 'https://www.malory.com.au/cdn/shop/collections/11_81b78de9-4ad7-406c-bc01-e8da581ea931.jpg?v=1758272387',
      onSale: true
    },
    {
      id: '2',
      name: 'Lanty Camellia Scented Bulk Laundry Detergent 2.0',
      originalPrice: 'KSh 15,000',
      salePrice: 'KSh 8,500',
      image: 'https://www.malory.com.au/cdn/shop/collections/0cd85820ed6b69d896d3210b1850ea55.jpg?v=1753502092&width=1000',
      onSale: true
    },
    {
      id: '3',
      name: 'Lanty Premium Liquid Laundry Detergent',
      originalPrice: 'KSh 12,000',
      salePrice: 'KSh 7,200',
      image: 'https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070',
      onSale: true
    }
  ];

  const productCount = products.length;

  return (
    <div className="min-h-screen bg-white">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{categoryName}</h1>
          <div className="max-w-4xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              {categoryDescription}
            </p>
            <p className="text-gray-700 leading-relaxed">
              We aim to elevate your laundry routine with LANTY's premium laundry detergent for sensitive skin.
              Experience the power of the best laundry liquid formulated for allergies and eczema!
            </p>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
              >
                <option value="Availability">Availability</option>
                <option value="Price">Price</option>
                <option value="Brand">Brand</option>
                <option value="Size">Size</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Sort and Product Count */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                >
                  <option value="Featured">Featured</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                  <option value="Best Selling">Best Selling</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
            <span className="text-sm text-gray-600">{productCount} products</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <a href="/product_details">
                <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.onSale && (
                  <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium rounded">
                    Sale
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-small text-gray-900 group-hover:text-[#98a69e] line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between space-x-3">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {product.salePrice}
                  </span>
                </div>
              </div>
            </div>
            </a>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-[#98a69e] text-white px-8 py-3 font-medium hover:bg-gray-700 transition-colors duration-200">
            Load More Products
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-16 mt-16">
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

          {/* Newsletter Signup */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Shop Now</h4>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
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

export default LantyCategoryPage;
