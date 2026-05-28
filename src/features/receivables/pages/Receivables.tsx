import { useState, useEffect } from "react";
import { Layout } from "@/shared/components/Layout";
import { Input } from "@/shared/components/ui/input";
import {
  Search, X, Wallet, TrendingUp, AlertCircle, Users, Building2,
} from "lucide-react";
import { useReceivables } from "../index";
import { Receivable } from "../types/receivables.types";

/* ─────────────────────────────── helpers ─────────────────────────────── */

const STATUS_META: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  ongoing: { label: "Ongoing", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  completed: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  delayed: { label: "Delayed", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  planned: { label: "Planned", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? STATUS_META.planned;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const rs = (n: number) => `Rs ${Number(n || 0).toLocaleString("en-IN")}`;

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  iconColor: string;
  sub?: string;
}
const StatCard = ({ label, value, icon, accent, iconColor, sub }: StatCardProps) => (
  <div className="group relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/60 pointer-events-none" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`${accent} p-2.5 rounded-xl`}>
        <div className={`${iconColor} w-5 h-5`}>{icon}</div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────── main page ─────────────────────────────── */

export default function Receivables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchDebouncing, setIsSearchDebouncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed" | "delayed" | "planned">("all");
  const [outstandingOnly, setOutstandingOnly] = useState(false);

  useEffect(() => {
    setIsSearchDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearchDebouncing(false);
    }, 500);
    return () => {
      clearTimeout(timer);
      setIsSearchDebouncing(false);
    };
  }, [searchTerm]);

  const { data, isLoading } = useReceivables({
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(outstandingOnly && { outstanding_only: true }),
  });

  const rows: Receivable[] = data?.data ?? [];
  const summary = data?.summary;

  /* ── loading ── */
  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading receivables…</p>
        </div>
      </div>
    </Layout>
  );

  /* ── render ── */
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* ── PAGE HEADER ── */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600">Construction Management System</span>
            </div>
            <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Receivables</h1>
            <p className="text-slate-400 text-sm mt-0.5">Money still owed by clients across projects (budget minus payments received)</p>
          </div>

          {/* ── SUMMARY ── */}
          {summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="To Collect"
                value={rs(summary.total_remaining)}
                icon={<AlertCircle className="w-5 h-5" />}
                accent="bg-amber-100" iconColor="text-amber-600"
                sub="Outstanding from clients"
              />
              <StatCard
                label="Collected"
                value={rs(summary.total_received)}
                icon={<TrendingUp className="w-5 h-5" />}
                accent="bg-emerald-100" iconColor="text-emerald-600"
                sub="Received so far"
              />
              <StatCard
                label="Total Budget"
                value={rs(summary.total_budget)}
                icon={<Wallet className="w-5 h-5" />}
                accent="bg-slate-100" iconColor="text-slate-600"
                sub={`${summary.projects_count} projects`}
              />
              <StatCard
                label="Clients With Dues"
                value={String(summary.clients_with_dues)}
                icon={<Users className="w-5 h-5" />}
                accent="bg-sky-100" iconColor="text-sky-600"
                sub="Owe money currently"
              />
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by project, client, or location…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 border-slate-200 rounded-xl focus-visible:ring-amber-300 bg-slate-50 focus:bg-white transition-colors"
                />
                {isSearchDebouncing && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {(["all", "ongoing", "completed", "delayed", "planned"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                  >
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setOutstandingOnly(v => !v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${outstandingOnly
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
              >
                Outstanding only
              </button>

              {(debouncedSearchTerm || statusFilter !== "all" || outstandingOnly) && (
                <button
                  onClick={() => { setSearchTerm(""); setDebouncedSearchTerm(""); setStatusFilter("all"); setOutstandingOnly(false); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ── TABLE ── */}
          {rows.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No receivables found</h3>
              <p className="text-sm text-slate-400">
                {debouncedSearchTerm || statusFilter !== "all" || outstandingOnly
                  ? "Try adjusting your filters"
                  : "Add projects with a budget and record client payments to see dues here"}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left">
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Project</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Client</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Budget</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Received</th>
                      <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r) => {
                      const pct = r.budget > 0 ? Math.min(100, Math.round((r.received / r.budget) * 100)) : 0;
                      const settled = r.remaining <= 0;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-900 line-clamp-1">{r.name}</div>
                            <div className="text-[12px] text-slate-400 line-clamp-1">{r.location}</div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">{r.client_name}</td>
                          <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                          <td className="px-5 py-4 text-right tabular-nums text-slate-700">{rs(r.budget)}</td>
                          <td className="px-5 py-4 text-right">
                            <div className="tabular-nums text-emerald-600 font-medium">{rs(r.received)}</div>
                            <div className="mt-1 ml-auto w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className={`tabular-nums font-bold ${settled ? "text-slate-400" : "text-amber-600"}`}>
                              {settled ? "Settled" : rs(r.remaining)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
