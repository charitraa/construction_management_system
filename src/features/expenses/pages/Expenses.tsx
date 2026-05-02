import { useState, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Search, Calendar, DollarSign, TrendingUp, Wallet,
  PieChart, X, ChevronLeft, ChevronRight, Briefcase,
  Trash2, Edit2, Eye, Download, Package, Settings2,
  ArrowUpRight, Hash,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  useListExpenses, useCreateExpense, useDeleteExpense, useGetExpense,
  useUpdateExpense, useGetExpenseStats, useExportExpenses, useListProjects,
} from "../index";

/* ─────────────────────── category config ─────────────────────── */

const CATEGORY_META: Record<string, { bg: string; text: string; border: string; dot: string; icon: React.ReactNode }> = {
  Labor: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-400", icon: <Briefcase className="w-3 h-3" /> },
  Materials: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400", icon: <Package className="w-3 h-3" /> },
  Equipment: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-400", icon: <Settings2 className="w-3 h-3" /> },
  Advance: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400", icon: <Wallet className="w-3 h-3" /> },
  Other: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400", icon: <DollarSign className="w-3 h-3" /> },
};

const CAT_BAR_COLOR: Record<string, string> = {
  Labor: "bg-sky-400", Materials: "bg-emerald-400",
  Equipment: "bg-violet-400", Advance: "bg-amber-400", Other: "bg-slate-400",
};

const getCM = (cat: string) => CATEGORY_META[cat] ?? CATEGORY_META.Other;

const CategoryBadge = ({ category }: { category: string }) => {
  const m = getCM(category);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {category}
    </span>
  );
};

const ALL_CATEGORIES = ["Labor", "Materials", "Equipment", "Advance", "Other"];

const fmtINR = (n: number) =>
  n >= 1e7 ? `₹${(n / 1e7).toFixed(2)}Cr`
    : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L`
      : `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─────────────────────── stat card ─────────────────────── */

const StatCard = ({
  label, value, sub, accent, iconColor, icon,
}: { label: string; value: string; sub: string; accent: string; iconColor: string; icon: React.ReactNode }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums leading-none">{value}</p>
        <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
      </div>
      <div className={`${accent} p-2.5 rounded-xl`}>
        <div className={`${iconColor} w-5 h-5`}>{icon}</div>
      </div>
    </div>
  </div>
);

/* ─────────────────────── field label ─────────────────────── */

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 mb-1.5">
    {children} <span className="text-rose-400 normal-case tracking-normal">*</span>
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[11px] text-rose-500 mt-1 font-medium">{msg}</p> : null;

/* ─────────────────────── shared form ─────────────────────── */

interface ExpenseForm {
  description: string; category: string;
  amount: string; project: string; date: string;
}

const ExpenseFormBody = ({
  form, setForm, errors, setErrors, projects, expenses,
}: {
  form: ExpenseForm; setForm: (f: ExpenseForm) => void;
  errors: Record<string, string>; setErrors: (e: Record<string, string>) => void;
  projects: any[]; expenses: any[];
}) => {
  const cats = [...new Set([...expenses.map((e: any) => e.category), ...ALL_CATEGORIES])];
  const clear = (k: string) => { if (errors[k]) setErrors({ ...errors, [k]: "" }); };

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Description</FieldLabel>
        <Input value={form.description}
          onChange={e => { setForm({ ...form, description: e.target.value }); clear("description"); }}
          placeholder="e.g. Steel rebar supply — Phase 2"
          className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${errors.description ? "border-rose-400" : ""}`}
        />
        <FieldError msg={errors.description} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Category</FieldLabel>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300">
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Amount (₹)</FieldLabel>
          <Input type="number" value={form.amount}
            onChange={e => { setForm({ ...form, amount: e.target.value }); clear("amount"); }}
            placeholder="e.g. 45000"
            className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${errors.amount ? "border-rose-400" : ""}`}
          />
          <FieldError msg={errors.amount} />
        </div>
      </div>

      <div>
        <FieldLabel>Project</FieldLabel>
        <select value={form.project} onChange={e => { setForm({ ...form, project: e.target.value }); clear("project"); }}
          className={`w-full px-3 py-2.5 border rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300 ${errors.project ? "border-rose-400" : "border-slate-200"}`}>
          <option value="">— Select project —</option>
          {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <FieldError msg={errors.project} />
      </div>

      <div>
        <FieldLabel>Date</FieldLabel>
        <Input type="date" value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="rounded-xl border-slate-200 focus-visible:ring-amber-300"
        />
      </div>
    </div>
  );
};

