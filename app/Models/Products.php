<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $fillable = [
        'sku', 'name', 'price', 'weight', 'description',
        'thumbnail', 'images', 'category', 'create_date', 'stock'
    ];

    public function categories(){
        return $this->belongsToMany(Category::class,'product_categories');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function options(){
        return $this->belongsToMany(Option::class,'product_options');
    }

    public function orderDetails(){
        return $this->hasMany(orderDetail::class);
    }
}
