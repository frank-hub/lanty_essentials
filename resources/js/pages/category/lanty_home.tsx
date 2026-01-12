import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Filter } from 'lucide-react';
import Layout from '../layout';

interface Product {
  id: string;
  name: string;
  originalPrice?: string;
  salePrice: string;
  image: string;
  onSale?: boolean;
}

interface HomePageProps {
  HomeName?: string;
  HomeDescription?: string;
}

const LantyHomePage: React.FC<HomePageProps> = ({
  HomeName = "Lanty Home",
  HomeDescription = "Lanty Laundry Detergents are made with non-irritating, mild, skin-friendly and plant-based ingredients. All washing liquid are origin in Australia which are eco-friendly.We make the ultimate balance between effect and health and make the hypoallergenic laundry detergent as gentle as possible to the body's skin while ensuring the cleaning effect."
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
    <Layout>
              {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{HomeName}</h1>
          <div className="max-w-4xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              {HomeDescription}
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
    </Layout>
  );
};

export default LantyHomePage;