/* ─────────────────────── main page ─────────────────────── */

export default function Expenses() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const blankForm: ExpenseForm = {
    description: "", category: "Labor", amount: "", project: "",
    date: new Date().toISOString().split("T")[0],
  };
  const [form, setForm] = useState<ExpenseForm>(blankForm);
  const [editForm, setEditForm] = useState<ExpenseForm>(blankForm);

  const { data: expensesData, isLoading } = useListExpenses({
    page: currentPage, page_size: 10,
    search: debouncedSearch || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    project: projectFilter !== "all" ? projectFilter : undefined,
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
  });
  const { data: projectsData } = useListProjects();
  const { data: statsData } = useGetExpenseStats();
  const { data: selectedData, isLoading: selectedLoading } = useGetExpense(selectedId ?? "");
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const exportExpenses = useExportExpenses();

  const expenses = expensesData?.results?.data ?? [];
  const projects = projectsData?.data ?? [];
  const totalCount = expensesData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const stats = useMemo(() => {
    const d = statsData?.data;
    return {
      total: d?.total_expenses ?? 0,
      average: d?.average_expense ?? 0,
      highest: d?.highest_expense ?? 0,
      count: d?.transaction_count ?? 0,
      breakdown: (d?.category_breakdown ?? {}) as Record<string, number>,
    };
  }, [statsData]);

  /* debounce */
  useEffect(() => {
    setIsDebouncing(true);
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setIsDebouncing(false); }, 450);
    return () => { clearTimeout(t); setIsDebouncing(false); };
  }, [searchTerm]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, categoryFilter, projectFilter, dateRange.start, dateRange.end]);

  /* validation */
  const validate = (f: ExpenseForm) => {
    const e: Record<string, string> = {};
    if (!f.description.trim()) e.description = "Description is required";
    if (!f.amount.trim() || isNaN(+f.amount) || +f.amount <= 0) e.amount = "Enter a valid positive amount";
    if (!f.project) e.project = "Select a project";
    return e;
  };

  const handleAdd = () => {
    const errs = validate(form);
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    createExpense.mutate(form);
    setOpenDialog(false);
    setFormErrors({});
  };

  const handleEdit = () => {
    const errs = validate(editForm);
    setEditErrors(errs);
    if (Object.keys(errs).length || !selectedId) return;
    updateExpense.mutate({ id: selectedId, data: editForm });
    setEditDialog(false);
    setEditErrors({});
  };

  const handleDelete = (id: string) => deleteExpense.mutate(id, { onSuccess: () => setShowDeleteConfirm(null) });

  const openAdd = () => {
    setForm({ ...blankForm, project: projects[0]?.id ?? "" });
    setFormErrors({});
    setOpenDialog(true);
  };

  const openView = (id: string) => { setSelectedId(id); setViewDialog(true); };

  const openEdit = (exp: any) => {
    setEditForm({ description: exp.description, category: exp.category, amount: exp.amount, project: exp.project ?? "", date: exp.date });
    setSelectedId(exp.id);
    setEditErrors({});
    setEditDialog(true);
  };

  const clearFilters = () => { setSearchTerm(""); setCategoryFilter("all"); setProjectFilter("all"); setDateRange({ start: "", end: "" }); setCurrentPage(1); };

  const hasFilters = debouncedSearch || categoryFilter !== "all" || projectFilter !== "all" || dateRange.start || dateRange.end;

  /* category bar chart max */
  const maxCat = Math.max(...Object.values(stats.breakdown), 1);

  /* ── loading ── */
  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading expenses…</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-red-500 rounded-full" />
                <span className="text-[10px] font-bold tracking-[.2em] uppercase text-red-600">Construction CMS</span>
              </div>
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Expenses</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track and manage project expenditures</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => exportExpenses.mutate({ category: categoryFilter !== "all" ? categoryFilter : undefined, start_date: dateRange.start || undefined, end_date: dateRange.end || undefined })}
                disabled={exportExpenses.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportExpenses.isPending ? "Exporting…" : "Export CSV"}
              </button>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Spent" value={fmtINR(stats.total)} sub={`${stats.count} transactions`} accent="bg-slate-100" iconColor="text-slate-600" icon={<Wallet className="w-5 h-5" />} />
            <StatCard label="Average" value={fmtINR(stats.average)} sub="Per transaction" accent="bg-sky-100" iconColor="text-sky-600" icon={<TrendingUp className="w-5 h-5" />} />
            <StatCard label="Highest" value={fmtINR(stats.highest)} sub="Single transaction" accent="bg-violet-100" iconColor="text-violet-600" icon={<ArrowUpRight className="w-5 h-5" />} />
            <StatCard label="Categories" value={String(Object.keys(stats.breakdown).filter(k => stats.breakdown[k] > 0).length)} sub="Active" accent="bg-amber-100" iconColor="text-amber-600" icon={<PieChart className="w-5 h-5" />} />
          </div>

          {/* ── CATEGORY BREAKDOWN ── */}
          {Object.keys(stats.breakdown).length > 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400 mb-4">Spend by Category</p>
              <div className="space-y-3">
                {Object.entries(stats.breakdown).map(([cat, amount]) => {
                  const pct = Math.round((amount / maxCat) * 100);
                  const m = getCM(cat);
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-semibold ${m.text}`}>{cat}</span>
                        <span className="text-xs font-bold text-slate-700">{fmtINR(amount)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${CAT_BAR_COLOR[cat] ?? "bg-slate-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* search */}
              <div className="relative flex-1">
                {isDebouncing
                  ? <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin" />
                  : <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                <Input value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by description…"
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-amber-300 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              {/* category select */}
              <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
                <option value="all">All Categories</option>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* project select */}
              <select value={projectFilter} onChange={e => { setProjectFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300">
                <option value="all">All Projects</option>
                {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* date range */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="date" value={dateRange.start}
                  onChange={e => { setDateRange({ ...dateRange, start: e.target.value }); setCurrentPage(1); }}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-amber-300 w-full sm:w-44"
                />
              </div>
              <div className="flex items-center text-slate-300 text-sm px-1 hidden sm:flex">→</div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input type="date" value={dateRange.end}
                  onChange={e => { setDateRange({ ...dateRange, end: e.target.value }); setCurrentPage(1); }}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-amber-300 w-full sm:w-44"
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all ml-auto">
                  <X className="w-3.5 h-3.5" /> Clear all
                </button>
              )}
            </div>

            {/* active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2">
                {[
                  debouncedSearch && { label: `"${debouncedSearch}"`, onRemove: () => setSearchTerm("") },
                  categoryFilter !== "all" && { label: categoryFilter, onRemove: () => setCategoryFilter("all") },
                  projectFilter !== "all" && { label: projects.find((p: any) => p.id === projectFilter)?.name ?? projectFilter, onRemove: () => setProjectFilter("all") },
                  dateRange.start && { label: `From ${dateRange.start}`, onRemove: () => setDateRange(d => ({ ...d, start: "" })) },
                  dateRange.end && { label: `To ${dateRange.end}`, onRemove: () => setDateRange(d => ({ ...d, end: "" })) },
                ].filter(Boolean).map((chip: any, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold rounded-full">
                    {chip.label}
                    <button onClick={chip.onRemove} className="hover:text-amber-900"><X className="w-2.5 h-2.5" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── TABLE ── */}
          {expenses.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No expenses found</h3>
              <p className="text-sm text-slate-400 mb-5">
                {hasFilters ? "Try adjusting your filters" : "Get started by recording your first expense"}
              </p>
              {!hasFilters && (
                <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all">
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        {["Date", "Description", "Category", "Project", "Amount", ""].map((h, i) => (
                          <th key={i} className={`px-5 py-3.5 text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 ${i === 4 ? "text-right" : i === 5 ? "text-center" : "text-left"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {expenses.map((exp: any) => (
                        <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                              {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-800 max-w-[200px] truncate">
                            {exp.description}
                          </td>
                          <td className="px-5 py-3.5">
                            <CategoryBadge category={exp.category} />
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 max-w-[140px] truncate">
                            {projects.find((p: any) => p.id === exp.project)?.name ?? exp.project ?? "—"}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            ₹{parseFloat(exp.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openView(exp.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                              <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setShowDeleteConfirm(exp.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50/70">
                        <td colSpan={4} className="px-5 py-3.5 text-[11px] font-bold tracking-[.12em] uppercase text-slate-400">
                          Page Total
                        </td>
                        <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 tabular-nums">
                          ₹{expenses.reduce((s: number, e: any) => s + parseFloat(e.amount), 0).toLocaleString("en-IN")}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, totalCount)} of <span className="font-semibold text-slate-600">{totalCount}</span> expenses
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let n: number;
                      if (totalPages <= 5) n = i + 1;
                      else if (currentPage <= 3) n = i + 1;
                      else if (currentPage >= totalPages - 2) n = totalPages - 4 + i;
                      else n = currentPage - 2 + i;
                      return (
                        <button key={n} onClick={() => setCurrentPage(n)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${currentPage === n ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                          {n}
                        </button>
                      );
                    })}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── ADD DIALOG ── */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">New Expense</DialogTitle>
            </div>
          </DialogHeader>
          <ExpenseFormBody form={form} setForm={setForm} errors={formErrors} setErrors={setFormErrors} projects={projects} expenses={expenses} />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="rounded-xl border-slate-200 text-slate-600">Cancel</Button>
            <Button onClick={handleAdd} disabled={createExpense.isPending} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6">
              {createExpense.isPending ? "Saving…" : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT DIALOG ── */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                <Edit2 className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">Edit Expense</DialogTitle>
            </div>
          </DialogHeader>
          <ExpenseFormBody form={editForm} setForm={setEditForm} errors={editErrors} setErrors={setEditErrors} projects={projects} expenses={expenses} />
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setEditDialog(false)} className="rounded-xl border-slate-200 text-slate-600">Cancel</Button>
            <Button onClick={handleEdit} disabled={updateExpense.isPending} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6">
              {updateExpense.isPending ? "Saving…" : "Update Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── VIEW DIALOG ── */}
      <Dialog open={viewDialog} onOpenChange={v => { setViewDialog(v); if (!v) setSelectedId(null); }}>
        <DialogContent className="sm:max-w-md rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 text-slate-600" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">Expense Details</DialogTitle>
            </div>
          </DialogHeader>
          {selectedLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : selectedData?.data ? (
            <div className="space-y-4 py-2">
              {/* amount hero */}
              <div className="bg-slate-900 rounded-2xl p-5 text-center">
                <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400 mb-1">Amount</p>
                <p className="text-4xl font-extrabold text-white tabular-nums">
                  ₹{parseFloat(selectedData.data.amount).toLocaleString("en-IN")}
                </p>
                <div className="mt-3 flex justify-center">
                  <CategoryBadge category={selectedData.data.category} />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Description", value: selectedData.data.description },
                  { label: "Date", value: new Date(selectedData.data.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Project", value: selectedData.data.project_name ?? "—" },
                  { label: "Created", value: new Date(selectedData.data.created_at).toLocaleString() },
                  { label: "Updated", value: new Date(selectedData.data.updated_at).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-[11px] font-bold tracking-wide uppercase text-slate-400 flex-shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-slate-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400 py-10 text-sm">Expense not found.</p>
          )}
          <DialogFooter className="pt-2">
            <Button onClick={() => { setViewDialog(false); setSelectedId(null); }} className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete expense?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This record will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} disabled={deleteExpense.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-60 transition-all">
                {deleteExpense.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}