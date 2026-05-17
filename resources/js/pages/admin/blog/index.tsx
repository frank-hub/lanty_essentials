import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
  Plus, Search, Trash2, Edit2, Eye, Filter,
  BookOpen, TrendingUp, FileText, CheckCircle,
  Clock, MoreVertical, AlertCircle,
  ArrowLeft,
} from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string | null;
  author: string;
  status: 'draft' | 'published';
  views: number;
  reading_time: number;
  published_at: string | null;
  created_at: string;
}

const BlogIndex: React.FC = () => {
  const { blogs } = usePage<{ blogs: Blog[] }>().props;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalViews     = blogs.reduce((s, b) => s + b.views, 0);
  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount     = blogs.filter((b) => b.status === 'draft').length;

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = blogs.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.category ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleSelect = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((b) => b.id));

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/blog/${id}`);
      router.reload({ only: ['blogs'] });
    } catch {
      alert('Failed to delete post');
    }
    setConfirmDelete(null);
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post('/blog/bulk-destroy', { ids: selected });
      setSelected([]);
      router.reload({ only: ['blogs'] });
    } catch {
      alert('Bulk delete failed');
    }
    setBulkConfirm(false);
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
                onClick={() => router.visit('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your content &amp; articles</p>
          </div>
          <button
            onClick={() => router.visit('/blog/create')}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#98a69e] text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Posts',  value: blogs.length,     icon: BookOpen,   color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Published',    value: publishedCount,   icon: CheckCircle,color: 'text-green-600',  bg: 'bg-green-50'  },
            { label: 'Drafts',       value: draftCount,       icon: FileText,   color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Total Views',  value: totalViews.toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div className={`${bg} p-2 rounded-lg`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#98a69e]"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {(['all', 'published', 'draft'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors capitalize ${
                      statusFilter === s
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk delete */}
            {selected.length > 0 && (
              <button
                onClick={() => setBulkConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete {selected.length} selected</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Post</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Views</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No posts found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.includes(blog.id)}
                        onChange={() => toggleSelect(blog.id)}
                        className="rounded border-gray-300 text-[#98a69e] focus:ring-[#98a69e]"
                      />
                    </td>

                    {/* Post info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {blog.cover_image ? (
                          <img
                            src={blog.cover_image}
                            alt={blog.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            by {blog.author} · {blog.reading_time} min read
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      {blog.category ? (
                        <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {blog.category}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full font-medium ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {blog.status === 'published'
                          ? <CheckCircle className="w-3 h-3" />
                          : <Clock className="w-3 h-3" />
                        }
                        {blog.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-500">
                      {blog.views.toLocaleString()}
                    </td>

                    <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-400">
                      {blog.published_at ?? blog.created_at}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => router.visit(`/blog/${blog.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-[#98a69e] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(blog.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Delete Post</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirm modal */}
      {bulkConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Delete {selected.length} Posts</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              All selected posts will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setBulkConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogIndex;
