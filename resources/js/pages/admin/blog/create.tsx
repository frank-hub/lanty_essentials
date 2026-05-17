import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
  ArrowLeft, Save, Eye, AlertCircle, CheckCircle,
  Image as ImageIcon, X, Tag, BookOpen, FileText,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  status: 'draft' | 'published';
  seoTitle: string;
  seoDescription: string;
  coverImage: string | null;   // base64 (new upload) or existing URL
  removeCover: boolean;
}

const CATEGORIES = [
  'Laundry Tips',
  'Product Guides',
  'Sustainability',
  'Home Care',
  'News & Updates',
];

const TABS = [
  { id: 'content', label: 'Content',  icon: FileText },
  { id: 'seo',     label: 'SEO',      icon: Tag      },
];

// ─── Shared form ──────────────────────────────────────────────────────────────

interface BlogFormProps {
  initial: BlogFormData;
  onSave: (data: BlogFormData, status: 'draft' | 'published') => Promise<void>;
  saving: boolean;
  successMsg: string;
  pageTitle: string;
  pageSubtitle: string;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initial, onSave, saving, successMsg, pageTitle, pageSubtitle,
}) => {
  const [data, setData]         = useState<BlogFormData>(initial);
  const [activeTab, setActiveTab] = useState('content');
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const set = (field: keyof BlogFormData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('coverImage', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeCover = () => {
    set('coverImage', null);
    set('removeCover', true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.title.trim())   e.title   = 'Title is required';
    if (!data.content.trim()) e.content = 'Content is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!validate()) return;
    await onSave({ ...data, status }, status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.visit('/blog')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500">{pageSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {successMsg && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" /> {successMsg}
              </span>
            )}
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving…' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Main ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => set('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] text-lg ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write a compelling title…"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.title}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {TABS.map((tab) => (
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
                {/* Content tab */}
                {activeTab === 'content' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        value={data.excerpt}
                        onChange={(e) => set('excerpt', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] resize-none"
                        placeholder="Short summary shown in listings…"
                        maxLength={500}
                      />
                      <p className="mt-1 text-xs text-gray-400">{data.excerpt.length}/500</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content *
                      </label>
                      <textarea
                        rows={18}
                        value={data.content}
                        onChange={(e) => set('content', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e] font-mono text-sm resize-y ${
                          errors.content ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Write your post content here… (HTML is supported)"
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {errors.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={data.seoTitle}
                        onChange={(e) => set('seoTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                        placeholder="SEO optimized title"
                        maxLength={60}
                      />
                      <p className="mt-1 text-xs text-gray-400">{data.seoTitle.length}/60</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO Description
                      </label>
                      <textarea
                        rows={3}
                        value={data.seoDescription}
                        onChange={(e) => set('seoDescription', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                        placeholder="Meta description for search engines"
                        maxLength={160}
                      />
                      <p className="mt-1 text-xs text-gray-400">{data.seoDescription.length}/160</p>
                    </div>

                    {/* Google preview */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Google Preview</p>
                      <p className="text-blue-700 text-base font-medium leading-snug">
                        {data.seoTitle || data.title || 'Post Title'}
                      </p>
                      <p className="text-green-700 text-xs mt-0.5">
                        lantyessentials.co.ke/blog/…
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {data.seoDescription || data.excerpt || 'Post description will appear here.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Cover image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Cover Image</h3>

              {data.coverImage ? (
                <div className="relative">
                  <img
                    src={data.coverImage}
                    alt="cover"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeCover}
                    className="absolute top-2 right-2 bg-white bg-opacity-80 p-1 rounded-full hover:bg-opacity-100"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#98a69e] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
              )}
            </div>

            {/* Publish settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Settings</h3>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Status</label>
                <select
                  value={data.status}
                  onChange={(e) => set('status', e.target.value as 'draft' | 'published')}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Category</label>
                <select
                  value={data.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Tags</label>
                <input
                  type="text"
                  value={data.tags}
                  onChange={(e) => set('tags', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                  placeholder="laundry, tips, eco (comma separated)"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Author</label>
                <input
                  type="text"
                  value={data.author}
                  onChange={(e) => set('author', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                  placeholder="Lanty Essentials"
                />
              </div>
            </div>

            {/* Preview card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {data.coverImage ? (
                  <img src={data.coverImage} alt="preview" className="w-full h-28 object-cover" />
                ) : (
                  <div className="w-full h-28 bg-gray-100 flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-gray-300" />
                  </div>
                )}
                <div className="p-3">
                  {data.category && (
                    <span className="text-xs text-[#98a69e] font-medium">{data.category}</span>
                  )}
                  <p className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                    {data.title || 'Post title'}
                  </p>
                  {data.excerpt && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.excerpt}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">by {data.author || 'Lanty Essentials'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Create page ──────────────────────────────────────────────────────────────

const BlogCreate: React.FC = () => {
  const [saving, setSaving]       = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const initial: BlogFormData = {
    title: '', excerpt: '', content: '', category: '',
    tags: '', author: 'Lanty Essentials', status: 'draft',
    seoTitle: '', seoDescription: '', coverImage: null, removeCover: false,
  };

  const handleSave = async (data: BlogFormData, status: 'draft' | 'published') => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await axios.post('/blog', {
        title: data.title, excerpt: data.excerpt, content: data.content,
        category: data.category, tags: data.tags, author: data.author,
        status, seo_title: data.seoTitle, seo_description: data.seoDescription,
        cover_image: data.coverImage,
      });
      setSuccessMsg('Post created!');
      setTimeout(() => router.visit('/blog'), 1200);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlogForm
      initial={initial}
      onSave={handleSave}
      saving={saving}
      successMsg={successMsg}
      pageTitle="New Blog Post"
      pageSubtitle="Create and publish a new article"
    />
  );
};

export default BlogCreate;
