<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductsController extends Controller
{
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
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|string',
            'weight' => 'nullable|numeric|min:0',
            'dimensions.length' => 'nullable|numeric|min:0',
            'dimensions.width' => 'nullable|numeric|min:0',
            'dimensions.height' => 'nullable|numeric|min:0',
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

            // Create the product
            $product = Product::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
                'short_description' => $validated['short_description'] ?? null,
                'sku' => $validated['sku'],
                'price' => $validated['price'],
                'compare_price' => $validated['compare_price'] ?? null,
                'cost' => $validated['cost'] ?? null,
                'category_id' => $validated['category_id'],
                'tags' => $validated['tags'] ?? null,
                'weight' => $validated['weight'] ?? null,
                'dimensions' => json_encode($validated['dimensions'] ?? []),
                'stock' => $validated['stock'] ?? 0,
                'track_quantity' => $validated['track_quantity'] ?? true,
                'status' => $validated['status'],
                'visibility' => $validated['visibility'],
                'seo_title' => $validated['seo_title'] ?? null,
                'seo_description' => $validated['seo_description'] ?? null,
                'specifications' => $validated['specifications'] ?? null,
            ]);

            // Handle images
            if (isset($validated['images']) && is_array($validated['images'])) {
                foreach ($validated['images'] as $index => $imageData) {
                    // Handle base64 image upload
                    if (strpos($imageData['url'], 'data:image') === 0) {
                        $imagePath = $this->uploadBase64Image($imageData['url'], $product->id);
                    } else {
                        $imagePath = $imageData['url'];
                    }

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'is_primary' => $imageData['is_primary'] ?? ($index === 0),
                        'sort_order' => $index,
                    ]);
                }
            }

            // Handle variants
            if (isset($validated['variants']) && is_array($validated['variants'])) {
                foreach ($validated['variants'] as $variantData) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'name' => $variantData['name'],
                        'sku' => $variantData['sku'] ?? $product->sku . '-' . Str::slug($variantData['name']),
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('all_products')
                ->with('success', 'Product created successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()
                ->withInput()
                ->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }
}
