import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Search,
  Calendar as CalendarIcon,
  Wallet,
  Users,
  TrendingUp,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import {
  useListAdvances,
  useCreateAdvance,
  useAdvanceStats,
  useListEmployees,
} from "../index";

/* ─────────────────────── field label (matches Attendance) ─────────────────────── */

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 mb-1.5">
    {children}
  </label>
);

/* ─────────────────────── main page ─────────────────────── */

export default function Advance() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const itemsPerPage = 5;

  const { data: advancesData, isLoading: advancesLoading } = useListAdvances();
  const { data: statsData } = useAdvanceStats();
  const { data: employeesData } = useListEmployees();
  const createAdvance = useCreateAdvance();

  const advances = advancesData?.data || [];
  const stats = statsData?.data;

  const employees = useMemo(() => {
    return employeesData?.results?.data || employeesData?.results?.data || [];
  }, [employeesData]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    employee: "",
    amount: 0,
    notes: "",
  });

  const employeesWithAdvances = useMemo(() => {
    const map = new Map<string, any>();
    advances.forEach((adv: any) => {
      if (!map.has(adv.employee)) {
        map.set(adv.employee, {
          employeeId: adv.employee,
          employeeName: adv.employee_name,
          employeeRole: adv.employee_name,
          totalAmount: 0,
          advances: [],
        });
      }
      const entry = map.get(adv.employee)!;
      entry.totalAmount += parseFloat(adv.amount.toString());
      entry.advances.push(adv);
    });
    return Array.from(map.values());
  }, [advances]);

  const filteredList = useMemo(() => {
    let list = employeesWithAdvances;

    if (searchTerm) {
      list = list.filter((e) =>
        e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    list = list
      .map((emp) => {
        const filtered = emp.advances.filter((adv: any) => {
          let ok = true;
          if (dateRange.start && adv.date < dateRange.start) ok = false;
          if (dateRange.end && adv.date > dateRange.end) ok = false;
          const d = new Date(adv.date);
          if (selectedYear && d.getFullYear() !== selectedYear) ok = false;
          if (selectedMonth && d.getMonth() + 1 !== selectedMonth) ok = false;
          return ok;
        });
        return {
          ...emp,
          advances: filtered,
          totalAmount: filtered.reduce(
            (s: number, a: any) => s + parseFloat(a.amount),
            0,
          ),
        };
      })
      .filter((e) => e.advances.length > 0);

    return list;
  }, [employeesWithAdvances, searchTerm, dateRange, selectedYear, selectedMonth]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginated = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const summaryStats = useMemo(() => {
    if (stats) {
      return {
        totalAdvance: parseFloat(stats.total_advance.toString()) || 0,
        avgAdvance: parseFloat(stats.average_advance.toString()) || 0,
        transactionCount: stats.total_count || advances.length,
        uniqueEmployees: employeesWithAdvances.length,
        highest: parseFloat(stats.highest_advance?.toString() || "0"),
      };
    }
    const total = advances.reduce(
      (s: number, a: any) => s + parseFloat(a.amount.toString()),
      0,
    );
    return {
      totalAdvance: total,
      avgAdvance: advances.length ? total / advances.length : 0,
      transactionCount: advances.length,
      uniqueEmployees: employeesWithAdvances.length,
      highest: 0,
    };
  }, [advances, stats, employeesWithAdvances]);

  const hasFilters =
    !!searchTerm ||
    !!dateRange.start ||
    !!dateRange.end ||
    selectedYear !== new Date().getFullYear() ||
    selectedMonth !== new Date().getMonth() + 1;

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setCurrentPage(1);
  };

  const handleSave = () => {
    if (!formData.employee || formData.amount <= 0) return;
    createAdvance.mutate({
      date: formData.date,
      employee: formData.employee,
      amount: formData.amount,
    });
    setOpenDialog(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      employee: employees[0]?.id || "",
      amount: 0,
      notes: "",
    });
  };

  const handleDeleteAdvance = (id: string) => {
    // wire to delete mutation when ready
    setShowDeleteConfirm(null);
  };

  /* loading */
  if (advancesLoading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              Loading advance records…
            </p>
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
                <span className="text-[10px] font-bold tracking-[.2em] uppercase text-red-600">
                  Construction CMS
                </span>
              </div>
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">
                Advance Payments
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Manage employee salary advances
              </p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  date: new Date().toISOString().split("T")[0],
                  employee: employees[0]?.id || "",
                  amount: 0,
                  notes: "",
                });
                setOpenDialog(true);
              }}
              disabled={createAdvance.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Give Advance
            </button>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400">
                Total Advance
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums leading-none">
                ₹{summaryStats.totalAdvance.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {summaryStats.transactionCount} transactions
              </p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-emerald-500">
                Employees
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1.5 tabular-nums leading-none">
                {summaryStats.uniqueEmployees}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">With advances</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-indigo-500">
                Average
              </p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1.5 tabular-nums leading-none">
                ₹{Math.round(summaryStats.avgAdvance).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Per transaction</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-rose-500">
                Highest
              </p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1.5 tabular-nums leading-none">
                ₹{summaryStats.highest.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Single record</p>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              {/* search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search employees…"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors"
                />
              </div>

              {/* year */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ),
                )}
              </select>

              {/* month */}
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {[
                  "January","February","March","April","May","June",
                  "July","August","September","October","November","December",
                ].map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>

              {/* date range */}
              <input
                type="date"
                value={dateRange.start}
                max={dateRange.end || undefined}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, start: e.target.value }));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <input
                type="date"
                value={dateRange.end}
                min={dateRange.start || undefined}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setDateRange((p) => ({ ...p, end: e.target.value }));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ── LIST ── */}
          {filteredList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">
                No advance records found
              </h3>
              <p className="text-sm text-slate-400 mb-5">
                {hasFilters
                  ? "Try adjusting your filters"
                  : "No advances have been given yet"}
              </p>
              {!hasFilters && (
                <button
                  onClick={() => setOpenDialog(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" /> Give First Advance
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginated.map((item) => (
                <div
                  key={item.employeeId}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-colors overflow-hidden"
                >
                  {/* employee header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">
                          {item.employeeName}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 mt-0.5">
                          {item.employeeRole || "Labor"}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold tracking-[.15em] uppercase text-indigo-500">
                        Total Advance
                      </p>
                      <p className="text-2xl font-extrabold text-indigo-600 tabular-nums leading-none mt-0.5">
                        ₹{item.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.advances.length} transaction{item.advances.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* advances table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60">
                          {["Date", "Amount", "Notes", "Action"].map((h) => (
                            <th
                              key={h}
                              className={`px-6 py-3 text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 ${
                                h === "Amount" ? "text-right" : h === "Action" ? "text-center" : "text-left"
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item.advances
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.date).getTime() - new Date(a.date).getTime(),
                          )
                          .map((adv: any) => (
                            <tr
                              key={adv.id}
                              className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-6 py-3 text-slate-600">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                  {new Date(adv.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <span className="font-bold text-slate-800 tabular-nums">
                                  ₹{parseFloat(adv.amount).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-slate-400 max-w-xs truncate text-[12px]">
                                {adv.notes || "—"}
                              </td>
                              <td className="px-6 py-3 text-center">
                                <button
                                  onClick={() => setShowDeleteConfirm(adv.id)}
                                  className="p-1.5 hover:bg-rose-50 rounded-lg transition-colors text-slate-300 hover:text-rose-500"
                                  title="Delete advance"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-slate-400">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, filteredList.length)} of{" "}
                    {filteredList.length} employees
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 5) p = i + 1;
                      else if (currentPage <= 3) p = i + 1;
                      else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                      else p = currentPage - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all
                            ${currentPage === p
                              ? "bg-slate-900 text-white"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* footer note */}
          <p className="text-center text-[11px] text-slate-400">
            Showing filtered advance records &nbsp;·&nbsp; Use year &amp; month selectors to narrow by period
          </p>
        </div>
      </div>

      {/* ── ADD ADVANCE MODAL ── */}
      {openDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
              <Wallet className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Give Advance</h3>
            <p className="text-sm text-slate-400 mb-5">Record a new salary advance</p>

            <div className="space-y-4">
              <div>
                <FieldLabel>Employee *</FieldLabel>
                <select
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors"
                >
                  <option value="">Select employee…</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Date *</FieldLabel>
                <input
                  type="date"
                  value={formData.date}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors"
                />
              </div>

              <div>
                <FieldLabel>Amount (₹) *</FieldLabel>
                <input
                  type="number"
                  min={0}
                  value={formData.amount || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors"
                />
              </div>

              <div>
                <FieldLabel>Notes (optional)</FieldLabel>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes…"
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpenDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createAdvance.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {createAdvance.isPending ? "Saving…" : "Give Advance"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Advance Record</h3>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdvance(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}