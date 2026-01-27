<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\CartItem;
use App\Models\Products;

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

    public function cat($category)
    {

        switch ($category) {
            case 'laundry':
                return $this->laundry();
            case 'glass_jar':
                return $this->glass_jar();
            case 'home':
                return $this->home();
            case 'washing_machines':
                return $this->washing_machines();
            default:
                abort(404);
        }
    }
    private function getLaundryProducts($category)
    {
        return Products::with('images')
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function laundry(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        $laundryProducts = $this->getLaundryProducts('Laundry Products');

        return Inertia::render('category/laundry', [
            'cartItems' => $cartItems,
            'laundryProducts' => $laundryProducts
        ]);
    }

    public function glass_jar(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        $jarProducts = $this->getLaundryProducts('Glass Jars');

        return Inertia::render('category/glass_jars', [
            'cartItems' => $cartItems,
            'jarProducts' => $jarProducts
        ]);
    }

    public function home(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        $homeProducts = $this->getLaundryProducts('Lanty Home');

        return Inertia::render('category/lanty_home', [
            'cartItems' => $cartItems,
            'homeProducts' => $homeProducts
        ]);
    }

    public function washing_machines(){
        $cartItems = $this->getCartIdentifier()['cartItems'];
        $washingMachineProducts = $this->getLaundryProducts('Washing Machines');

        return Inertia::render('category/washing_machine',[
            'cartItems' => $cartItems,
            'washingMachineProducts' => $washingMachineProducts
        ]);
    }
}
