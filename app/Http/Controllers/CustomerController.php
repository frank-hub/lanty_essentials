<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Display customers dashboard
     */
    public function index()
    {
        $customers = Customer::with('orders')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($customer) {
                $completedOrders = $customer->orders->filter(fn($o) => $o->order_status === 'completed');
                $totalSpent = (float) $completedOrders->sum('order_amount');
                $totalOrders = $customer->orders->count();

                return [
                    'id' => (string) $customer->id,
                    'full_name' => $customer->full_name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'country' => $customer->country,
                    'billing_address' => $customer->billing_address,
                    'default_shipping_address' => $customer->default_shipping_address,
                    'created_at' => $customer->created_at,
                    'total_orders' => $totalOrders,
                    'total_spent' => $totalSpent,
                    'average_order_value' => $totalOrders > 0 ? $totalSpent / $totalOrders : 0,
                    'last_order_date' => $customer->orders->max('order_date'),
                ];
            });

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Get single customer details
     */
    public function show($customerId)
    {
        $customer = Customer::with('orders.details.product')
            ->findOrFail($customerId);

        $completedOrders = $customer->orders->filter(fn($o) => $o->order_status === 'completed');
        $totalSpent = (float) $completedOrders->sum('order_amount');
        $totalOrders = $customer->orders->count();

        return response()->json([
            'customer' => [
                'id' => (string) $customer->id,
                'full_name' => $customer->full_name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'country' => $customer->country,
                'billing_address' => $customer->billing_address,
                'default_shipping_address' => $customer->default_shipping_address,
                'created_at' => $customer->created_at,
                'updated_at' => $customer->updated_at,
                'total_orders' => $totalOrders,
                'total_spent' => $totalSpent,
                'average_order_value' => $totalOrders > 0 ? $totalSpent / $totalOrders : 0,
                'orders' => $customer->orders->map(function ($order) {
                    return [
                        'id' => (string) $order->id,
                        'order_amount' => (float) $order->order_amount,
                        'order_date' => $order->order_date,
                        'order_status' => $order->order_status,
                        'items_count' => $order->details->count(),
                    ];
                }),
            ]
        ]);
    }

    /**
     * Get customers with filters and search
     */
    public function filter(Request $request)
    {
        $search = $request->input('search', '');
        $country = $request->input('country', 'all');
        $perPage = $request->input('per_page', 15);

        $query = Customer::with('orders');

        // Search by name, email, or phone
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by country
        if ($country !== 'all') {
            $query->where('country', $country);
        }

        $customers = $query->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(function ($customer) {
                $completedOrders = $customer->orders->filter(fn($o) => $o->order_status === 'completed');
                $totalSpent = (float) $completedOrders->sum('order_amount');
                $totalOrders = $customer->orders->count();

                return [
                    'id' => (string) $customer->id,
                    'full_name' => $customer->full_name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'country' => $customer->country,
                    'billing_address' => $customer->billing_address,
                    'default_shipping_address' => $customer->default_shipping_address,
                    'created_at' => $customer->created_at,
                    'total_orders' => $totalOrders,
                    'total_spent' => $totalSpent,
                    'average_order_value' => $totalOrders > 0 ? $totalSpent / $totalOrders : 0,
                    'last_order_date' => $customer->orders->max('order_date'),
                ];
            });

        return response()->json($customers);
    }

    /**
     * Get customer statistics
     */
    public function statistics()
    {
        $totalCustomers = Customer::count();
        $activeCustomers = Customer::whereHas('orders')->count();
        $newCustomers = Customer::where('created_at', '>=', now()->subDays(30))->count();
        $inactiveCustomers = $totalCustomers - $activeCustomers;

        $totalRevenue = Order::where('order_status', 'completed')
            ->sum('order_amount');

        $averageCustomerValue = $totalCustomers > 0
            ? Order::where('order_status', 'completed')->avg('order_amount')
            : 0;

        $topCustomers = Customer::with('orders')
            ->get()
            ->map(function ($customer) {
                $totalSpent = $customer->orders
                    ->where('order_status', 'completed')
                    ->sum('order_amount');
                return [
                    'id' => (string) $customer->id,
                    'name' => $customer->full_name,
                    'total_spent' => (float) $totalSpent,
                ];
            })
            ->sortByDesc('total_spent')
            ->take(10)
            ->values();

        $customersByCountry = Customer::select('country', DB::raw('COUNT(*) as count, SUM(orders.order_amount) as revenue'))
            ->leftJoin('orders', 'customers.id', '=', 'orders.customer_id')
            ->where('orders.order_status', 'completed')
            ->groupBy('country')
            ->get();

        return response()->json([
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
            'new_customers' => $newCustomers,
            'inactive_customers' => $inactiveCustomers,
            'total_revenue' => (float) $totalRevenue,
            'average_customer_value' => (float) $averageCustomerValue,
            'top_customers' => $topCustomers,
            'customers_by_country' => $customersByCountry,
        ]);
    }

    /**
     * Export customers to CSV
     */
    public function export(Request $request)
    {
        $country = $request->input('country', 'all');

        $query = Customer::with('orders');

        if ($country !== 'all') {
            $query->where('country', $country);
        }

        $customers = $query->get();

        $csv = "Customer Name,Email,Phone,Country,Total Orders,Total Spent,Joined Date\n";

        foreach ($customers as $customer) {
            $totalSpent = $customer->orders
                ->where('order_status', 'completed')
                ->sum('order_amount');

            $csv .= "\"{$customer->full_name}\",\"{$customer->email}\",\"{$customer->phone}\",\"{$customer->country}\",\"{$customer->orders->count()}\",\"{$totalSpent}\",\"{$customer->created_at}\"\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="customers-' . date('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Update customer information
     */
    public function update(Request $request, $customerId)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'billing_address' => 'required|string|max:255',
            'default_shipping_address' => 'required|string|max:255',
            'country' => 'required|string|max:100',
        ]);

        $customer = Customer::findOrFail($customerId);
        $customer->update($validated);

        \Log::info('Customer updated', ['customer_id' => $customerId, 'updated_by' => Auth::id()]);

        return response()->json([
            'success' => true,
            'message' => 'Customer updated successfully',
            'customer' => $customer,
        ]);
    }

    /**
     * Delete customer
     */
    public function destroy($customerId)
    {
        try {
            $customer = Customer::findOrFail($customerId);

            // Delete associated orders and order details
            Order::where('customer_id', $customerId)->delete();

            // Delete customer
            $customer->delete();

            \Log::info('Customer deleted', ['customer_id' => $customerId, 'deleted_by' => Auth::id()]);

            return response()->json([
                'success' => true,
                'message' => 'Customer deleted successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Customer delete error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete customer',
            ], 500);
        }
    }

    /**
     * Send email to customer
     */
    public function sendEmail(Request $request, $customerId)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $customer = Customer::findOrFail($customerId);

        try {
            \Mail::send('emails.customer-message', [
                'customer' => $customer,
                'message' => $validated['message'],
            ], function ($message) use ($customer, $validated) {
                $message->to($customer->email)
                        ->subject($validated['subject']);
            });

            \Log::info('Email sent to customer', ['customer_id' => $customerId, 'sent_by' => Auth::id()]);

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Email sending error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to send email',
            ], 500);
        }
    }

    /**
     * Get customer tier
     */
    public function getTier($customerId)
    {
        $customer = Customer::with('orders')->findOrFail($customerId);

        $totalSpent = $customer->orders
            ->where('order_status', 'completed')
            ->sum('order_amount');

        $tier = 'standard';
        if ($totalSpent === 0) {
            $tier = 'new';
        } elseif ($totalSpent < 50000) {
            $tier = 'standard';
        } elseif ($totalSpent < 100000) {
            $tier = 'premium';
        } else {
            $tier = 'vip';
        }

        return response()->json([
            'customer_id' => (string) $customer->id,
            'tier' => $tier,
            'total_spent' => (float) $totalSpent,
            'benefits' => $this->getTierBenefits($tier),
        ]);
    }

    /**
     * Get tier benefits
     */
    private function getTierBenefits($tier)
    {
        $benefits = [
            'new' => ['Free shipping on first order'],
            'standard' => ['Standard shipping', 'Email support'],
            'premium' => ['Free shipping on all orders', 'Priority support', '10% discount on all products'],
            'vip' => ['Free express shipping', 'Dedicated support', '15% discount on all products', 'Early access to new products'],
        ];

        return $benefits[$tier] ?? [];
    }

    /**
     * Bulk update customer tier/status
     */
    public function bulkUpdate(Request $request)
    {
        $validated = $request->validate([
            'customer_ids' => 'required|array|min:1',
            'customer_ids.*' => 'string|exists:customers,id',
            'action' => 'required|in:delete,export',
        ]);

        try {
            if ($validated['action'] === 'delete') {
                Customer::whereIn('id', $validated['customer_ids'])->delete();
                $message = count($validated['customer_ids']) . ' customer(s) deleted successfully';
            }

            \Log::info("Bulk customer action", [
                'action' => $validated['action'],
                'count' => count($validated['customer_ids']),
                'performed_by' => Auth::id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        } catch (\Exception $e) {
            \Log::error('Bulk update error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to perform bulk action',
            ], 500);
        }
    }

    /**
     * Get customer order history
     */
    public function orderHistory($customerId)
    {
        $orders = Order::where('customer_id', $customerId)
            ->with('details.product')
            ->orderByDesc('order_date')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'order_amount' => (float) $order->order_amount,
                    'order_date' => $order->order_date,
                    'order_status' => $order->order_status,
                    'items_count' => $order->details->count(),
                ];
            });

        return response()->json([
            'customer_id' => $customerId,
            'orders' => $orders,
        ]);
    }

    /**
     * Get customers report
     */
    public function report(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Customer::with('orders');

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        $customers = $query->get();

        return response()->json([
            'total_customers' => $customers->count(),
            'active_customers' => $customers->filter(fn($c) => $c->orders->count() > 0)->count(),
            'total_revenue' => Order::where('order_status', 'completed')->sum('order_amount'),
            'average_order_value' => Order::where('order_status', 'completed')->avg('order_amount'),
            'customers' => $customers->map(function ($customer) {
                $totalSpent = $customer->orders
                    ->where('order_status', 'completed')
                    ->sum('order_amount');
                return [
                    'name' => $customer->full_name,
                    'email' => $customer->email,
                    'total_orders' => $customer->orders->count(),
                    'total_spent' => (float) $totalSpent,
                ];
            }),
        ]);
    }
}
