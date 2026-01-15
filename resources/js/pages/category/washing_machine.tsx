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

interface MachinePageProps {
  MachineName?: string;
  MachineDescription?: string;
}

const LantyMachinePage: React.FC<MachinePageProps> = ({
  MachineName = "Washing Machines",
  MachineDescription = "Upgrade your laundry experience with reliable, energy-efficient washing machines designed to deliver powerful cleaning while caring for your fabrics. Our collection from Lanty Essentials features modern machines built for durability, performance, and ease of use—perfect for homes of all sizes."
}) => {
  const [filterBy, setFilterBy] = useState('Availability');
  const [sortBy, setSortBy] = useState('Featured');

  const products: Product[] = [
    {
      id: '1',
      name: 'LG TurboWash 360 with AI F4C510GBTN1 10 kg 1400 Spin Washing Machine - Slate Grey',
      originalPrice: 'KSh 89,000',
      salePrice: 'KSh 84,000',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXlv2eEfyQQOwmzfP_Amcnrr7C3nbZUsolDw&s',
      onSale: true
    },
    {
      id: '2',
      name: 'LG F2Y709BBTN1 9kg 1200 Spin Washing Machine in Black',
      originalPrice: 'KSh 105,000',
      salePrice: 'KSh 98,500',
      image: 'https://sonic-images.imgix.net/XL/F2Y709BBTN15.jpg?auto=format&fit=max&w=800&q=60',
      onSale: true
    },
    {
      id: '3',
      name: 'Bosch 7Kg Top Loader Washing Machine (WOE703S0IN)',
      originalPrice: 'KSh 102,000',
      salePrice: 'KSh 97,200',
      image: 'https://darlingretail.com/cdn/shop/products/1_3375291c-209f-43a2-aed9-7e02b1517e4a.jpg?v=1755761711',
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{MachineName}</h1>
          <div className="max-w-4xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              {MachineDescription}
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you’re handling everyday laundry or heavy loads, our washing machines combine
               advanced technology with water and energy efficiency to help you save time, reduce costs, and enjoy consistently fresh results.
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

export default LantyMachinePage;
