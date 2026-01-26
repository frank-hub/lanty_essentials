<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\CartItem;
use Illuminate\Support\Facades\Http;


class WelcomeController extends Controller
{
    public function sendBulk(Request $request)
    {


        // $data = $request->validate([
        //     'message' => 'required|string|max:1000',
        //     'phoneNumbers' => 'required|array|min:1',
        //     'phoneNumbers.*' => 'required|string',
        // ]);

        // $to = implode(',', $data['phoneNumbers']);

        $response = Http::withHeaders([
                'Accept' => 'application/json',
                'apiKey' => env('AT_API_KEY'),
            ])
            ->asForm() // 🔴 VERY IMPORTANT
            ->post('https://api.africastalking.com/version1/messaging', [
                'username' => env('AT_USERNAME'),
                'to'       => '+254736948522',
                'message'  => 'Hello from Lanty Essentials, your order is being processed.',

                // 'from'     => env('AT_FROM'), // optional but recommended
            ]);

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'status'  => $response->status(),
                'error'   => $response->json() ?? $response->body(),
            ], $response->status());
        }

        return response()->json([
            'success' => true,
            'data' => $response->json(),
        ]);
    }

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
