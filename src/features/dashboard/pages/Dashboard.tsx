import { Layout } from "@/components/Layout";
import { DashboardSkeleton } from "@/components/PageSkeleton";
import { useDashboardOverview } from "../index";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  UserCheck,
  IndianRupee,
  Minus,
} from "lucide-react";

/* ─────────────────────── helpers ─────────────────────── */

const fmt = (val: number) => {
  const abs = Math.abs(val);
  if (abs >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toFixed(0)}`;
};

const TrendPill = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
  const isGood = inverted ? value <= 0 : value >= 0;
  const isZero = value === 0;

  if (isZero)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
        <Minus className="w-2.5 h-2.5" /> 0%
      </span>
    );

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold
        ${isGood ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
    >
      {isGood ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
      {value > 0 ? "+" : ""}{value}%
    </span>
  );
};

/* ─────────────────────── custom tooltip ─────────────────────── */

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-800">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────── custom pie label ─────────────────────── */

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
  if (value < 5) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      className="text-[11px] font-bold" fontSize={11} fontWeight={700}>
      {value.toFixed(1)}%
    </text>
  );
};

/* ─────────────────────── pie colors ─────────────────────── */

const PIE_COLORS = ["#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#F43F5E", "#06B6D4"];

/* ─────────────────────── dashboard ─────────────────────── */

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboardOverview();
  const data = dashboardData?.data;

  if (isLoading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const ms = data?.main_stats;
  const qs = data?.quick_stats;
  const monthly = data?.monthly_trends ?? [];
  const expenses = data?.expense_distribution ?? [];

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* ── HEADER ── */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-red-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[.2em] uppercase text-red-600">Construction CMS</span>
            </div>
            <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">Financial overview and project summary</p>
          </div>

          {data && (
            <>
              {/* ── MAIN STATS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Revenue */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-emerald-500">Revenue</p>
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {fmt(ms?.total_revenue ?? 0)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendPill value={ms?.revenue_trend ?? 0} />
                    <span className="text-[10px] text-slate-400">vs last month</span>
                  </div>
                </div>

                {/* Expenses */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-rose-500">Expenses</p>
                    <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {fmt(ms?.total_expenses ?? 0)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendPill value={ms?.expenses_trend ?? 0} inverted />
                    <span className="text-[10px] text-slate-400">vs last month</span>
                  </div>
                </div>

                {/* Profit */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <p className={`text-[10px] font-bold tracking-[.18em] uppercase ${(ms?.profit ?? 0) >= 0 ? "text-blue-500" : "text-rose-500"}`}>
                      {(ms?.profit ?? 0) >= 0 ? "Profit" : "Loss"}
                    </p>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${(ms?.profit ?? 0) >= 0 ? "bg-blue-50" : "bg-rose-50"}`}>
                      <IndianRupee className={`w-4 h-4 ${(ms?.profit ?? 0) >= 0 ? "text-blue-500" : "text-rose-500"}`} />
                    </div>
                  </div>
                  <p className={`text-2xl font-extrabold tabular-nums leading-none ${(ms?.profit ?? 0) >= 0 ? "text-blue-600" : "text-rose-600"}`}>
                    {fmt(ms?.profit ?? 0)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendPill value={ms?.profit_trend ?? 0} />
                    <span className="text-[10px] text-slate-400">vs last month</span>
                  </div>
                </div>

                {/* Labor Cost */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-violet-500">Labor Cost</p>
                    <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                      <Users className="w-4 h-4 text-violet-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-none">
                    {fmt(ms?.labor_cost ?? 0)}
                  </p>
                  {(ms?.material_cost ?? 0) > 0 && (
                    <p className="text-[10px] text-slate-400 mt-2">
                      + Material: {fmt(ms?.material_cost ?? 0)}
                    </p>
                  )}
                  {(ms?.material_cost ?? 0) === 0 && (
                    <p className="text-[10px] text-slate-400 mt-2">No material cost</p>
                  )}
                </div>
              </div>

              {/* ── QUICK STATS ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-amber-500">Active Projects</p>
                    <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-tight">
                      {qs?.active_projects ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">In progress</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-blue-500">Employees</p>
                    <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-tight">
                      {qs?.total_employees ?? 0}
                    </p>
                    <p className="text-[11px] text-slate-400">Total workforce</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-emerald-500">Attendance Rate</p>
                    <p className="text-2xl font-extrabold text-emerald-700 tabular-nums leading-tight">
                      {qs?.attendance_rate?.toFixed(1) ?? 0}%
                    </p>
                    <p className="text-[11px] text-slate-400">Today's rate</p>
                  </div>
                </div>
              </div>

              {/* ── CHARTS ── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Monthly Trends — spans 3 cols */}
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400 mb-0.5">Overview</p>
                      <h3 className="text-base font-extrabold text-slate-900">Monthly Trends</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-emerald-400 rounded inline-block" /> Revenue
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-rose-400 rounded inline-block" /> Expenses
                      </span>
                    </div>
                  </div>

                  {monthly.length === 0 ? (
                    <div className="h-52 flex items-center justify-center text-sm text-slate-400">
                      No trend data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={[...monthly].reverse()} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.12} />
                            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: "#94A3B8" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => fmt(v)}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          fill="url(#gradRevenue)"
                          dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="expenses"
                          stroke="#F43F5E"
                          strokeWidth={2.5}
                          fill="url(#gradExpenses)"
                          dot={{ r: 4, fill: "#F43F5E", strokeWidth: 0 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Expense Distribution — spans 2 cols */}
                <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="mb-6">
                    <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400 mb-0.5">Breakdown</p>
                    <h3 className="text-base font-extrabold text-slate-900">Expense Distribution</h3>
                  </div>

                  {expenses.length === 0 ? (
                    <div className="h-52 flex items-center justify-center text-sm text-slate-400">
                      No expense data available
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={expenses}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={44}
                            paddingAngle={3}
                            labelLine={false}
                            label={<PieLabel />}
                          >
                            {expenses.map((_: any, index: number) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string, props: any) => [
                              `${fmt(props.payload.amount)} (${value.toFixed(1)}%)`,
                              name,
                            ]}
                            contentStyle={{
                              borderRadius: "12px",
                              border: "1px solid #E2E8F0",
                              fontSize: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* legend */}
                      <div className="mt-4 space-y-2">
                        {expenses.map((item: any, i: number) => (
                          <div key={item.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                              />
                              <span className="text-slate-600 font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400">{item.value.toFixed(1)}%</span>
                              <span className="font-bold text-slate-800 tabular-nums">{fmt(item.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── TOTAL EXPENSE SUMMARY BAR ── */}
              {expenses.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400 mb-4">Expense Composition</p>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
                    {expenses.map((item: any, i: number) => (
                      <div
                        key={item.name}
                        style={{
                          width: `${item.value}%`,
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                        title={`${item.name}: ${item.value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {expenses.map((item: any, i: number) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-slate-500">{item.name}</span>
                        <span className="font-bold text-slate-800">{fmt(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}