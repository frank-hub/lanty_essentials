import React, { useMemo } from 'react';
import { usePage, router } from '@inertiajs/react';
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart,
    BarChart2, CheckCircle, Clock, Zap, AlertTriangle,
    ArrowLeft, Download, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Kpis {
    total_revenue: number;
    revenue_this_month: number;
    revenue_last_month: number;
    total_orders: number;
    orders_this_month: number;
    avg_order_value: number;
    completed_orders: number;
}

interface DailyRevenue {
    date: string;
    total: number;
    orders: number;
}

interface MonthlyRevenue {
    month: string;
    total: number;
    orders: number;
}

interface ByStatus {
    status: string;
    count: number;
    total: number;
}

interface RecentOrder {
    id: string;
    name: string;
    amount: number;
    status: string;
    order_date: string;
}

interface PageProps {
    kpis: Kpis;
    daily_revenue: DailyRevenue[];
    monthly_revenue: MonthlyRevenue[];
    by_status: ByStatus[];
    recent_orders: RecentOrder[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtKes = (n: number) =>
    n >= 1_000_000
        ? `KSh ${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
        ? `KSh ${(n / 1_000).toFixed(1)}K`
        : `KSh ${n.toLocaleString()}`;

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });

const fmtMonth = (m: string) => {
    const [y, mo] = m.split('-');
    return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en-KE', { month: 'short', year: '2-digit' });
};

const pctChange = (curr: number, prev: number) => {
    if (!prev) return null;
    return (((curr - prev) / prev) * 100).toFixed(1);
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string; Icon: React.FC<any> }> = {
    completed:     { label: 'Completed',     bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500', Icon: CheckCircle },
    pending:       { label: 'Pending',       bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-400',   Icon: Clock },
    processing:    { label: 'Processing',    bg: 'bg-blue-50',     text: 'text-blue-700',     dot: 'bg-blue-500',    Icon: Zap },
    cancelled:     { label: 'Cancelled',     bg: 'bg-red-50',      text: 'text-red-700',      dot: 'bg-red-500',     Icon: AlertTriangle },
    payment_failed:{ label: 'Failed',        bg: 'bg-orange-50',   text: 'text-orange-700',   dot: 'bg-orange-500',  Icon: AlertTriangle },
};

const PIE_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#f97316'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
    label, value, sub, trend, icon: Icon, accent,
}: {
    label: string; value: string; sub?: string;
    trend?: { pct: string | null; positive: boolean };
    icon: React.FC<any>; accent: string;
}) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
                <div className={`p-2 rounded-xl ${accent}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            {trend?.pct && (
                <div className={`flex items-center gap-1 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {trend.positive ? '+' : ''}{trend.pct}% vs last month
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
                    {p.name === 'total' ? fmtKes(p.value) : `${p.value} orders`}
                </p>
            ))}
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalesReport() {
    const { kpis, daily_revenue, monthly_revenue, by_status, recent_orders } =
        usePage<PageProps>().props;

    const revTrend = useMemo(
        () => ({
            pct: pctChange(kpis.revenue_this_month, kpis.revenue_last_month),
            positive: kpis.revenue_this_month >= kpis.revenue_last_month,
        }),
        [kpis],
    );

    const completionRate = kpis.total_orders
        ? ((kpis.completed_orders / kpis.total_orders) * 100).toFixed(1)
        : '0';

    const dailyChartData = useMemo(
        () => daily_revenue.map(d => ({ ...d, label: fmtDate(d.date) })),
        [daily_revenue],
    );

    const monthlyChartData = useMemo(
        () => monthly_revenue.map(m => ({ ...m, label: fmtMonth(m.month) })),
        [monthly_revenue],
    );

    const pieData = useMemo(
        () => by_status.map(s => ({ name: STATUS_CONFIG[s.status]?.label ?? s.status, value: s.count })),
        [by_status],
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.visit('/dashboard')}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-emerald-600" /> Sales Report
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">Revenue & order performance</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* KPI Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    <KpiCard
                        label="Total Revenue" icon={DollarSign} accent="bg-emerald-100 text-emerald-600"
                        value={fmtKes(kpis.total_revenue)} sub="All completed orders"
                    />
                    <KpiCard
                        label="This Month" icon={TrendingUp} accent="bg-blue-100 text-blue-600"
                        value={fmtKes(kpis.revenue_this_month)} trend={revTrend}
                    />
                    <KpiCard
                        label="Total Orders" icon={ShoppingCart} accent="bg-violet-100 text-violet-600"
                        value={kpis.total_orders.toLocaleString()} sub={`${kpis.orders_this_month} this month`}
                    />
                    <KpiCard
                        label="Avg Order Value" icon={BarChart2} accent="bg-amber-100 text-amber-600"
                        value={fmtKes(kpis.avg_order_value)} sub="Completed orders only"
                    />
                    <KpiCard
                        label="Completion Rate" icon={CheckCircle} accent="bg-emerald-100 text-emerald-600"
                        value={`${completionRate}%`} sub={`${kpis.completed_orders} completed`}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Daily Revenue — takes 2/3 */}
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Daily Revenue</h2>
                                <p className="text-xs text-gray-400">Last 30 days</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" /> Revenue
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-0.5 bg-blue-400 rounded inline-block border-dashed" /> Orders
                                </span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={dailyChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={4} />
                                <YAxis yAxisId="rev" tickFormatter={v => `${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={42} />
                                <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={28} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line yAxisId="rev" type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={false} name="total" />
                                <Line yAxisId="ord" type="monotone" dataKey="orders" stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status Pie — takes 1/3 */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-gray-900 mb-1">Orders by Status</h2>
                        <p className="text-xs text-gray-400 mb-4">All time breakdown</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                    paddingAngle={2} dataKey="value">
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: any) => [v, 'Orders']} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-2">
                            {by_status.map((s, i) => (
                                <div key={s.status} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                        <span className="text-gray-600">{STATUS_CONFIG[s.status]?.label ?? s.status}</span>
                                    </span>
                                    <span className="font-medium text-gray-800">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-1">Monthly Revenue</h2>
                    <p className="text-xs text-gray-400 mb-6">Last 12 months</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={24}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                            <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={42} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} name="total" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-50">
                        <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Latest 10 orders</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {['Order ID', 'Customer', 'Date', 'Status', 'Amount'].map(h => (
                                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recent_orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            ORD-{order.id.substring(0, 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{order.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(order.order_date).toLocaleDateString('en-KE', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900 text-right tabular-nums">
                                            KSh {order.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
