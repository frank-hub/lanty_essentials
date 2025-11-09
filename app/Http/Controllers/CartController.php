<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem;;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    /**
     * Get cart identifier (user_id or session_id)
     */
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

    /**
     * Display cart page
     */
    public function index()
    {
        $identifier = $this->getCartIdentifier();

        $cartItems = CartItem::with('product.images')
            ->where($identifier)
            ->get();

        $subtotal = (float)$cartItems->sum(fn($item) => $item->price * $item->quantity);
        $shipping = $subtotal >= 5000 ? 0 : 500;
        $total = $subtotal + $shipping;

        // return response()->json(['cartItems' => $cartItems, 'subtotal' => $subtotal, 'shipping' => $shipping, 'total' => $total]);

        return Inertia::render('cart/index', [
            'cartItems' => $cartItems,
            'subtotal' => (int) $subtotal,
            'shipping' => (int) $shipping,
            'total' => (int) $total,
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'variant' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        // Check product stock
        $product = Products::findOrFail($validated['product_id']);

        if ($product->stock < $validated['quantity']) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $identifier = $this->getCartIdentifier();

        // Check if item already exists in cart
        $existingItem = CartItem::where($identifier)
            ->where('product_id', $validated['product_id'])
            ->where('variant', $validated['variant'])
            ->first();

        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem->quantity + $validated['quantity'];

            if ($newQuantity > $product->stock) {
                return back()->with('error', 'Cannot add more items than available in stock.');
            }

            $existingItem->update(['quantity' => $newQuantity]);

            return back()->with('success', 'Cart updated successfully!');
        }

        // Create new cart item
        CartItem::create([
            ...$identifier,
            'product_id' => $validated['product_id'],
            'variant' => $validated['variant'],
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
        ]);

        return back()->with('success', 'Product added to cart!');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Verify ownership
        $identifier = $this->getCartIdentifier();
        if (!$this->verifyCartItemOwnership($cartItem, $identifier)) {
            return back()->with('error', 'Unauthorized action.');
        }

        // Check stock
        $product = $cartItem->product;
        if ($validated['quantity'] > $product->stock) {
            return back()->with('error', 'Insufficient stock available.');
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        return back()->with('success', 'Cart updated successfully!');
    }

    /**
     * Remove item from cart
     */
    public function remove(CartItem $cartItem)
    {
        $identifier = $this->getCartIdentifier();

        if (!$this->verifyCartItemOwnership($cartItem, $identifier)) {
            return back()->with('error', 'Unauthorized action.');
        }

        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        $identifier = $this->getCartIdentifier();

        CartItem::where($identifier)->delete();

        return back()->with('success', 'Cart cleared successfully!');
    }

    /**
     * Get cart count (for header badge)
     */
    public function count()
    {
        $identifier = $this->getCartIdentifier();

        $count = CartItem::where($identifier)->sum('quantity');

        return response()->json(['count' => $count]);
    }

    /**
     * Verify cart item ownership
     */
    private function verifyCartItemOwnership(CartItem $cartItem, array $identifier)
    {
        if (isset($identifier['user_id'])) {
            return $cartItem->user_id == $identifier['user_id'];
        }

        return $cartItem->session_id == $identifier['session_id'];
    }

    /**
     * Merge guest cart to user cart on login
     */
    public function mergeGuestCart()
    {
        if (!Auth::check()) {
            return;
        }

        $sessionId = Session::get('cart_session_id');

        if (!$sessionId) {
            return;
        }

        // Get guest cart items
        $guestItems = CartItem::where('session_id', $sessionId)->get();

        foreach ($guestItems as $guestItem) {
            // Check if user already has this item
            $userItem = CartItem::where('user_id', Auth::id())
                ->where('product_id', $guestItem->product_id)
                ->where('variant', $guestItem->variant)
                ->first();

            if ($userItem) {
                // Merge quantities
                $userItem->update([
                    'quantity' => $userItem->quantity + $guestItem->quantity
                ]);
                $guestItem->delete();
            } else {
                // Transfer to user
                $guestItem->update([
                    'user_id' => Auth::id(),
                    'session_id' => null,
                ]);
            }
        }

        Session::forget('cart_session_id');
    }
}
