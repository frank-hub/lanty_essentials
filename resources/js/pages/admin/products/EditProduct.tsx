import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
  ArrowLeft,
  X,
  Plus,
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
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

interface ProductImage {
  id: string;          // local temp id OR db id as string
  dbId?: number;       // real DB id for existing images
  url: string;         // base64 (new) or path (existing)
  alt: string;
  isPrimary: boolean;
  isNew?: boolean;     // true = freshly uploaded, not yet in DB
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  short_description: string | null;
  sku: string;
  price: number;
  compare_price: number | null;
  cost: number | null;
  category: string | null;
  tags: string | null;
  stock: number;
  track_quantity: boolean;
  status: string;
  visibility: string;
  seo_title: string | null;
  seo_description: string | null;
  specifications: string | null;
  images: {
    id: number;
    image_path: string;
    is_primary: boolean;
    sort_order: number;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toImageUrl = (path: string) => {
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  return `/${path}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const EditProductPage: React.FC = () => {
  const { product } = usePage<{ product: Product }>().props;

  // Map existing DB images into our local shape
  const initialImages: ProductImage[] = product.images.map((img) => ({
    id: String(img.id),
    dbId: img.id,
    url: toImageUrl(img.image_path),
    alt: product.name,
    isPrimary: img.is_primary,
    isNew: false,
  }));

  const [productData, setProductData] = useState({
    name: product.name ?? '',
    description: product.description ?? '',
    shortDescription: product.short_description ?? '',
    sku: product.sku ?? '',
    price: String(product.price ?? ''),
    comparePrice: String(product.compare_price ?? ''),
    cost: String(product.cost ?? ''),
    category: product.category ?? '',
    tags: product.tags ?? '',
    stock: String(product.stock ?? ''),
    trackQuantity: product.track_quantity ?? true,
    status: product.status ?? 'draft',
    visibility: product.visibility ?? 'visible',
    seoTitle: product.seo_title ?? '',
    seoDescription: product.seo_description ?? '',
    specifications: product.specifications ?? '',
  });

  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = [
    'Laundry Products',
    'Washing Machines',
    'Glass Jars',
    'Lanty Home',
  ];

  // ── Field helpers ──────────────────────────────────────────────────────────

  const handleInputChange = (field: string, value: string) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Image helpers ──────────────────────────────────────────────────────────

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ProductImage = {
          id: Date.now().toString() + index,
          url: e.target?.result as string,
          alt: file.name,
          isPrimary: images.length === 0 && index === 0,
          isNew: true,
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (img: ProductImage) => {
    if (img.dbId) {
      setDeletedImageIds((prev) => [...prev, img.dbId!]);
    }
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  const setPrimaryImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.id === id }))
    );
  };

  // ── Variant helpers ────────────────────────────────────────────────────────

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: Date.now().toString(), name: '', price: 0, stock: 0, sku: '' },
    ]);
  };

  const removeVariant = (id: string) =>
    setVariants(variants.filter((v) => v.id !== id));

  const updateVariant = (id: string, field: string, value: string | number) =>
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));

  // ── Validation ─────────────────────────────────────────────────────────────

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!productData.name.trim()) newErrors.name = 'Product name is required';
    if (!productData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!productData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(productData.price)) || Number(productData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    if (!productData.category) newErrors.category = 'Category is required';
    if (images.length === 0) newErrors.images = 'At least one product image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleUpdate = async (status: 'draft' | 'active') => {
    const updatedData = { ...productData, status };
    setProductData(updatedData);
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMsg('');

    try {
      // Build images payload:
      // - existing images: send { id: dbId, is_primary, url: path }
      // - new images: send { url: base64, is_primary }
      const imagesPayload = images.map((img, index) => {
        if (!img.isNew && img.dbId) {
          return { id: img.dbId, url: img.url, is_primary: img.isPrimary };
        }
        return { url: img.url, is_primary: img.isPrimary };
      });

      await axios.put(`/products/${product.id}`, {
        ...updatedData,
        short_description: updatedData.shortDescription,
        compare_price: updatedData.comparePrice || null,
        track_quantity: updatedData.trackQuantity,
        seo_title: updatedData.seoTitle,
        seo_description: updatedData.seoDescription,
        images: imagesPayload,
        deleted_images: deletedImageIds,
        variants,
      });

      setSuccessMsg('Product updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Something went wrong';
      alert(msg);
      console.error(error.response?.data);
    } finally {
      setSaving(false);
    }
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: BarChart3 },
    { id: 'seo', label: 'SEO', icon: Tag },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.visit('/products')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500">
                #{product.id} · {product.sku}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {successMsg && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                {successMsg}
              </span>
            )}
            <button
              onClick={() => handleUpdate('draft')}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleUpdate('active')}
              disabled={saving}
              className="px-6 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving…' : 'Update Product'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Nav */}
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

              <div className="p-6">
                {/* ── Basic Info ── */}
                {activeTab === 'basic' && (
                  <div className="space-y-6">
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
                          <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description
                      </label>
                      <textarea
                        rows={4}
                        value={productData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                        placeholder="Detailed product description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={productData.shortDescription}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                        placeholder="Brief product summary for listings"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={productData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select category</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <input
                          type="text"
                          value={productData.tags}
                          onChange={(e) => handleInputChange('tags', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                          placeholder="Enter tags separated by commas"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                      </label>
                      <textarea
                        rows={3}
                        value={productData.specifications}
                        onChange={(e) => handleInputChange('specifications', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                        placeholder="Ingredients, usage instructions, etc."
                      />
                    </div>
                  </div>
                )}

                {/* ── Pricing ── */}
                {activeTab === 'pricing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Price (KSh) *', field: 'price', err: errors.price },
                        { label: 'Compare at Price (KSh)', field: 'comparePrice', err: '' },
                        { label: 'Cost per Item (KSh)', field: 'cost', err: '' },
                      ].map(({ label, field, err }) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                          <input
                            type="number"
                            value={(productData as any)[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] ${
                              err ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          {err && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" /> {err}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Variants */}
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
                            {(['name', 'price', 'stock', 'sku'] as const).map((f) => (
                              <div key={f}>
                                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                  {f === 'sku' ? 'SKU' : f.charAt(0).toUpperCase() + f.slice(1)}
                                </label>
                                <input
                                  type={f === 'price' || f === 'stock' ? 'number' : 'text'}
                                  value={variant[f]}
                                  onChange={(e) =>
                                    updateVariant(
                                      variant.id,
                                      f,
                                      f === 'price' || f === 'stock'
                                        ? Number(e.target.value)
                                        : e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                                  placeholder={f === 'name' ? 'e.g., 300ml' : ''}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => removeVariant(variant.id)}
                              className="flex items-center text-sm text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {variants.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-200 rounded-lg">
                          No variants added yet
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Inventory ── */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                        <input
                          type="text"
                          value={productData.sku}
                          onChange={(e) => handleInputChange('sku', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] ${
                            errors.sku ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., LT-001"
                        />
                        {errors.sku && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> {errors.sku}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={productData.trackQuantity}
                        onChange={(e) =>
                          handleInputChange('trackQuantity', e.target.checked.toString())
                        }
                        className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                      />
                      <span className="text-sm font-medium text-gray-700">Track quantity</span>
                    </label>
                  </div>
                )}

                {/* ── SEO ── */}
                {activeTab === 'seo' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                      <input
                        type="text"
                        value={productData.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
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

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>

              {errors.images && (
                <p className="mb-4 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.images}
                </p>
              )}

              <div className="space-y-4">
                {/* Upload */}
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
                    <p className="text-sm text-gray-600">Click to upload new images</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>

                {/* Image grid */}
                {images.map((image) => (
                  <div key={image.id} className="relative border border-gray-200 rounded-lg p-2">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded"
                    />
                    {/* New badge */}
                    {image.isNew && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                        New
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {image.isPrimary && (
                        <span className="bg-[#98a69e] text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      <button
                        onClick={() => setPrimaryImage(image.id)}
                        title="Set as primary"
                        className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                      >
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeImage(image)}
                        title="Remove image"
                        className="bg-white bg-opacity-80 p-1 rounded hover:bg-opacity-100"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-4">No images yet</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Status</h3>
              <select
                value={productData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images.find((img) => img.isPrimary)?.url || images[0].url}
                    alt="preview"
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
                  <span
                    className={`inline-flex mt-2 px-2 py-1 text-xs rounded-full font-medium ${
                      productData.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : productData.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {productData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
