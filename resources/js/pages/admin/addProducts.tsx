import React, { useState } from 'react';
import {router} from '@inertiajs/react'
import axios from 'axios'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Minus, 
  Save, 
  Eye, 
  AlertCircle, 
  CheckCircle,
  Image as ImageIcon,
  Tag,
  Package,
  DollarSign,
  BarChart3,
  Trash2,
  Copy
} from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

const LantyAddProductPage: React.FC = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: '',
    comparePrice: '',
    cost: '',
    category: '',
    tags: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    stock: '',
    trackQuantity: true,
    status: 'draft',
    visibility: 'visible',
    seoTitle: '',
    seoDescription: '',
    specifications: ''
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Laundry Detergents',
    'Laundry Pods', 
    'Sanitary Pads',
    'Skin Care',
    'Home Cleaning'
  ];

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDimensionChange = (dimension: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      stock: 0,
      sku: ''
    };
    setVariants([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: string, value: string | number) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ProductImage = {
            id: Date.now().toString() + index,
            url: e.target?.result as string,
            alt: file.name,
            isPrimary: images.length === 0 && index === 0
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const setPrimaryImage = (id: string) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!productData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!productData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!productData.category) {
      newErrors.category = 'Category is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status: 'draft' | 'active') => {
    const updatedData = { ...productData, status };
    setProductData(updatedData);
      console.log(updatedData)

    if (validateForm()) {
      // Here you would typically send data to your Laravel backend
      try {
        const response = await axios.post('add_product',{
        ...updatedData,
        images,
        variants
      });
      console.log(updatedData)
      console.log('Server Responce: ', response.data);
      
      // Show success message or redirect
      alert(`Product ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      }catch (error: any){
    //     if (error.response) {
    //     // Laravel validation / server error
    //     alert(`Error: ${error.response.data.message || 'Something went wrong'}`);
    //   } else {
    //     alert('Network error, please try again.');
    //   }
    //   console.error('Error saving product:', error);

    alert(error.response?.data?.error || 'Something went wrong');
    console.log(error.response?.data);
    }
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: BarChart3 },
    { id: 'seo', label: 'SEO', icon: Tag }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
            onClick={()=> router.visit('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-600">Create a new product for your store</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4 mr-2 inline" />
              Preview
            </button>
            <button 
              onClick={() => handleSave('draft')}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Save Draft
            </button>
            <button 
              onClick={() => handleSave('active')}
              className="px-6 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Publish Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#98a69e] text-[#98a69e]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description
                      </label>
                      <textarea
                        rows={4}
                        value={productData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                        placeholder="Detailed product description"
                      />
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={productData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                        placeholder="Brief product summary for listings"
                      />
                    </div>

                    {/* Category & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={productData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          value={productData.tags}
                          onChange={(e) => handleInputChange('tags', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                          placeholder="Enter tags separated by commas"
                        />
                      </div>
                    </div>

                    {/* Product Specifications */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                      </label>
                      <textarea
                        rows={3}
                        value={productData.specifications}
                        onChange={(e) => handleInputChange('specifications', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                        placeholder="Product specifications, ingredients, usage instructions, etc."
                      />
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (KSh) *
                        </label>
                        <input
                          type="number"
                          value={productData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent ${
                            errors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0.00"
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Compare at Price (KSh)
                        </label>
                        <input
                          type="number"
                          value={productData.comparePrice}
                          onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cost per Item (KSh)
                        </label>
                        <input
                          type="number"
                          value={productData.cost}
                          onChange={(e) => handleInputChange('cost', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    {/* Product Variants */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                        <button
                          onClick={addVariant}
                          className="flex items-center space-x-2 px-3 py-2 text-[#98a69e] border border-[#98a69e] rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Variant</span>
                        </button>
                      </div>

                      {variants.map((variant) => (
                        <div key={variant.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Variant Name
                              </label>
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                                placeholder="e.g., 300ml, 500ml"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (KSh)
                              </label>
                              <input
                                type="number"
                                value={variant.price}
                                onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={variant.stock}
                                onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => removeVariant(variant.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                {/* <Trash2 className="w-4 h-4" /> */}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={productData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent ${
                            errors.sku ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., LT-001"
                        />
                        {errors.sku && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.sku}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={productData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productData.trackQuantity}
                          onChange={(e) => handleInputChange('trackQuantity', e.target.checked.toString())}
                          className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                        />
                        <span className="text-sm font-medium text-gray-700">Track quantity</span>
                      </label>
                    </div>

                    {/* Weight and Dimensions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={productData.weight}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length (cm)
                          </label>
                          <input
                            type="number"
                            value={productData.dimensions.length}
                            onChange={(e) => handleDimensionChange('length', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (cm)
                          </label>
                          <input
                            type="number"
                            value={productData.dimensions.width}
                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Height (cm)
                          </label>
                          <input
                            type="number"
                            value={productData.dimensions.height}
                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={productData.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                        placeholder="SEO optimized title"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {productData.seoTitle.length}/60 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Description
                      </label>
                      <textarea
                        rows={3}
                        value={productData.seoDescription}
                        onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                        placeholder="Meta description for search engines"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        {productData.seoDescription.length}/160 characters
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
              
              {errors.images && (
                <p className="mb-4 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.images}
                </p>
              )}

              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#98a69e] transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>

                {/* Image Preview */}
                {images.map((image) => (
                  <div key={image.id} className="relative border border-gray-200 rounded-lg p-2">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {image.isPrimary && (
                        <span className="bg-[#98a69e] text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                      >
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibility
                  </label>
                  <select
                    value={productData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] focus:border-transparent"
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images.find(img => img.isPrimary)?.url || images[0].url}
                    alt="Product preview"
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {productData.name || 'Product Name'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {productData.category || 'Category'}
                  </p>
                  <div className="flex items-center space-x-2">
                    {productData.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        KSh {Number(productData.comparePrice).toLocaleString()}
                      </span>
                    )}
                    <span className="font-semibold text-gray-900">
                      KSh {Number(productData.price || 0).toLocaleString()}
                    </span>
                  </div>
                  {productData.status && (
                    <span className={`inline-flex mt-2 px-2 py-1 text-xs rounded-full font-medium ${
                      productData.status === 'active' ? 'bg-green-100 text-green-800' :
                      productData.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {productData.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LantyAddProductPage;