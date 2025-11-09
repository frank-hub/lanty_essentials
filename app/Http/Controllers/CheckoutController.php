<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
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
     * Display checkout page
     */
    public function index()
    {
        $identifier = $this->getCartIdentifier();

        $cartItems = CartItem::with('product.images')
            ->where($identifier)
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect('/cart')->with('error', 'Your cart is empty. Add items before checkout.');
        }

        $subtotal = (float) $cartItems->sum('subtotal');
        $shipping = $subtotal >= 5000 ? 0 : 500;
        $total = $subtotal + $shipping;

        return Inertia::render('checkout/index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
        ]);
    }

    /**
     * Process checkout and create order
     */
    public function store(Request $request)
    {
        // Return JSON for AJAX requests
        if (!$request->expectsJson() && $request->isJson()) {
            $request->headers->set('Accept', 'application/json');
        }

        try {
            $validated = $request->validate([
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'postalCode' => 'nullable|string|max:20',
                'shippingMethod' => 'required|in:standard,express',
                'paymentMethod' => 'required|in:card,mpesa,paypal',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }

        $identifier = $this->getCartIdentifier();

        $cartItems = CartItem::with('product')
            ->where($identifier)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Your cart is empty.'], 400);
        }

        // Calculate totals
        $subtotal = (float) $cartItems->sum('subtotal');
        $shipping = $validated['shippingMethod'] === 'express' ? 1000 : ($subtotal >= 5000 ? 0 : 500);
        $promoDiscount = $subtotal * 0.1; // Assuming 10% promo applied
        $total = $subtotal - $promoDiscount + $shipping;

        // Verify stock availability
        foreach ($cartItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json(['error' => "Insufficient stock for {$item->product->name}"], 400);
            }
        }

        DB::beginTransaction();

        try {
            // Create or update customer
            $customer = Customer::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'full_name' => $validated['firstName'] . ' ' . $validated['lastName'],
                    'password' => bcrypt(Str::random(16)),
                    'phone' => $validated['phone'],
                    'billing_address' => $validated['address'],
                    'default_shipping_address' => $validated['address'],
                    'country' => 'Kenya',
                ]
            );

            // Create order
            $order = Order::create([
                'id' => (string) Str::uuid(),
                'customer_id' => $customer->id,
                'amount' => $subtotal,
                'shipping_address' => $validated['address'] . ', ' . $validated['city'],
                'order_address' => $validated['address'],
                'order_email' => $validated['email'],
                'order_date' => now(),
                'order_status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create order details for each cart item
            foreach ($cartItems as $item) {
                OrderDetail::create([
                    'id' => (string) Str::uuid(),
                    'order_id' => $order->id,
                    'customer_id' => $customer->id,
                    'product_id' => $item->product_id,
                    'price' => $item->price,
                    'sku' => $item->product->sku,
                    'quantity' => $item->quantity,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Reduce stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Process payment based on method
            $paymentStatus = $this->processPayment(
                $validated['paymentMethod'],
                $total,
                $order,
                $customer,
                $validated
            );

            if (!$paymentStatus) {
                DB::rollBack();
                $order->update(['order_status' => 'payment_failed']);
                return response()->json(['error' => 'Payment processing failed. Please try again.'], 400);
            }

            // Update order status to processing
            $order->update(['order_status' => 'processing']);

            // Clear cart
            CartItem::where($identifier)->delete();

            // Send confirmation email
            $this->sendOrderConfirmation($order, $customer);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'order_id' => $order->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            $errorMsg = $e->getMessage();
            \Log::error('Checkout error: ' . $errorMsg, [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'error' => 'An error occurred while processing your order',
                'message' => config('app.debug') ? $errorMsg : 'Please try again or contact support.',
                'debug' => config('app.debug') ? $errorMsg : null,
            ], 500);
        }
    }

    /**
     * Process payment based on method
     */
    private function processPayment($method, $amount, $order, $customer, $data)
    {
        switch ($method) {
            case 'card':
                return $this->processCardPayment($amount, $order, $customer, $data);
            case 'mpesa':
                return $this->processMpesaPayment($amount, $order, $customer, $data);
            case 'paypal':
                return $this->processPayPalPayment($amount, $order, $customer, $data);
            default:
                return false;
        }
    }

    /**
     * Process card payment (Stripe)
     */
    private function processCardPayment($amount, $order, $customer, $data)
    {
        try {
            // Integrate with Stripe
            // Example implementation:
            // $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            // $charge = $stripe->charges->create([
            //     'amount' => $amount * 100,
            //     'currency' => 'kes',
            //     'source' => $data['stripeToken'],
            //     'description' => 'Order ' . $order->id,
            //     'metadata' => [
            //         'order_id' => $order->id,
            //         'customer_email' => $customer->email,
            //     ]
            // ]);

            // For now, simulate success
            \Log::info('Card payment processed', [
                'order_id' => $order->id,
                'amount' => $amount,
                'customer_email' => $customer->email,
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('Card payment error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Process M-Pesa payment (Daraja API)
     */
    private function processMpesaPayment($amount, $order, $customer, $data)
    {
        try {
            // Integrate with M-Pesa Daraja API
            // Example implementation using Laravel HTTP client:
            // $response = \Illuminate\Support\Facades\Http::withBasicAuth(
            //     config('services.mpesa.consumer_key'),
            //     config('services.mpesa.consumer_secret')
            // )->post(config('services.mpesa.oauth_url'), []);

            // $token = $response['access_token'];

            // $stkResponse = \Illuminate\Support\Facades\Http::withToken($token)
            //     ->post(config('services.mpesa.stk_push_url'), [
            //         'BusinessShortCode' => config('services.mpesa.short_code'),
            //         'Password' => base64_encode(config('services.mpesa.short_code') . config('services.mpesa.passkey') . date('YmdHis')),
            //         'Timestamp' => date('YmdHis'),
            //         'TransactionType' => 'CustomerPayBillOnline',
            //         'Amount' => (int) $amount,
            //         'PartyA' => $data['mpesaPhone'],
            //         'PartyB' => config('services.mpesa.short_code'),
            //         'PhoneNumber' => $data['mpesaPhone'],
            //         'CallBackURL' => route('payment.callback.mpesa'),
            //         'AccountReference' => $order->id,
            //         'TransactionDesc' => 'Payment for Order ' . $order->id,
            //     ]);

            \Log::info('M-Pesa STK initiated', [
                'order_id' => $order->id,
                'amount' => $amount,
                'phone' => $data['mpesaPhone'],
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('M-Pesa payment error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Process PayPal payment
     */
    private function processPayPalPayment($amount, $order, $customer, $data)
    {
        try {
            // Integrate with PayPal SDK
            // Example using PayPal Checkout SDK:
            // $provider = new \Srmklive\PayPal\Services\PayPal;
            // $provider->setApiContext();

            // $cart = new \PayPal\Api\ItemList();
            // $item = new \PayPal\Api\Item();
            // $item->setName("Order {$order->id}")
            //     ->setCurrency('KES')
            //     ->setQuantity(1)
            //     ->setPrice($amount);
            // $cart->setItems([$item]);

            // $payer = new \PayPal\Api\Payer();
            // $payer->setPaymentMethod('paypal');

            // $payment = new \PayPal\Api\Payment();
            // $payment->setIntent('sale')
            //     ->setPayer($payer)
            //     ->setTransactions([/* transaction details */]);

            \Log::info('PayPal payment initiated', [
                'order_id' => $order->id,
                'amount' => $amount,
                'customer_email' => $customer->email,
            ]);

            return true;
        } catch (\Exception $e) {
            \Log::error('PayPal payment error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send order confirmation email
     */
    private function sendOrderConfirmation($order, $customer)
    {
        try {
            \Mail::send('emails.order-confirmation', [
                'order' => $order,
                'customer' => $customer,
            ], function ($message) use ($order, $customer) {
                $message->to($customer->email)
                        ->subject("Order Confirmation - {$order->id}");
            });

            \Log::info('Confirmation email sent', ['customer_email' => $customer->email, 'order_id' => $order->id]);
        } catch (\Exception $e) {
            \Log::error('Email sending error: ' . $e->getMessage());
        }
    }

    /**
     * Display order success page
     */
    public function success($orderId)
    {
        $order = Order::with(['details.product', 'customer'])
            ->findOrFail($orderId);

        // Verify authorization
        if (!Auth::guest() && Auth::user()->id !== $order->customer_id && !Auth::user()->isAdmin) {
            return redirect('/')->with('error', 'Unauthorized access.');
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }

    /**
     * Get order details
     */
    public function getOrder($orderId)
    {
        $order = Order::with(['details.product', 'customer'])
            ->findOrFail($orderId);

        // Verify authorization
        if (Auth::check() && Auth::user()->id !== $order->customer_id && !Auth::user()->isAdmin) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($order);
    }

    /**
     * Get customer orders
     */
    public function getCustomerOrders($customerId)
    {
        $orders = Order::with('details.product')
            ->where('customer_id', $customerId)
            ->orderByDesc('order_date')
            ->get();

        return response()->json($orders);
    }

    /**
     * Apply promo code
     */
    public function applyPromo(Request $request)
    {
        // $validated = $request->validate([
        //     'code' => 'required|string',
        // ]);

        // // Check if promo code is valid
        // $promoCode = \App\Models\PromoCode::where('code', strtoupper($validated['code']))
        //     ->where('is_active', true)
        //     ->first();

        // if (!$promoCode) {
        //     return response()->json(['error' => 'Invalid promo code'], 400);
        // }

        // if ($promoCode->expired_at && $promoCode->expired_at < now()) {
        //     return response()->json(['error' => 'Promo code has expired'], 400);
        // }

        // return response()->json([
        //     'discount_percent' => $promoCode->discount_percent,
        //     'message' => 'Promo code applied successfully',
        // ]);
    }

    /**
     * M-Pesa callback handler
     */
    public function mpesaCallback(Request $request)
    {
        $data = $request->all();

        \Log::info('M-Pesa Callback', $data);

        try {
            $result = $data['Result'];
            $orderId = $data['Result']['ResultParameters']['Body']['stkCallback']['CheckoutRequestID'];

            if ($result['ResultCode'] == 0) {
                $order = Order::find($orderId);
                $order->update(['order_status' => 'completed']);

                \Log::info('M-Pesa payment successful', ['order_id' => $orderId]);
            } else {
                $order = Order::find($orderId);
                $order->update(['order_status' => 'payment_failed']);

                \Log::warning('M-Pesa payment failed', ['order_id' => $orderId, 'result' => $result]);
            }
        } catch (\Exception $e) {
            \Log::error('M-Pesa callback error: ' . $e->getMessage());
        }

        return response()->json(['status' => 'received']);
    }
}
