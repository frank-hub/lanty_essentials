<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'price',
        'weight',
        'descriptions',
        'thumbnail',
        'image',
        'category',
        'create_date',
        'stock',
    ];
}
