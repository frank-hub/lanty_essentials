import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import { Search, Clock, Eye, ArrowRight, Tag, ChevronRight } from 'lucide-react';
import Layout from '@/pages/Layout';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  views: number;
  reading_time: number;
  published_at: string | null;
}

interface PaginatedPosts {
  data: Post[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

interface Props {
  posts: PaginatedPosts;
  featured: Post | null;
  categories: string[];
  active_category: string | null;
  search: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const placeholder = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=500&fit=crop';

const CategoryBadge: React.FC<{ label: string; small?: boolean }> = ({ label, small }) => (
  <span className={`inline-block bg-[#98a69e]/10 text-[#5a7a6e] font-semibold uppercase tracking-widest rounded-full
    ${small ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'}`}>
    {label}
  </span>
);

// ─── Blog Index ───────────────────────────────────────────────────────────────

const BlogIndex: React.FC = () => {
  const { posts, featured, categories, active_category, search: initSearch } =
    usePage<{ props: Props }>().props as unknown as Props;

  const [searchVal, setSearchVal] = useState(initSearch ?? '');

  const applyFilter = (cat?: string | null, q?: string) => {
    const params: Record<string, string> = {};
    if (cat)               params.category = cat;
    if (q && q.trim())     params.search   = q.trim();
    router.get('/front/blog', params, { preserveScroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilter(active_category, searchVal);
  };

  return (
    <Layout title="Blog Posts">

      {/* ── Filters & Search ── */}
      <section className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => applyFilter(null, searchVal)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !active_category
                  ? 'bg-[#98a69e] text-white'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {(categories ?? []).map((cat) => (
              <button
                key={cat}
                onClick={() => applyFilter(cat, searchVal)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active_category === cat
                    ? 'bg-[#98a69e] text-white'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search articles…"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#98a69e]/40 w-52"
            />
          </form>
        </div>
      </section>

      {/* ── Posts grid ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              {active_category ? active_category : initSearch ? `Results for "${initSearch}"` : 'Latest Articles'}
            </h2>
            <span className="text-sm text-gray-400">
              {posts.data.length} post{posts.data.length !== 1 ? 's' : ''}
            </span>
          </div>

          {posts.data.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">No posts found.</p>
              <button
                onClick={() => router.visit('/front/blog')}
                className="mt-4 text-[#98a69e] font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {posts.last_page > 1 && (
            <div className="mt-16 flex items-center justify-center gap-3">
              {posts.prev_page_url && (
                <button
                  onClick={() => router.get(posts.prev_page_url!)}
                  className="px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#98a69e] hover:text-[#98a69e] transition-colors"
                >
                  ← Previous
                </button>
              )}
              <span className="text-sm text-gray-400">
                Page {posts.current_page} of {posts.last_page}
              </span>
              {posts.next_page_url && (
                <button
                  onClick={() => router.get(posts.next_page_url!)}
                  className="px-5 py-2 border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#98a69e] hover:text-[#98a69e] transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </section>


      {/* ── Hero / Featured ── */}
      {featured && !active_category && !initSearch && (
        <section className="bg-[#F9F6F1] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center cursor-pointer group"
              onClick={() => router.visit(`/front/blog/${featured.slug}`)}
            >
              {/* Image */}
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={featured.cover_image ?? placeholder}
                  alt={featured.title}
                  className="w-full h-72 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text */}
              <div>
                {featured.category && (
                  <CategoryBadge label={featured.category} />
                )}
                <h1 className="mt-4 text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-[#5a7a6e] transition-colors">
                  {featured.title}
                </h1>
                {featured.excerpt && (
                  <p className="mt-4 text-gray-600 text-lg leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                )}
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-400">
                  <span>{featured.published_at}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featured.reading_time} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {featured.views.toLocaleString()}
                  </span>
                </div>
                <button
                  className="mt-8 inline-flex items-center gap-2 bg-[#98a69e] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#7a8f87] transition-colors"
                  onClick={(e) => { e.stopPropagation(); router.visit(`/front/blog/${featured.slug}`); }}
                >
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

// ─── Post card ────────────────────────────────────────────────────────────────

const PostCard: React.FC<{ post: Post }> = ({ post }) => (
  <article
    className="group cursor-pointer flex flex-col"
    onClick={() => router.visit(`/front/blog/${post.slug}`)}
  >
    {/* Image */}
    <div className="overflow-hidden rounded-xl mb-5">
      <img
        src={post.cover_image ?? placeholder}
        alt={post.title}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    {/* Meta */}
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      {post.category && <CategoryBadge label={post.category} small />}
      <span className="text-xs text-gray-400">{post.published_at}</span>
    </div>

    {/* Title */}
    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#5a7a6e] transition-colors line-clamp-2">
      {post.title}
    </h3>

    {/* Excerpt */}
    {post.excerpt && (
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
        {post.excerpt}
      </p>
    )}

    {/* Footer */}
    <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
      <span className="flex items-center gap-1">
        <Clock className="w-3 h-3" /> {post.reading_time} min
      </span>
      <span className="flex items-center gap-1">
        <Eye className="w-3 h-3" /> {post.views.toLocaleString()}
      </span>
      <span className="text-[#98a69e] font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
        Read <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </article>
);

export default BlogIndex;
