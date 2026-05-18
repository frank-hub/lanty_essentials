<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class BlogController extends Controller
{

 // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC: Blog listing page  →  /blog
    // ─────────────────────────────────────────────────────────────────────────

    public function publicIndex(Request $request)
    {
        $category = $request->query('category');
        $search   = $request->query('search');

        $query = Blog::published()->orderByDesc('published_at');

        if ($category) {
            $query->where('category', $category);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title',   'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('tags',    'like', "%{$search}%");
            });
        }

        $posts = $query->paginate(9)->through(fn($b) => $this->formatPublic($b));

        // Featured post = latest published
        $featured = Blog::published()
            ->orderByDesc('published_at')
            ->first();

        // All categories for filter tabs
        $categories = Blog::published()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category');

        return Inertia::render('admin/blog/posts', [
            'posts'            => $posts,
            'featured'         => $featured ? $this->formatPublic($featured) : null,
            'categories'       => $categories,
            'active_category'  => $category,
            'search'           => $search,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC: Single post  →  /blog/{slug}
    // ─────────────────────────────────────────────────────────────────────────

    public function Publicshow(string $slug)
    {
        $blog = Blog::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        // Increment views
        $blog->increment('views');

        // Related posts (same category, excluding current)
        $related = Blog::published()
            ->where('id', '!=', $blog->id)
            ->where('category', $blog->category)
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(fn($b) => $this->formatPublic($b));

        // If not enough related, pad with latest
        if ($related->count() < 3) {
            $ids    = $related->pluck('id')->push($blog->id);
            $extras = Blog::published()
                ->whereNotIn('id', $ids)
                ->orderByDesc('published_at')
                ->limit(3 - $related->count())
                ->get()
                ->map(fn($b) => $this->formatPublic($b));
            $related = $related->concat($extras);
        }

        return Inertia::render('admin/blog/show', [
            'post'    => $this->formatPublic($blog, true),
            'related' => $related,
        ]);
    }

    // ── Admin: list all posts ─────────────────────────────────────────────────

    public function index()
    {
        $blogs = Blog::orderBy('created_at', 'desc')
            ->get()
            ->map(fn($b) => [
                'id'           => $b->id,
                'title'        => $b->title,
                'slug'         => $b->slug,
                'excerpt'      => $b->excerpt,
                'cover_image'  => $b->cover_image_url,
                'category'     => $b->category,
                'tags'         => $b->tags,
                'author'       => $b->author,
                'status'       => $b->status,
                'views'        => $b->views,
                'reading_time' => $b->reading_time,
                'published_at' => $b->published_at?->toDateString(),
                'created_at'   => $b->created_at->toDateString(),
            ]);

        return Inertia::render('admin/blog/index', [
            'blogs' => $blogs,
        ]);
    }

    // ── Admin: show create form ───────────────────────────────────────────────

    public function create()
    {
        return Inertia::render('admin/blog/create');
    }

    // ── Admin: store new post ─────────────────────────────────────────────────

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'excerpt'         => 'nullable|string|max:500',
            'content'         => 'required|string',
            'category'        => 'nullable|string|max:100',
            'tags'            => 'nullable|string',
            'author'          => 'nullable|string|max:100',
            'status'          => 'required|in:draft,published',
            'seo_title'       => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'cover_image'     => 'nullable|string',   // base64 or path
        ]);

        try {
            DB::beginTransaction();

            $coverPath = $this->handleCoverImage($validated['cover_image'] ?? null);

            $blog = Blog::create([
                'title'           => $validated['title'],
                'slug'            => $this->uniqueSlug($validated['title']),
                'excerpt'         => $validated['excerpt'] ?? null,
                'content'         => $validated['content'],
                'cover_image'     => $coverPath,
                'category'        => $validated['category'] ?? null,
                'tags'            => $validated['tags'] ?? null,
                'author'          => $validated['author'] ?? 'Lanty Essentials',
                'status'          => $validated['status'],
                'seo_title'       => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'published_at'    => $validated['status'] === 'published' ? Carbon::now() : null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Blog post created successfully',
                'blog'    => $blog,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to create blog post',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ── Admin: show edit form ─────────────────────────────────────────────────

    public function edit(Blog $blog)
    {
        return Inertia::render('admin/blog/edit', [
            'blog' => [
                'id'              => $blog->id,
                'title'           => $blog->title,
                'slug'            => $blog->slug,
                'excerpt'         => $blog->excerpt,
                'content'         => $blog->content,
                'cover_image'     => $blog->cover_image_url,
                'category'        => $blog->category,
                'tags'            => $blog->tags,
                'author'          => $blog->author,
                'status'          => $blog->status,
                'seo_title'       => $blog->seo_title,
                'seo_description' => $blog->seo_description,
                'published_at'    => $blog->published_at?->toDateString(),
            ],
        ]);
    }

    // ── Admin: update post ────────────────────────────────────────────────────

    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'excerpt'         => 'nullable|string|max:500',
            'content'         => 'required|string',
            'category'        => 'nullable|string|max:100',
            'tags'            => 'nullable|string',
            'author'          => 'nullable|string|max:100',
            'status'          => 'required|in:draft,published',
            'seo_title'       => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'cover_image'     => 'nullable|string',
            'remove_cover'    => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // Handle cover image update
            $coverPath = $blog->cover_image; // keep existing by default

            if (! empty($validated['remove_cover'])) {
                $this->deleteCoverFile($blog->cover_image);
                $coverPath = null;
            } elseif (
                ! empty($validated['cover_image']) &&
                str_starts_with($validated['cover_image'], 'data:image')
            ) {
                $this->deleteCoverFile($blog->cover_image);
                $coverPath = $this->handleCoverImage($validated['cover_image']);
            }

            $wasPublished = $blog->status === 'published';
            $nowPublished = $validated['status'] === 'published';

            $blog->update([
                'title'           => $validated['title'],
                'slug'            => $this->uniqueSlug($validated['title'], $blog->id),
                'excerpt'         => $validated['excerpt'] ?? null,
                'content'         => $validated['content'],
                'cover_image'     => $coverPath,
                'category'        => $validated['category'] ?? null,
                'tags'            => $validated['tags'] ?? null,
                'author'          => $validated['author'] ?? 'Lanty Essentials',
                'status'          => $validated['status'],
                'seo_title'       => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'published_at'    => (! $wasPublished && $nowPublished)
                    ? Carbon::now()
                    : $blog->published_at,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Blog post updated successfully',
                'blog'    => $blog->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update blog post',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ── Admin: delete post ────────────────────────────────────────────────────

    public function destroy(Blog $blog)
    {
        try {
            $this->deleteCoverFile($blog->cover_image);
            $blog->delete();

            return redirect()->back()->with('success', 'Blog post deleted successfully');

        } catch (\Exception $e) {
            Log::error('Blog deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete blog post',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ── Admin: bulk delete ────────────────────────────────────────────────────

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:blogs,id',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['ids'] as $id) {
                $blog = Blog::find($id);
                if ($blog) {
                    $this->deleteCoverFile($blog->cover_image);
                    $blog->delete();
                }
            }

            DB::commit();

            return response()->json([
                'message' => count($validated['ids']) . ' posts deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog bulk deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete posts',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ── Public: post detail (increments views) ────────────────────────────────

    public function show(string $slug)
    {
        $blog = Blog::where('slug', $slug)->where('status', 'published')->firstOrFail();
        $blog->increment('views');

        $related = Blog::published()
            ->where('id', '!=', $blog->id)
            ->where('category', $blog->category)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('blog/show', [
            'blog'    => $blog,
            'related' => $related,
        ]);
    }

    // ── Private helpers ───────────────────────────────────────────────────────


    private function formatPublic(Blog $b, bool $includeContent = false): array
    {
        $data = [
            'id'           => $b->id,
            'title'        => $b->title,
            'slug'         => $b->slug,
            'excerpt'      => $b->excerpt,
            'cover_image'  => $b->cover_image_url,
            'category'     => $b->category,
            'tags'         => $b->tags
                ? array_map('trim', explode(',', $b->tags))
                : [],
            'author'       => $b->author,
            'views'        => $b->views,
            'reading_time' => $b->reading_time,
            'published_at' => $b->published_at
                ? Carbon::parse($b->published_at)->format('M d, Y')
                : null,
            'published_at_raw' => $b->published_at?->toDateString(),
        ];

        if ($includeContent) {
            $data['content']         = $b->content;
            $data['seo_title']       = $b->seo_title;
            $data['seo_description'] = $b->seo_description;
        }

        return $data;
    }


    private function handleCoverImage(?string $data): ?string
    {
        if (! $data || ! str_starts_with($data, 'data:image')) return $data;

        @list($type, $fileData) = explode(';', $data);
        @list(, $fileData)      = explode(',', $fileData);
        $fileData = base64_decode($fileData);

        @list(, $extension) = explode('/', $type);
        $extension = $extension ?: 'jpg';

        $fileName = 'blog_' . time() . '_' . Str::random(8) . '.' . $extension;
        $filePath = 'uploads/blogs/' . $fileName;

        $dir = $this->uploadsPath('uploads/blogs');
        if (! is_dir($dir)) mkdir($dir, 0755, true);

        file_put_contents($this->uploadsPath($filePath), $fileData);

        return $filePath;
    }

    private function uploadsPath(string $relative): string
    {
        // __DIR__ = app/Http/Controllers
        // go up 3 levels to reach the web root
        return dirname(__DIR__, 3) . '/' . $relative;
    }

    private function deleteCoverFile(?string $path): void
    {
        if (! $path) return;
        $full = $this->uploadsPath($path);
        if (file_exists($full)) unlink($full);
    }

    private function uniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug  = Str::slug($title);
        $query = Blog::where('slug', $slug);
        if ($excludeId) $query->where('id', '!=', $excludeId);

        if (! $query->exists()) return $slug;

        $i = 2;
        while (Blog::where('slug', $slug . '-' . $i)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()) {
            $i++;
        }
        return $slug . '-' . $i;
    }
}
