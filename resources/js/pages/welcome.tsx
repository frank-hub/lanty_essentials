import React from 'react';
import { Search, User, ShoppingCart, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  originalPrice?: string;
  salePrice: string;
  image: string;
  onSale?: boolean;
}

const LantyHomepage: React.FC = () => {
  const flashSaleProducts: Product[] = [
    {
      id: '1',
      name: 'Lanty Antibacterial Concentrated Underwear Laundry Detergent 300ml',
      originalPrice: 'KSh 9,000 ',
      salePrice: 'KSh 4,000 ',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      onSale: true
    },
    {
      id: '2',
      name: 'Lanty Laundry Pods Combo',
      originalPrice: 'KSh 26,000 ',
      salePrice: 'KSh 16,000 ',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop',
      onSale: true
    },
    {
      id: '3',
      name: 'Lanty 4 in 1 laundry pods 20 Packs',
      originalPrice: 'KSh 7,000 ',
      salePrice: 'KSh 4,000 ',
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=300&h=300&fit=crop',
      onSale: true
    },
    {
      id: '4',
      name: 'Lanty camellia scented Bulk laundry detergent 2.0',
      originalPrice: 'KSh 9,000 ',
      salePrice: 'KSh 6,000 ',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
      onSale: true
    },
    {
      id: '5',
      name: 'Lanty tableware cleaner & vegetable cleaner',
      originalPrice: 'KSh 9,000 ',
      salePrice: 'KSh 3,000 ',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
      onSale: true
    },
  ];

  const categories = [
    {
      name: 'Laundry Pods',
      image: 'https://www.malory.com.au/cdn/shop/collections/11_81b78de9-4ad7-406c-bc01-e8da581ea931.jpg?v=1758272387'
    },
    {
      name: 'Laundry Detergents',
      image: 'https://www.malory.com.au/cdn/shop/collections/0cd85820ed6b69d896d3210b1850ea55.jpg?v=1753502092&width=1000'
    },
    {
      name: 'Skin Care',
      image: 'https://www.malory.com.au/cdn/shop/collections/IMG_4748.jpg?v=1753499132&width=1000'
    },
    {
      name: 'Home Cleaning',
      image: 'https://www.malory.com.au/cdn/shop/collections/IMG_4748.jpg?v=1753499132&width=1000'
    }
  ];

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

      {/* Hero Section */}
    <section className="relative w-full h-[90vh] flex items-center justify-center bg-gray-100">
      {/* Background image */}
      <img
        src="https://www.malory.com.au/cdn/shop/files/3e9b4c31c67413c55ff1042ab9594d2.jpg?v=1753501380&width=2000" // place your hero image in public/images
        alt="Lanty Products"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-30" style={{ backgroundColor: 'rgb(0 0 0 / 37%)' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 mt-100">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Browse our latest products
        </h1>
        <a
          href="shop.index" // adjust route as per your Laravel routes
          className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-small shadow hover:bg-gray-100 transition"
        >
          Shop all
        </a>
      </div>
    </section>
      {/* Most Popular Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Most Popular Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg aspect-w-4 aspect-h-3 bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div> */}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <h4 className="text-sm font-small text-gray-900 group-hover:text-gray-600">
                    {category.name}
                  </h4>
                  <span className="text-gray-600">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Message */}
      <section className="relative py-20" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Our natural bio-based cleaning products, from laundry to kitchen, protect your home and the planet with every use
          </h3>
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 text-lg font-small hover:bg-white hover:text-gray-900 transition-colors duration-200">
            Shop all
          </button>
        </div>
      </section>

      {/* Flash Sale */}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Flash sale</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.onSale && (
                    <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-sm font-small rounded">
                      Sale
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-small text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between space-x-2">
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
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-black text-white px-8 py-3 font-small hover:bg-gray-800 transition-colors duration-200">
              View all
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center overflow-hidden rounded-lg shadow">

                {/* Left: Image */}
                <div className="w-full h-full">
                  <img
                    src="https://www.malory.com.au/cdn/shop/files/a69ede86a9b5fe9e7f808acffc20748d.png?v=1753502527&width=1500" // place your image in public/images
                    alt="Lanty Combo Deal"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: Text */}
                <div className=" w-full h-full object-cover bg-[#98a69e] p-10 flex flex-col justify-center text-center">
                  <h2 className="text-2xl md:text-3xl text-white font-bold mb-4">
                      About us
                  </h2>
                  <p className="text-white mb-6">
                    At LANTY, our vision is to empower women by providing them with high-quality,innovative Laundry and feminine care products.
                  </p>
                <div className="flex justify-center">
                  <button
                    className="bt-medium bg-white text-[#98a69e] w-24 py-2 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    MORE
                  </button>
                </div>


                </div>
              </div>
            </div>
          </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h3 className="text-4xl font-bold text-gray-900 mb-8">Bestsellers</h3>
              <p className="text-lg text-gray-700 mb-4">
                For all orders in Lanty online store, apply code
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-8">
                DEAL20 to get 0% OFF
              </p>
              <button className="bg-[#98a69e] text-white px-8 py-3 font-small hover:bg-gray-700 transition-colors duration-200">
                Shop Now
              </button>
            </div>

            {/* Product Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=400&fit=crop"
                alt="Lanty Products"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-gray-900">Lanty</h4>
                <p className="text-sm text-gray-600">Your Trusted Companion for</p>
                <p className="text-sm text-gray-600">Laundry and Feminine Hygiene</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-[#98a69e] relative overflow-hidden">
        {/* Decorative botanical elements */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute top-0 left-0 w-64 h-64" viewBox="0 0 100 100" fill="none">
            <path d="M20 80C20 80 40 60 60 80C80 100 100 80 100 80" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M10 70C10 70 30 50 50 70C70 90 90 70 90 70" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
          <svg className="absolute top-0 right-0 w-64 h-64" viewBox="0 0 100 100" fill="none">
            <path d="M0 20C0 20 20 0 40 20C60 40 80 20 80 20" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M10 30C10 30 30 10 50 30C70 50 90 30 90 30" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
          <svg className="absolute bottom-0 left-0 w-64 h-64" viewBox="0 0 100 100" fill="none">
            <path d="M80 20C80 20 60 40 40 20C20 0 0 20 0 20" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M90 30C90 30 70 50 50 30C30 10 10 30 10 30" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
          <svg className="absolute bottom-0 right-0 w-64 h-64" viewBox="0 0 100 100" fill="none">
            <path d="M100 80C100 80 80 100 60 80C40 60 20 80 20 80" stroke="currentColor" strokeWidth="0.5"/>
            <path d="M90 70C90 70 70 90 50 70C30 50 10 70 10 70" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <blockquote className="text-2xl md:text-3xl font-small text-white leading-relaxed mb-8">
            "We are committed to enhancing women's quality of life by providing high-quality
            laundry products and feminine hygiene products and information, helping women
            better manage their menstrual cycles and daily life."
          </blockquote>
          <cite className="text-lg text-white font-small">Lanty</cite>
        </div>
      </section>

      {/* Combo Deals Section */}
      <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center overflow-hidden rounded-lg shadow">

          {/* Left: Image */}
          <div className="w-full h-full">
            <img
              src="https://www.malory.com.au/cdn/shop/files/5_1_4he1_8.jpg?v=1752462368&width=1070" // place your image in public/images
              alt="Lanty Combo Deal"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Text */}
          <div className=" w-full h-full object-cover bg-[#D9CBB9] p-10 flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Lanty Combo Deals: Elevate Your Laundry Experience with Exclusive Bundles
            </h2>
            <p className="text-gray-800 mb-6">
              Discover Lanty's Combo Deals—curated bundles of top laundry products
              for an 8x cleaner, fresher load with long-lasting fragrance every time.
            </p>
          <div className="flex justify-center">
            <button
              className="bt-small bg-gray-600 text-white w-24 py-2 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              Shop New
            </button>
          </div>


          </div>
        </div>
      </div>
    </section>

      {/* Trust Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">PayPal Safe Payment</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast and Free Delivery</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">100% Pure Product</h4>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
                  <rect x="2" y="9" width="20" height="11" rx="2" ry="2"/>
                  <line x1="12" y1="13" x2="12" y2="17"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Highly Recommend</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">Blog posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop"
                  alt="Sustainable Manufacturing"
                  className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600">
                Sustainable Manufacturing Practices for Ultra T...
              </h4>
              <p className="text-sm text-gray-500 mb-3">MAY 13, 2024</p>
              <p className="text-gray-700 line-clamp-3">
                Ultra Thin Pads have become popular choices for many women seeking both comfort and...
              </p>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1594736797933-d0a9ba25c5aa?w=400&h=300&fit=crop"
                  alt="Menstrual remedies"
                  className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600">
                Tips and remedies for alleviating menstrual cra...
              </h4>
              <p className="text-sm text-gray-500 mb-3">MAY 5, 2024</p>
              <p className="text-gray-700 line-clamp-3">
                Menstrual cramps, scientifically known as dysmenorrhea, are a common experience...
              </p>
            </article>

            <article className="group cursor-pointer">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                  alt="Breaking taboos"
                  className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600">
                The Importance of Breaking Taboos Around Menstr...
              </h4>
              <p className="text-sm text-gray-500 mb-3">APRIL 30, 2024</p>
              <p className="text-gray-700 line-clamp-3">
                Introduction Breaking the silence around menstruation is not just about starting...
              </p>
            </article>
          </div>
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

export default LantyHomepage;
