<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\CartItem;

class CategoryController extends Controller
{
    private function getCartIdentifier()
    {
        if (Auth::check()) {
            return ['user_id' => Auth::id()];
        }

        if (!Session::has('cart_session_id')) {
            Session::put('cart_session_id', uniqid('cart_', true));
        }

        $cartItems = CartItem::with('product.images')
            ->where('session_id', Session::get('cart_session_id'))
            ->get();

        return ['cartItems' => $cartItems];
    }

    public function laundry(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        return Inertia::render('category/laundry', [
            'cartItems' => $cartItems
        ]);
    }

    public function glass_jar(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        return Inertia::render('category/glass_jars', [
            'cartItems' => $cartItems
        ]);
    }

    public function home(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        return Inertia::render('category/lanty_home', [
            'cartItems' => $cartItems
        ]);
    }

    public function washing_machine(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        return Inertia::render('category/washing_machines',[
            'cartItems' => $cartItems
        ]);
    }
}
