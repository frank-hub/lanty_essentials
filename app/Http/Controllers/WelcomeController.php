<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\CartItem;

class WelcomeController extends Controller
{
    private function getCartIdentifier()
    {
        if (Auth::check()) {
            return ['user_id' => Auth::id()];
        }

        if (!Session::has('cart_session_id')) {
            Session::put('cart_session_id', uniqid('cart_', true));
        }

        return ['session_id' => Session::get('cart_session_id')];
    }

    public function shop(){
        $identifier = $this->getCartIdentifier();
        $cartItems = CartItem::with('product.images')
            ->where($identifier)
            ->get();
        $categories = [
            'Laundry Products',
            'Washing Machines',
            'Glass Jars',
            'Lanty Home',
        ];

        $products = Products::with('images')->orderBy('created_at', 'desc')->get();

        return Inertia::render('shop', [
            'products' => $products,
            'categories' => $categories,
            'cartItems' => $cartItems,
        ]);
    }

    public function index(){
        $identifier = $this->getCartIdentifier();

        $cartItems = CartItem::with('product.images')
            ->where($identifier)
            ->get();



        $products = Products::with('images')->orderBy('created_at', 'desc')->get();

        return Inertia::render('welcome', [
            'products' => $products,
            'cartItems' => $cartItems,
        ]);
    }


    public function show($id){
        $product = Products::with('images')->findOrFail($id);
        $identifier = $this->getCartIdentifier();

        $cartItems = CartItem::with('product.images')
            ->where($identifier)
            ->get();


        return Inertia::render('product_details', [
            'product' => $product,
            'cartItems' => $cartItems
        ]);
    }
}
