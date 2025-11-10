<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Customer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display orders dashboard
     */
    public function index()
    {
        $orders = Order::with(['orderDetails', 'customers'])
            ->orderByDesc('order_date')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'customer_id' => $order->customer_id,
                    'amount' => $order->amount,
                    'name' => $order->name,
                    'order_email' => $order->order_email,
                    'order_address' => $order->order_address,
                    'shipping_address' => $order->shipping_address,
                    'order_date' => $order->order_date,
                    'order_status' => $order->order_status,
                    'details' => $order->orderDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'product_id' => $detail->product_id,
                            'quantity' => $detail->quantity,
                            'price' => (float) $detail->price,
                            'sku' => $detail->sku,
                        ];
                    })->toArray(),
                    'customer' => [
                        'id' =>(string) $order->customers->id,
                        'full_name' => $order->customers->full_name,
                        'email' => $order->customers->email,
                        'phone' => $order->customers->phone,
                    ]
                ];
            });

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Get single order details
     */
    public function show($orderId)
    {
        $order = Order::with(['details.product', 'customer'])
            ->findOrFail($orderId);

        return response()->json([
            'order' => [
                'id' => $order->id,
                'customer_id' => $order->customer_id,
                'order_amount' => (float) $order->order_amount,
                'order_email' => $order->order_email,
                'order_address' => $order->order_address,
                'shipping_address' => $order->shipping_address,
                'order_date' => $order->order_date,
                'order_status' => $order->order_status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'details' => $order->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'product_id' => $detail->product_id,
                        'product' => [
                            'id' => $detail->product->id,
                            'name' => $detail->product->name,
                            'sku' => $detail->product->sku,
                        ],
                        'quantity' => $detail->quantity,
                        'price' => (float) $detail->price,
                        'sku' => $detail->sku,
                    ];
                })->toArray(),
                'customer' => [
                    'id' => $order->customer->id,
                    'full_name' => $order->customer->full_name,
                    'email' => $order->customer->email,
                    'phone' => $order->customer->phone,
                    'billing_address' => $order->customer->billing_address,
                    'default_shipping_address' => $order->customer->default_shipping_address,
                ]
            ]
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $orderId)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled,payment_failed',
        ]);

        $order = Order::findOrFail($orderId);

        $previousStatus = $order->order_status;
        $order->update(['order_status' => $validated['status']]);

        \Log::info("Order status updated", [
            'order_id' => $orderId,
            'from' => $previousStatus,
            'to' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order,
        ]);
    }

    /**
     * Get orders with filters and search
     */
    public function filter(Request $request)
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('per_page', 15);

        $query = Order::with(['details', 'customer']);

        // Search by order ID, customer name, or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('order_email', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($q) use ($search) {
                      $q->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($status !== 'all') {
            $query->where('order_status', $status);
        }

        $orders = $query->orderByDesc('order_date')
            ->paginate($perPage)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_id' => $order->customer_id,
                    'order_amount' => (float) $order->order_amount,
                    'order_email' => $order->order_email,
                    'order_address' => $order->order_address,
                    'shipping_address' => $order->shipping_address,
                    'order_date' => $order->order_date,
                    'order_status' => $order->order_status,
                    'details' => $order->details,
                    'customer' => $order->customer,
                ];
            });

        return response()->json($orders);
    }

    /**
     * Get order statistics
     */
    public function statistics()
    {
        $totalOrders = Order::count();
        $completedOrders = Order::where('order_status', 'completed')->count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $processingOrders = Order::where('order_status', 'processing')->count();
        $cancelledOrders = Order::where('order_status', 'cancelled')->count();
        $failedOrders = Order::where('order_status', 'payment_failed')->count();

        $totalRevenue = Order::where('order_status', 'completed')
            ->sum('order_amount');

        $averageOrderValue = Order::where('order_status', 'completed')
            ->avg('order_amount');

        $revenueByStatus = Order::select('order_status', DB::raw('COUNT(*) as count, SUM(order_amount) as total'))
            ->groupBy('order_status')
            ->get();

        $revenueByDate = Order::where('order_status', 'completed')
            ->selectRaw('DATE(order_date) as date, SUM(order_amount) as total, COUNT(*) as count')
            ->groupByRaw('DATE(order_date)')
            ->orderByDesc('date')
            ->limit(30)
            ->get();

        return response()->json([
            'total_orders' => $totalOrders,
            'completed_orders' => $completedOrders,
            'pending_orders' => $pendingOrders,
            'processing_orders' => $processingOrders,
            'cancelled_orders' => $cancelledOrders,
            'failed_orders' => $failedOrders,
            'total_revenue' => (float) $totalRevenue,
            'average_order_value' => (float) $averageOrderValue,
            'revenue_by_status' => $revenueByStatus,
            'revenue_by_date' => $revenueByDate,
        ]);
    }

    /**
     * Export orders to CSV
     */
    public function export(Request $request)
    {
        $status = $request->input('status', 'all');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $query = Order::with('customer');

        if ($status !== 'all') {
            $query->where('order_status', $status);
        }

        if ($fromDate) {
            $query->whereDate('order_date', '>=', $fromDate);
        }

        if ($toDate) {
            $query->whereDate('order_date', '<=', $toDate);
        }

        $orders = $query->orderByDesc('order_date')->get();

        $csv = "Order ID,Customer Name,Email,Phone,Amount,Status,Date\n";

        foreach ($orders as $order) {
            $csv .= "\"{$order->id}\",\"{$order->customer->full_name}\",\"{$order->order_email}\",\"{$order->customer->phone}\",\"{$order->order_amount}\",\"{$order->order_status}\",\"{$order->order_date}\"\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders-' . date('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Send order invoice email
     */
    public function sendInvoice($orderId)
    {
        $order = Order::with(['details.product', 'customer'])
            ->findOrFail($orderId);

        try {
            \Mail::send('emails.order-invoice', [
                'order' => $order,
            ], function ($message) use ($order) {
                $message->to($order->order_email)
                        ->subject("Invoice for Order {$order->id}");
            });

            \Log::info('Invoice email sent', ['order_id' => $orderId, 'customer_email' => $order->order_email]);

            return response()->json([
                'success' => true,
                'message' => 'Invoice sent successfully to ' . $order->order_email,
            ]);
        } catch (\Exception $e) {
            \Log::error('Invoice email error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to send invoice email',
            ], 500);
        }
    }

    /**
     * Bulk update order status
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'string|exists:orders,id',
            'status' => 'required|in:pending,processing,completed,cancelled,payment_failed',
        ]);

        try {
            $updated = Order::whereIn('id', $validated['order_ids'])
                ->update(['order_status' => $validated['status']]);

            \Log::info("Bulk order status update", [
                'count' => $updated,
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => "{$updated} order(s) updated successfully",
                'updated_count' => $updated,
            ]);
        } catch (\Exception $e) {
            \Log::error('Bulk update error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update orders',
            ], 500);
        }
    }

    /**
     * Delete single order
     */
    public function destroy($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);

            // Delete order details first
            OrderDetail::where('order_id', $orderId)->delete();

            // Delete order
            $order->delete();

            \Log::info('Order deleted', ['order_id' => $orderId, 'deleted_by' => Auth::id()]);

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Order delete error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete order',
            ], 500);
        }
    }

    /**
     * Get customer order history
     */
    public function customerOrders($customerId)
    {
        $orders = Order::where('customer_id', $customerId)
            ->with(['details', 'customer'])
            ->orderByDesc('order_date')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_amount' => (float) $order->order_amount,
                    'order_date' => $order->order_date,
                    'order_status' => $order->order_status,
                    'details_count' => $order->details->count(),
                ];
            });

        return response()->json([
            'customer_id' => $customerId,
            'orders' => $orders,
            'total_orders' => $orders->count(),
            'total_spent' => $orders->sum('order_amount'),
        ]);
    }

    /**
     * Get order by status dashboard
     */
    public function statusDashboard()
    {
        $statuses = ['pending', 'processing', 'completed', 'cancelled', 'payment_failed'];
        $data = [];

        foreach ($statuses as $status) {
            $orders = Order::where('order_status', $status)
                ->with('customer')
                ->orderByDesc('order_date')
                ->limit(5)
                ->get();

            $data[$status] = [
                'count' => Order::where('order_status', $status)->count(),
                'recent_orders' => $orders,
            ];
        }

        return response()->json($data);
    }

    /**
     * Generate invoice PDF
     */
    public function generateInvoicePDF($orderId)
    {
        $order = Order::with(['details.product', 'customer'])
            ->findOrFail($orderId);

        // Using DomPDF or similar PDF library
        // $pdf = \PDF::loadView('invoices.order', ['order' => $order]);
        // return $pdf->download("invoice-{$order->id}.pdf");

        // For now, return JSON
        return response()->json([
            'message' => 'PDF generation not configured yet',
            'order_id' => $orderId,
        ]);
    }

    /**
     * Track order shipment
     */
    public function trackShipment($orderId)
    {
        $order = Order::findOrFail($orderId);

        return response()->json([
            'order_id' => $order->id,
            'order_status' => $order->order_status,
            'order_date' => $order->order_date,
            'estimated_delivery' => $order->estimated_delivery ?? null,
            'tracking_number' => $order->tracking_number ?? null,
            'current_location' => $order->current_location ?? null,
        ]);
    }
}
