import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Tag, FileText, Bell, Search, Menu, ChevronRight,
  TrendingUp, TrendingDown, DollarSign, Package2, UserCheck,
  Eye, AlertTriangle, Clock, CheckCircle2, XCircle, Loader,
  ArrowRight, Zap, BookOpen,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  revenue:   { total: number; this_month: number; last_month: number; change: number };
  orders:    { total: number; this_month: number; pending: number; change: number };
  products:  { total: number; active: number; low_stock: number; out_stock: number };
  customers: { total: number; this_month: number; change: number };
}
interface RevenuePoint { date: string; label: string; total: number; orders: number }
interface RecentOrder  { id: string; customer: string; amount: number; status: string; order_date: string }
interface TopProduct   { id: number; name: string; category: string; units_sold: number; revenue: number }
interface RecentCustomer { id: string; full_name: string; email: string; joined: string }

interface Props {
  stats:             Stats;
  revenue_chart:     RevenuePoint[];
  status_breakdown:  Record<string, number>;
  recent_orders:     RecentOrder[];
  top_products:      TopProduct[];
  recent_customers:  RecentCustomer[];
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard, url: '/dashboard', sub: [] },
  { id: 'products',  label: 'Products',   icon: Package,  url: '', sub: [
    { label: 'All Products', url: '/products' },
    { label: 'Add Product',  url: '/add_product' },
  ]},
  { id: 'orders',    label: 'Orders',     icon: ShoppingCart, url: '', sub: [
    { label: 'All Orders', url: '/orders' },
  ]},
  { id: 'customers', label: 'Customers',  icon: Users, url: '/admin/customers', sub: [
    { label: 'All Customers', url: '/admin/customers' },
  ]},
  { id: 'analytics', label: 'Analytics',  icon: BarChart3, url: '', sub: [
    { label: 'Sales Report',       url: '/sales_report' },
    { label: 'Product Analytics',  url: '/product_analytics' },
    { label: 'Customer Insights',  url: '/customer_insights' },
  ]},
  { id: 'marketing', label: 'Marketing',  icon: Tag, url: '', sub: [
    { label: 'Blogs', url: '/blog' },
  ]},
  { id: 'reports',   label: 'Reports',    icon: FileText, url: '/reports', sub: [] },
  { id: 'settings',  label: 'Settings',   icon: Settings, url: '', sub: [
    { label: 'General Settings',  url: '/settings/general' },
    { label: 'Payment Settings',  url: '/settings/payment' },
    { label: 'Shipping Settings', url: '/settings/shipping' },
  ]},
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n >= 1_000_000
    ? `KSh ${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `KSh ${(n / 1_000).toFixed(1)}K`
    : `KSh ${n.toLocaleString()}`;

const statusStyle: Record<string, string> = {
  completed:      'bg-emerald-100 text-emerald-700',
  pending:        'bg-amber-100  text-amber-700',
  processing:     'bg-sky-100    text-sky-700',
  cancelled:      'bg-red-100    text-red-700',
  payment_failed: 'bg-rose-100   text-rose-700',
  shipped:        'bg-violet-100 text-violet-700',
};

const StatusIcon: Record<string, React.ReactNode> = {
  completed:      <CheckCircle2 className="w-3 h-3" />,
  pending:        <Clock        className="w-3 h-3" />,
  processing:     <Loader       className="w-3 h-3" />,
  cancelled:      <XCircle      className="w-3 h-3" />,
  payment_failed: <XCircle      className="w-3 h-3" />,
};

// ─── Tiny bar chart ───────────────────────────────────────────────────────────

const MiniChart: React.FC<{ data: RevenuePoint[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div className="flex items-end gap-[3px] h-16 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full rounded-sm bg-[#98a69e] opacity-70 group-hover:opacity-100 transition-all duration-200"
            style={{ height: `${Math.max(4, (d.total / max) * 56)}px` }}
          />
          {/* tooltip */}
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
            {d.label}<br />{fmt(d.total)}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const {
    stats, revenue_chart, status_breakdown,
    recent_orders, top_products, recent_customers,
  } = usePage<{ props: Props }>().props as unknown as Props;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav,   setActiveNav]   = useState('dashboard');

  const maxRevenue = Math.max(...(top_products?.map(p => p.revenue) ?? [1]));

  return (
    <div className="flex h-screen bg-[#F5F4F0] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`
        ${sidebarOpen ? 'w-60' : 'w-[60px]'}
        bg-[#1C1F1E] flex flex-col transition-all duration-300 ease-in-out flex-shrink-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 bg-[#98a69e] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm tracking-tight">L</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="text-white font-bold text-sm leading-none tracking-wide">LANTY</p>
              <p className="text-white/40 text-[10px] mt-0.5 tracking-widest uppercase">Essentials</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto scrollbar-none">
          {NAV.map((item) => {
            const active = activeNav === item.id;
            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.url) router.visit(item.url);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150
                    ${active
                      ? 'bg-[#98a69e] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/8'}
                  `}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                  )}
                  {sidebarOpen && item.sub.length > 0 && (
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? 'rotate-90' : ''}`} />
                  )}
                </button>

                {/* Submenu */}
                {sidebarOpen && active && item.sub.length > 0 && (
                  <div className="ml-7 mt-1 mb-1 space-y-0.5 border-l border-white/10 pl-3">
                    {item.sub.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => router.visit(s.url)}
                        className="block w-full text-left py-1.5 px-2 text-xs text-white/45 hover:text-white/80 rounded transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#98a69e] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">Admin User</p>
                <p className="text-white/35 text-[10px] truncate">admin@lanty.co.ke</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">Dashboard</h2>
              <p className="text-xs text-gray-400 mt-0.5">Welcome back, Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search…"
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98a69e]/30 w-52"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4 text-gray-500" />
              {(stats?.orders?.pending ?? 0) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Revenue */}
            <KpiCard
              label="Total Revenue"
              value={fmt(stats?.revenue?.total ?? 0)}
              sub={`${fmt(stats?.revenue?.this_month ?? 0)} this month`}
              change={stats?.revenue?.change ?? 0}
              icon={<DollarSign className="w-5 h-5" />}
              accent="#98a69e"
            />
            {/* Orders */}
            <KpiCard
              label="Total Orders"
              value={(stats?.orders?.total ?? 0).toLocaleString()}
              sub={`${stats?.orders?.pending ?? 0} pending`}
              change={stats?.orders?.change ?? 0}
              icon={<ShoppingCart className="w-5 h-5" />}
              accent="#6B9BB5"
            />
            {/* Products */}
            <KpiCard
              label="Products"
              value={(stats?.products?.total ?? 0).toLocaleString()}
              sub={`${stats?.products?.active ?? 0} active · ${stats?.products?.low_stock ?? 0} low stock`}
              change={null}
              icon={<Package2 className="w-5 h-5" />}
              accent="#B59E6B"
              warn={(stats?.products?.out_stock ?? 0) > 0 ? `${stats.products.out_stock} out of stock` : undefined}
            />
            {/* Customers */}
            <KpiCard
              label="Customers"
              value={(stats?.customers?.total ?? 0).toLocaleString()}
              sub={`+${stats?.customers?.this_month ?? 0} this month`}
              change={stats?.customers?.change ?? 0}
              icon={<UserCheck className="w-5 h-5" />}
              accent="#A06B9E"
            />
          </div>

          {/* ── Revenue chart + Status breakdown ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Revenue — Last 14 Days</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Completed orders only</p>
                </div>
                <span className="text-xs text-gray-400">
                  {revenue_chart?.at(0)?.label} – {revenue_chart?.at(-1)?.label}
                </span>
              </div>
              {revenue_chart && <MiniChart data={revenue_chart} />}
              {/* X-axis labels */}
              <div className="flex justify-between mt-2">
                {revenue_chart?.filter((_, i) => i % 7 === 0 || i === revenue_chart.length - 1).map((d, i) => (
                  <span key={i} className="text-[10px] text-gray-400">{d.label}</span>
                ))}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                {Object.entries(status_breakdown ?? {}).map(([status, count]) => {
                  const total = Object.values(status_breakdown).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs capitalize text-gray-600 flex items-center gap-1.5">
                          {StatusIcon[status]}
                          {status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-gray-800">{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#98a69e] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Recent orders + Top products ── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                <button
                  onClick={() => router.visit('/orders')}
                  className="text-xs text-[#98a69e] flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {(recent_orders ?? []).map((o) => (
                  <div key={o.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{o.customer}</p>
                      <p className="text-[10px] text-gray-400">{o.order_date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-900">KSh {o.amount.toLocaleString()}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${statusStyle[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {StatusIcon[o.status]}
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(recent_orders ?? []).length === 0 && (
                  <p className="text-center py-8 text-sm text-gray-400">No orders yet</p>
                )}
              </div>
            </div>

            {/* Top products */}
            <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Top Products</h3>
                <button
                  onClick={() => router.visit('/product_analytics')}
                  className="text-xs text-[#98a69e] flex items-center gap-1 hover:underline"
                >
                  Analytics <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {(top_products ?? []).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                    <span className="w-5 text-xs font-black text-gray-300 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                      {/* Revenue bar */}
                      <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden w-full">
                        <div
                          className="h-full rounded-full bg-[#98a69e]/70"
                          style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-gray-900">{fmt(p.revenue)}</p>
                      <p className="text-[10px] text-gray-400">{p.units_sold} units</p>
                    </div>
                  </div>
                ))}
                {(top_products ?? []).length === 0 && (
                  <p className="text-center py-8 text-sm text-gray-400">No sales data yet</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Quick actions + Recent customers ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-gray-200/80 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Add Product',    icon: Package,      url: '/add_product',         color: 'text-[#98a69e]' },
                  { label: 'All Orders',     icon: ShoppingCart, url: '/orders',              color: 'text-sky-500' },
                  { label: 'Customers',      icon: Users,        url: '/admin/customers',     color: 'text-violet-500' },
                  { label: 'Sales Report',   icon: BarChart3,    url: '/sales_report',        color: 'text-amber-500' },
                  { label: 'Blog',           icon: BookOpen,     url: '/blog',          color: 'text-pink-500' },
                  { label: 'View Site',      icon: Eye,          url: '/',                    color: 'text-gray-400' },
                ].map(({ label, icon: Icon, url, color }) => (
                  <button
                    key={label}
                    onClick={() => router.visit(url)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-dashed border-gray-200 hover:border-[#98a69e]/60 hover:bg-[#98a69e]/5 transition-all group"
                  >
                    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
                    <span className="text-[11px] font-medium text-gray-600">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent customers */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200/80 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Recent Customers</h3>
                <button
                  onClick={() => router.visit('/admin/customers')}
                  className="text-xs text-[#98a69e] flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {(recent_customers ?? []).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#98a69e]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#98a69e] text-xs font-bold">
                        {c.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{c.full_name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{c.joined}</span>
                  </div>
                ))}
                {(recent_customers ?? []).length === 0 && (
                  <p className="text-center py-8 text-sm text-gray-400">No customers yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Alerts row */}
          {((stats?.products?.out_stock ?? 0) > 0 || (stats?.orders?.pending ?? 0) > 0) && (
            <div className="flex flex-wrap gap-3">
              {(stats?.products?.out_stock ?? 0) > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{stats.products.out_stock} product{stats.products.out_stock > 1 ? 's' : ''} out of stock</span>
                  <button onClick={() => router.visit('/products')} className="font-semibold underline ml-1">Fix now</button>
                </div>
              )}
              {(stats?.orders?.pending ?? 0) > 0 && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{stats.orders.pending} order{stats.orders.pending > 1 ? 's' : ''} awaiting processing</span>
                  <button onClick={() => router.visit('/orders')} className="font-semibold underline ml-1">Review</button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KpiCard: React.FC<{
  label: string; value: string; sub: string;
  change: number | null; icon: React.ReactNode; accent: string; warn?: string;
}> = ({ label, value, sub, change, icon, accent, warn }) => (
  <div className="bg-white rounded-xl border border-gray-200/80 p-5 relative overflow-hidden">
    {/* accent stripe */}
    <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: accent }} />
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ background: accent + '18' }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      {change !== null && (
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <p className="text-xl font-black text-gray-900 leading-none mb-1">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-[10px] text-gray-400 mt-1">{sub}</p>
    {warn && (
      <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600 font-medium">
        <AlertTriangle className="w-3 h-3" /> {warn}
      </div>
    )}
  </div>
);

export default Dashboard;
