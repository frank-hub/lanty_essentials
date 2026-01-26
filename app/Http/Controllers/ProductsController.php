<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Products;
use App\Models\ProductImage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductsController extends Controller
{

    public function index(){
        // To Do
        // include : sales: 234
        // include : status: active/draft
        // include : image link

        return Inertia::render('admin/products', [
                'products' => Products::with('images')->orderBy('created_at', 'desc')->get(),
            ]);
    }



    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'category' => 'required',
            'tags' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'track_quantity' => 'boolean',
            'status' => 'required|in:draft,active,inactive',
            'visibility' => 'required|in:visible,hidden',
            'seo_title' => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'specifications' => 'nullable|string',
            'images' => 'required|array|min:1',
            'images.*.url' => 'required|string',
            'images.*.is_primary' => 'boolean',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string',
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.sku' => 'nullable|string',
        ]);


        try {
            DB::beginTransaction();

            $product = Products::create([
                'name' => $validated['name'],
                'thumbnail' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'sku' => $validated['sku'],
                'price' => $validated['price'],
                'images' => '20',
                'compare_price' => $validated['compare_price'] ?? null,
                'cost' => $validated['cost'] ?? null,
                'category' => $validated['category'] ?? null,
                'tags' => $validated['tags'] ?? null,
                'stock' => $validated['stock'] ?? 0,
                'track_quantity' => $validated['track_quantity'] ?? true,
                'status' => $validated['status'],
                'visibility' => $validated['visibility'],
                'seo_title' => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'specifications' => $validated['specifications'] ?? null,
            ]);


            foreach ($validated['images'] as $index => $imageData) {

                $imagePath = $imageData['url'];

                // Check if it's base64
                if (strpos($imageData['url'], 'data:image') === 0) {
                    // Remove "data:image/...;base64," part
                    @list($type, $fileData) = explode(';', $imageData['url']);
                    @list(, $fileData) = explode(',', $fileData);

                    $fileData = base64_decode($fileData);

                    // Get extension
                    @list(, $extension) = explode('/', $type);
                    $extension = $extension ?: 'png';

                    // Generate unique file name
                    $fileName = 'product_' . $product->id . '_' . time() . '_' . $index . '.' . $extension;

                    // Save to public storage
                    $filePath = 'uploads/products/' . $fileName;
                    file_put_contents(public_path($filePath), $fileData);

                    $imagePath = $filePath;
                }

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'is_primary' => $imageData['is_primary'] ?? ($index === 0),
                    'sort_order' => $index,
                ]);
            }



            DB::commit();

            return response()->json([
                'message' => 'Product created successfully',
                'product' => $product->load(['images']),
            ], 201);

        } catch (\Exception $e) {
            Log::error('Product creation failed: '.$e->getMessage());
            return response()->json([
                'message' => 'Failed to create product',
                'error' => $e->getMessage(),
            ], 500);
        }

    }


    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'required|string|unique:products,sku,' . $id,
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost' => 'nullable|numeric|min:0',
            'category' => 'required',
            'tags' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'track_quantity' => 'boolean',
            'status' => 'required|in:draft,active,inactive',
            'visibility' => 'required|in:visible,hidden',
            'seo_title' => 'nullable|string|max:60',
            'seo_description' => 'nullable|string|max:160',
            'specifications' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*.url' => 'required_with:images|string',
            'images.*.is_primary' => 'boolean',
            'images.*.id' => 'nullable|integer',
            'deleted_images' => 'nullable|array',
            'deleted_images.*' => 'integer',
        ]);

        try {
            DB::beginTransaction();

            // Update product details
            $product->update([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'sku' => $validated['sku'],
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'cost' => $validated['cost'] ?? null,
                'category' => $validated['category'] ?? null,
                'tags' => $validated['tags'] ?? null,
                'stock' => $validated['stock'] ?? 0,
                'track_quantity' => $validated['track_quantity'] ?? true,
                'status' => $validated['status'],
                'visibility' => $validated['visibility'],
                'seo_title' => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'specifications' => $validated['specifications'] ?? null,
            ]);

            // Handle deleted images
            if (!empty($validated['deleted_images'])) {
                $imagesToDelete = ProductImage::whereIn('id', $validated['deleted_images'])
                    ->where('product_id', $product->id)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    // Delete physical file
                    $filePath = public_path($image->image_path);
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                    $image->delete();
                }
            }

            // Handle new/updated images
            if (!empty($validated['images'])) {
                foreach ($validated['images'] as $index => $imageData) {
                    // If image has an ID, it's an existing image - just update
                    if (isset($imageData['id'])) {
                        ProductImage::where('id', $imageData['id'])
                            ->where('product_id', $product->id)
                            ->update([
                                'is_primary' => $imageData['is_primary'] ?? false,
                                'sort_order' => $index,
                            ]);
                        continue;
                    }

                    $imagePath = $imageData['url'];

                    // Check if it's base64 (new image)
                    if (strpos($imageData['url'], 'data:image') === 0) {
                        @list($type, $fileData) = explode(';', $imageData['url']);
                        @list(, $fileData) = explode(',', $fileData);

                        $fileData = base64_decode($fileData);

                        @list(, $extension) = explode('/', $type);
                        $extension = $extension ?: 'png';

                        $fileName = 'product_' . $product->id . '_' . time() . '_' . $index . '.' . $extension;
                        $filePath = 'uploads/products/' . $fileName;
                        file_put_contents(public_path($filePath), $fileData);

                        $imagePath = $filePath;
                    }

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'is_primary' => $imageData['is_primary'] ?? ($index === 0),
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Product updated successfully',
                'product' => $product->load(['images']),
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $product = Products::findOrFail($id);

            // Delete all associated images (physical files and records)
            $images = ProductImage::where('product_id', $product->id)->get();

            foreach ($images as $image) {
                // Delete physical file
                $filePath = public_path($image->image_path);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                $image->delete();
            }

            // Delete the product
            $product->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Product deleted successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete product',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk delete products.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:products,id',
        ]);

        try {
            DB::beginTransaction();

            foreach ($validated['ids'] as $id) {
                $product = Products::find($id);

                if ($product) {
                    // Delete all associated images
                    $images = ProductImage::where('product_id', $product->id)->get();

                    foreach ($images as $image) {
                        $filePath = public_path($image->image_path);
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                        $image->delete();
                    }

                    $product->delete();
                }
            }

            DB::commit();

            return response()->json([
                'message' => count($validated['ids']) . ' products deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk product deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete products',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
