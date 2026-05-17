import React from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  ArrowLeft, Clock, Eye, Tag, ChevronRight,
  Facebook, Twitter, Link2, Share2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  views: number;
  reading_time: number;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
  reading_time: number;
}

interface Props {
  post: Post;
  related: RelatedPost[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const placeholder = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=1200&h=600&fit=crop';

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href).catch(() => {});
};

// ─── Single Post ──────────────────────────────────────────────────────────────

const BlogShow: React.FC = () => {
  const { post, related } = usePage<{ props: Props }>().props as unknown as Props;

  const shareUrl   = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero image ── */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden bg-gray-100">
        <img
          src={post.cover_image ?? placeholder}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.visit('/public/blog')}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors bg-black/20 hover:bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" /> All Posts
        </button>

        {/* Category on image */}
        {post.category && (
          <div className="absolute bottom-6 left-6">
            <span className="bg-[#98a69e] text-white text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {post.category}
            </span>
          </div>
        )}
      </div>

      {/* ── Article body ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-8">
          <span className="font-medium text-gray-600">By {post.author}</span>
          {post.published_at && <span>{post.published_at}</span>}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {post.reading_time} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {post.views.toLocaleString()} views
          </span>
        </div>

        {/* Excerpt / Lead */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 leading-relaxed font-light mb-8 border-l-4 border-[#98a69e] pl-5">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-[#5a7a6e] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-[#98a69e] prose-blockquote:bg-[#F9F6F1] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-code:text-[#5a7a6e] prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded
            prose-strong:text-gray-900
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => router.get('/blog', { search: tag })}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-[#98a69e]/10 hover:text-[#5a7a6e] transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
            <Share2 className="w-4 h-4" /> Share:
          </span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-sky-100 hover:text-sky-500 transition-colors"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <button
            onClick={copyLink}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-600 transition-colors"
            title="Copy link"
          >
            <Link2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Author card ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-[#F9F6F1] rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#98a69e] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-bold text-gray-900">{post.author}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Content team at Lanty Essentials — sharing tips on laundry, home care, and sustainable living.
            </p>
          </div>
        </div>
      </div>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="bg-[#F9F6F1] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-gray-900">You might also like</h2>
              <button
                onClick={() => router.visit('/blog')}
                className="text-sm text-[#98a69e] flex items-center gap-1 hover:underline"
              >
                All posts <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <article
                  key={r.id}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => router.visit(`/blog/${r.slug}`)}
                >
                  <div className="overflow-hidden">
                    <img
                      src={r.cover_image ?? placeholder}
                      alt={r.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    {r.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5a7a6e]">
                        {r.category}
                      </span>
                    )}
                    <h3 className="mt-1 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#5a7a6e] transition-colors leading-snug">
                      {r.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      {r.published_at && <span>{r.published_at}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.reading_time} min
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default BlogShow;
