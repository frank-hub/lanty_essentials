<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Products;

class WelcomeController extends Controller
{
    public function index(){
        $products = Products::with('images')->orderBy('created_at', 'desc')->get();

        return Inertia::render('welcome', [
            'products' => $products
        ]);
    }


    public function show($id){
        $product = Products::with('images')->findOrFail($id);

        return Inertia::render('product_details', [
            'product' => $product
        ]);
    }
}
