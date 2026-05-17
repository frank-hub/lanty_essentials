<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Customer;
use App\Models\Products;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // SALES REPORT  →  admin/analytics/sales
    // ─────────────────────────────────────────────────────────────────────────

    public function salesReport()
    {
        $now   = Carbon::now();
        $start = $now->copy()->subDays(29)->startOfDay();

        // ── KPI cards ────────────────────────────────────────────────────────
        $totalRevenue     = Order::where('order_status', 'completed')->sum('amount');
        $revenueThisMonth = Order::where('order_status', 'completed')
            ->whereMonth('order_date', $now->month)
            ->whereYear('order_date',  $now->year)
            ->sum('amount');
        $revenueLastMonth = Order::where('order_status', 'completed')
            ->whereMonth('order_date', $now->copy()->subMonth()->month)
            ->whereYear('order_date',  $now->copy()->subMonth()->year)
            ->sum('amount');

        $totalOrders      = Order::count();
        $ordersThisMonth  = Order::whereMonth('order_date', $now->month)
            ->whereYear('order_date',  $now->year)->count();

        $avgOrderValue    = Order::where('order_status', 'completed')->avg('amount') ?? 0;

        $conversionOrders = Order::where('order_status', 'completed')->count();

        // ── Revenue last 30 days (daily) ─────────────────────────────────────
        $dailyRevenue = Order::where('order_status', 'completed')
            ->where('order_date', '>=', $start)
            ->selectRaw('DATE(order_date) as date, SUM(amount) as total, COUNT(*) as orders')
            ->groupByRaw('DATE(order_date)')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => [
                'date'   => $r->date,
                'total'  => (float) $r->total,
                'orders' => (int)   $r->orders,
            ]);

        // Fill missing days with zero
        $dailyMap = $dailyRevenue->keyBy('date');
        $filledDays = [];
        for ($i = 29; $i >= 0; $i--) {
            $d = $now->copy()->subDays($i)->toDateString();
            $filledDays[] = $dailyMap[$d] ?? ['date' => $d, 'total' => 0, 'orders' => 0];
        }

        // ── Revenue by month (last 12) ────────────────────────────────────────
        $monthlyRevenue = Order::where('order_status', 'completed')
            ->where('order_date', '>=', $now->copy()->subMonths(11)->startOfMonth())
            ->selectRaw("DATE_FORMAT(order_date, '%Y-%m') as month, SUM(amount) as total, COUNT(*) as orders")
            ->groupByRaw("DATE_FORMAT(order_date, '%Y-%m')")
            ->orderBy('month')
            ->get()
            ->map(fn($r) => [
                'month'  => $r->month,
                'total'  => (float) $r->total,
                'orders' => (int)   $r->orders,
            ]);

        // ── Orders by status ─────────────────────────────────────────────────
        $byStatus = Order::selectRaw('order_status, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('order_status')
            ->get()
            ->map(fn($r) => [
                'status' => $r->order_status,
                'count'  => (int)   $r->count,
                'total'  => (float) $r->total,
            ]);

        // ── Recent orders (latest 10) ────────────────────────────────────────
        $recentOrders = Order::with('customers')
            ->orderByDesc('order_date')
            ->limit(10)
            ->get()
            ->map(fn($o) => [
                'id'           => (string) $o->id,
                'name'         => $o->customers->full_name ?? $o->name,
                'amount'       => (float) $o->amount,
                'status'       => $o->order_status,
                'order_date'   => $o->order_date,
            ]);

        return Inertia::render('admin/analytics/sales-report', [
            'kpis' => [
                'total_revenue'       => (float) $totalRevenue,
                'revenue_this_month'  => (float) $revenueThisMonth,
                'revenue_last_month'  => (float) $revenueLastMonth,
                'total_orders'        => (int)   $totalOrders,
                'orders_this_month'   => (int)   $ordersThisMonth,
                'avg_order_value'     => (float) $avgOrderValue,
                'completed_orders'    => (int)   $conversionOrders,
            ],
            'daily_revenue'   => $filledDays,
            'monthly_revenue' => $monthlyRevenue,
            'by_status'       => $byStatus,
            'recent_orders'   => $recentOrders,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRODUCT ANALYTICS  →  admin/analytics/products
    // ─────────────────────────────────────────────────────────────────────────

    public function productAnalytics()
    {
        $now = Carbon::now();

        // ── Top selling products ──────────────────────────────────────────────
        $topProducts = OrderDetail::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('orders.order_status', 'completed')
            ->selectRaw('
                products.id,
                products.name,
                products.sku,
                products.category,
                products.price,
                SUM(order_details.quantity) as units_sold,
                SUM(order_details.quantity * order_details.price) as revenue
            ')
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.category', 'products.price')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'id'         => $p->id,
                'name'       => $p->name,
                'sku'        => $p->sku,
                'category'   => $p->category,
                'price'      => (float) $p->price,
                'units_sold' => (int)   $p->units_sold,
                'revenue'    => (float) $p->revenue,
            ]);

        // ── Revenue by category ───────────────────────────────────────────────
        $byCategory = OrderDetail::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('orders.order_status', 'completed')
            ->selectRaw('
                products.category,
                COUNT(DISTINCT orders.id) as order_count,
                SUM(order_details.quantity) as units_sold,
                SUM(order_details.quantity * order_details.price) as revenue
            ')
            ->groupBy('products.category')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn($r) => [
                'category'    => $r->category ?? 'Uncategorised',
                'order_count' => (int)   $r->order_count,
                'units_sold'  => (int)   $r->units_sold,
                'revenue'     => (float) $r->revenue,
            ]);

        // ── Inventory health ──────────────────────────────────────────────────
        $inventory = Products::select('id', 'name', 'sku', 'category', 'stock', 'status', 'price')
            ->orderBy('stock')
            ->get()
            ->map(fn($p) => [
                'id'       => $p->id,
                'name'     => $p->name,
                'sku'      => $p->sku,
                'category' => $p->category,
                'stock'    => (int)   $p->stock,
                'status'   => $p->status,
                'price'    => (float) $p->price,
                'low_stock'=> $p->stock <= 10,
                'out_stock'=> $p->stock === 0,
            ]);

        $lowStockCount = $inventory->where('low_stock', true)->where('out_stock', false)->count();
        $outStockCount = $inventory->where('out_stock', true)->count();

        // ── Sales trend per product (top 5, last 30 days) ────────────────────
        $salesTrend = OrderDetail::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('orders.order_status', 'completed')
            ->where('orders.order_date', '>=', $now->copy()->subDays(29))
            ->whereIn('products.id', $topProducts->take(5)->pluck('id'))
            ->selectRaw("
                products.name,
                DATE(orders.order_date) as date,
                SUM(order_details.quantity) as units
            ")
            ->groupByRaw('products.name, DATE(orders.order_date)')
            ->orderBy('date')
            ->get()
            ->groupBy('name')
            ->map(fn($rows, $name) => [
                'product' => $name,
                'data'    => $rows->map(fn($r) => [
                    'date'  => $r->date,
                    'units' => (int) $r->units,
                ])->values(),
            ])
            ->values();

        // ── Product KPIs ──────────────────────────────────────────────────────
        $totalProducts   = Products::count();
        $activeProducts  = Products::where('status', 'active')->count();
        $totalUnitsSold  = OrderDetail::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'completed')
            ->sum('order_details.quantity');
        $productRevenue  = OrderDetail::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('orders.order_status', 'completed')
            ->selectRaw('SUM(order_details.quantity * order_details.price) as total')
            ->value('total') ?? 0;

        return Inertia::render('admin/analytics/product-analytics', [
            'kpis' => [
                'total_products'  => (int)   $totalProducts,
                'active_products' => (int)   $activeProducts,
                'units_sold'      => (int)   $totalUnitsSold,
                'product_revenue' => (float) $productRevenue,
                'low_stock_count' => (int)   $lowStockCount,
                'out_stock_count' => (int)   $outStockCount,
            ],
            'top_products' => $topProducts,
            'by_category'  => $byCategory,
            'inventory'    => $inventory,
            'sales_trend'  => $salesTrend,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CUSTOMER INSIGHTS  →  admin/analytics/customers
    // ─────────────────────────────────────────────────────────────────────────

    public function customerInsights()
    {
        $now = Carbon::now();

        // ── KPIs ──────────────────────────────────────────────────────────────
        $totalCustomers    = Customer::count();
        $newThisMonth      = Customer::whereMonth('created_at', $now->month)
            ->whereYear('created_at',  $now->year)->count();
        $newLastMonth      = Customer::whereMonth('created_at', $now->copy()->subMonth()->month)
            ->whereYear('created_at',  $now->copy()->subMonth()->year)->count();
        $returningCustomers = Order::select('customer_id')
            ->groupBy('customer_id')
            ->havingRaw('COUNT(*) > 1')
            ->get()->count();
        $avgLifetimeValue  = Order::where('order_status', 'completed')
            ->selectRaw('customer_id, SUM(amount) as ltv')
            ->groupBy('customer_id')
            ->get()
            ->avg('ltv') ?? 0;

        // ── New customers per month (last 12) ─────────────────────────────────
        $newPerMonth = Customer::where('created_at', '>=', $now->copy()->subMonths(11)->startOfMonth())
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m')")
            ->orderBy('month')
            ->get()
            ->map(fn($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        // ── Top customers by spend ────────────────────────────────────────────
        $topCustomers = Order::where('order_status', 'completed')
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->selectRaw('
                customers.id,
                customers.full_name,
                customers.email,
                customers.phone,
                COUNT(orders.id)   as order_count,
                SUM(orders.amount) as total_spent
            ')
            ->groupBy('customers.id', 'customers.full_name', 'customers.email', 'customers.phone')
            ->orderByDesc('total_spent')
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'id'          => (string) $c->id,
                'full_name'   => $c->full_name,
                'email'       => $c->email,
                'phone'       => $c->phone,
                'order_count' => (int)   $c->order_count,
                'total_spent' => (float) $c->total_spent,
            ]);

        // ── Order frequency distribution ──────────────────────────────────────
        $frequency = Order::selectRaw('customer_id, COUNT(*) as order_count')
            ->groupBy('customer_id')
            ->get()
            ->groupBy(fn($r) => match (true) {
                $r->order_count === 1 => '1 order',
                $r->order_count <= 3  => '2–3 orders',
                $r->order_count <= 5  => '4–5 orders',
                default               => '6+ orders',
            })
            ->map(fn($g, $label) => ['label' => $label, 'count' => $g->count()])
            ->values();

        // ── Retention: customers who ordered in last 30 & 90 days ────────────
        $active30  = Order::where('order_date', '>=', $now->copy()->subDays(30))
            ->distinct('customer_id')->count('customer_id');
        $active90  = Order::where('order_date', '>=', $now->copy()->subDays(90))
            ->distinct('customer_id')->count('customer_id');

        // ── Recent customers ──────────────────────────────────────────────────
        $recentCustomers = Customer::orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn($c) => [
                'id'         => (string) $c->id,
                'full_name'  => $c->full_name,
                'email'      => $c->email,
                'phone'      => $c->phone,
                'created_at' => $c->created_at->toDateString(),
            ]);

        return Inertia::render('admin/analytics/customer-insights', [
            'kpis' => [
                'total_customers'     => (int)   $totalCustomers,
                'new_this_month'      => (int)   $newThisMonth,
                'new_last_month'      => (int)   $newLastMonth,
                'returning_customers' => (int)   $returningCustomers,
                'avg_lifetime_value'  => (float) $avgLifetimeValue,
                'active_30_days'      => (int)   $active30,
                'active_90_days'      => (int)   $active90,
            ],
            'new_per_month'    => $newPerMonth,
            'top_customers'    => $topCustomers,
            'frequency'        => $frequency,
            'recent_customers' => $recentCustomers,
        ]);
    }
}
