import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { BlogForm } from './create';   // re-use the shared form

interface BlogProp {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  tags: string | null;
  author: string;
  status: 'draft' | 'published';
  seo_title: string | null;
  seo_description: string | null;
}

const BlogEdit: React.FC = () => {
  const { blog } = usePage<{ blog: BlogProp }>().props;

  const [saving, setSaving]         = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const initial = {
    title:          blog.title,
    excerpt:        blog.excerpt        ?? '',
    content:        blog.content,
    category:       blog.category       ?? '',
    tags:           blog.tags           ?? '',
    author:         blog.author,
    status:         blog.status,
    seoTitle:       blog.seo_title      ?? '',
    seoDescription: blog.seo_description ?? '',
    coverImage:     blog.cover_image,   // existing URL — displayed as-is
    removeCover:    false,
  };

  const handleSave = async (data: typeof initial, status: 'draft' | 'published') => {
    setSaving(true);
    setSuccessMsg('');
    try {
      await axios.put(`/admin/blog/${blog.id}`, {
        title:           data.title,
        excerpt:         data.excerpt,
        content:         data.content,
        category:        data.category,
        tags:            data.tags,
        author:          data.author,
        status,
        seo_title:       data.seoTitle,
        seo_description: data.seoDescription,
        // Only send cover_image if it's a new base64 upload
        cover_image: data.coverImage?.startsWith('data:image') ? data.coverImage : undefined,
        remove_cover: data.removeCover,
      });
      setSuccessMsg('Post updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
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
      pageTitle="Edit Post"
      pageSubtitle={`#${blog.id} · ${blog.title}`}
    />
  );
};

export default BlogEdit;
