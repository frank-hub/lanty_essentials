<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Products;
use App\Models\Customer;
use App\Models\OrderDetail;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now       = Carbon::now();
        $thisMonth = $now->copy()->startOfMonth();
        $lastMonth = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

        // ── Revenue ───────────────────────────────────────────────────────────
        $revenueThis = Order::where('order_status', 'completed')
            ->where('order_date', '>=', $thisMonth)->sum('amount');
        $revenueLast = Order::where('order_status', 'completed')
            ->whereBetween('order_date', [$lastMonth, $lastMonthEnd])->sum('amount');
        $revenueTotal = Order::where('order_status', 'completed')->sum('amount');

        // ── Orders ────────────────────────────────────────────────────────────
        $ordersThis = Order::where('order_date', '>=', $thisMonth)->count();
        $ordersLast = Order::whereBetween('order_date', [$lastMonth, $lastMonthEnd])->count();
        $ordersTotal = Order::count();
        $ordersPending = Order::where('order_status', 'pending')->count();

        // ── Products ──────────────────────────────────────────────────────────
        $productsTotal  = Products::count();
        $productsActive = Products::where('status', 'active')->count();
        $productsLowStock = Products::where('stock', '<=', 10)->where('stock', '>', 0)->count();
        $productsOutStock = Products::where('stock', 0)->count();

        // ── Customers ─────────────────────────────────────────────────────────
        $customersTotal = Customer::count();
        $customersThis  = Customer::where('created_at', '>=', $thisMonth)->count();
        $customersLast  = Customer::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        // ── Revenue chart – last 14 days ──────────────────────────────────────
        $start = $now->copy()->subDays(13)->startOfDay();
        $rawDays = Order::where('order_status', 'completed')
            ->where('order_date', '>=', $start)
            ->selectRaw('DATE(order_date) as date, SUM(amount) as total, COUNT(*) as orders')
            ->groupByRaw('DATE(order_date)')
            ->orderBy('date')
            ->get()->keyBy('date');

        $revenueChart = [];
        for ($i = 13; $i >= 0; $i--) {
            $d = $now->copy()->subDays($i)->toDateString();
            $revenueChart[] = [
                'date'   => $d,
                'label'  => Carbon::parse($d)->format('d M'),
                'total'  => (float) ($rawDays[$d]->total  ?? 0),
                'orders' => (int)   ($rawDays[$d]->orders ?? 0),
            ];
        }

        // ── Order status breakdown ────────────────────────────────────────────
        $statusBreakdown = Order::selectRaw('order_status, COUNT(*) as count')
            ->groupBy('order_status')
            ->pluck('count', 'order_status')
            ->toArray();

        // ── Recent orders (latest 6) ──────────────────────────────────────────
        $recentOrders = Order::with('customers')
            ->orderByDesc('order_date')
            ->limit(6)
            ->get()
            ->map(fn($o) => [
                'id'         => (string) $o->id,
                'customer'   => $o->customers->full_name ?? $o->name ?? '—',
                'amount'     => (float) $o->amount,
                'status'     => $o->order_status,
                'order_date' => Carbon::parse($o->order_date)->format('d M Y'),
            ]);

        // ── Top products by revenue ───────────────────────────────────────────
        $topProducts = OrderDetail::join('orders',   'order_details.order_id',   '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('orders.order_status', 'completed')
            ->selectRaw('
                products.id,
                products.name,
                products.category,
                SUM(order_details.quantity) as units_sold,
                SUM(order_details.quantity * order_details.price) as revenue
            ')
            ->groupBy('products.id', 'products.name', 'products.category')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id'         => $p->id,
                'name'       => $p->name,
                'category'   => $p->category,
                'units_sold' => (int)   $p->units_sold,
                'revenue'    => (float) $p->revenue,
            ]);

        // ── Recent customers ──────────────────────────────────────────────────
        $recentCustomers = Customer::orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'        => (string) $c->id,
                'full_name' => $c->full_name,
                'email'     => $c->email,
                'joined'    => Carbon::parse($c->created_at)->format('d M Y'),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'revenue' => [
                    'total'      => (float) $revenueTotal,
                    'this_month' => (float) $revenueThis,
                    'last_month' => (float) $revenueLast,
                    'change'     => $this->pctChange($revenueLast, $revenueThis),
                ],
                'orders' => [
                    'total'      => (int) $ordersTotal,
                    'this_month' => (int) $ordersThis,
                    'last_month' => (int) $ordersLast,
                    'pending'    => (int) $ordersPending,
                    'change'     => $this->pctChange($ordersLast, $ordersThis),
                ],
                'products' => [
                    'total'      => (int) $productsTotal,
                    'active'     => (int) $productsActive,
                    'low_stock'  => (int) $productsLowStock,
                    'out_stock'  => (int) $productsOutStock,
                ],
                'customers' => [
                    'total'      => (int) $customersTotal,
                    'this_month' => (int) $customersThis,
                    'last_month' => (int) $customersLast,
                    'change'     => $this->pctChange($customersLast, $customersThis),
                ],
            ],
            'revenue_chart'    => $revenueChart,
            'status_breakdown' => $statusBreakdown,
            'recent_orders'    => $recentOrders,
            'top_products'     => $topProducts,
            'recent_customers' => $recentCustomers,
        ]);
    }

    private function pctChange(float $old, float $new): float
    {
        if ($old == 0) return $new > 0 ? 100 : 0;
        return round((($new - $old) / $old) * 100, 1);
    }
}
