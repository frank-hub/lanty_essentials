import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, Share2 } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import Layout from './layout';

interface ProductImage {
  id: number;
  image_path: string;
  is_primary: boolean;
  sort_order: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  compare_price?: number;
  stock: number;
  category: string;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

interface PageProps {
  product: Product;
}

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
  const { product } = usePage<PageProps>().props;

  // Get primary image or first image
  const primaryImage = product.images.find((img) => img.is_primary);
  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);

  const [currentImageIndex, setCurrentImageIndex] = useState(
    primaryImage ? sortedImages.findIndex(img => img.id === primaryImage.id) : 0
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant] = useState('1 Bottle');
  const [addingToCart, setAddingToCart] = useState(false);

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
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const handleAddToCart = () => {
    setAddingToCart(true);

    router.post('/cart/add', {
      product_id: product.id,
      quantity: quantity,
      variant: selectedVariant,
      price: product.price
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setAddingToCart(false);
        alert('Product added to cart successfully!');
      },
      onError: (errors) => {
        setAddingToCart(false);
        console.error('Error adding to cart:', errors);
        alert('Failed to add product to cart');
      }
    });
  };

  const handleBuyNow = () => {
    router.post('/cart/add', {
      product_id: product.id,
      quantity: quantity,
      variant: selectedVariant,
      price: product.price
    }, {
      onSuccess: () => {
        router.visit('/checkout');
      },
      onError: (errors) => {
        console.error('Error:', errors);
        alert('Failed to process order');
      }
    });
  };

  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <Layout>
      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {sortedImages.length > 0 ? (
                <img
                  src={`/${sortedImages[currentImageIndex].image_path}`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}

              {sortedImages.length > 1 && (
                <>
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
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-[#98a69e]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={`/${image.image_path}`}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

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
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              {product.compare_price && (
                <span className="text-lg text-gray-500 line-through">
                  KSh {product.compare_price.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold text-gray-900">
                KSh {product.price.toLocaleString()}
              </span>
              {discountPercentage > 0 && (
                <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>

            {/* Shipping Info */}
            <p className="text-sm text-gray-600">
              <a href="#" className="underline hover:text-gray-900">Shipping</a> calculated at checkout.
            </p>


            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-3">
                <p className="font-medium text-gray-900">Quantity</p>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="flex-1 text-center py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Maximum {product.stock} available</p>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="w-full bg-white border-2 border-black text-black py-4 font-medium hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to cart'}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-[#98a69e] text-white py-4 font-medium rounded hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>

            {/* More Payment Options */}
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 underline">
              Mpesa option available at checkout
            </button>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* You may also like Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {relatedProduct.onSale && (
                  <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium rounded">
                    Sale
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 group-hover:text-[#98a69e] line-clamp-2">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center space-x-3">
                  {relatedProduct.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {relatedProduct.originalPrice}
                    </span>
                  )}
                  {relatedProduct.salePrice && (
                    <span className="font-semibold text-gray-900">
                      {relatedProduct.salePrice}
                    </span>
                  )}
                  {relatedProduct.fromPrice && (
                    <span className="font-semibold text-gray-900">
                      {relatedProduct.fromPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default LantyProductDetail;
