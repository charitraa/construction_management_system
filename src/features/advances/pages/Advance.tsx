import { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Search,
  Calendar as CalendarIcon,
  Wallet,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  TrendingUp,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import {
  useListAdvances,
  useCreateAdvance,
  useAdvanceStats,
  useListEmployees,
  useDeleteAdvance,
  useUpdateAdvance,
} from "../index";

/* ── types ── */
type AdvanceForm = {
  date: string;
  employee: string;
  amount: number;
  notes: string;
};

/* ── small helpers ── */
const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ─────────────── Modal ─────────────── */
function AdvanceModal({
  title,
  subtitle,
  formData,
  setFormData,
  employees,
  onSave,
  onClose,
  isPending,
  saveLabel,
}: {
  title: string;
  subtitle: string;
  formData: AdvanceForm;
  setFormData: (f: AdvanceForm) => void;
  employees: any[];
  onSave: () => void;
  onClose: () => void;
  isPending: boolean;
  saveLabel: string;
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        {/* modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* modal body */}
        <div className="px-6 py-5 space-y-4">
          {/* employee */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Employee <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.employee}
              onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            >
              <option value="">Select employee…</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} — {emp.role}
                </option>
              ))}
            </select>
          </div>

          {/* date + amount side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
              />
            </div>
          </div>

          {/* notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Notes <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes…"
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* modal footer */}
        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isPending || !formData.employee || formData.amount <= 0}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── main page ─────────────── */
export default function Advance() {
  const emptyForm: AdvanceForm = {
    date: new Date().toISOString().split("T")[0],
    employee: "",
    amount: 0,
    notes: "",
  };

  const [openCreate, setOpenCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; form: AdvanceForm } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<AdvanceForm>(emptyForm);

  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: advancesData, isLoading } = useListAdvances({
    page: currentPage,
    page_size: itemsPerPage,
    search: searchTerm || undefined,
    employee_id: employeeId || undefined,
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
    year: selectedYear ? parseInt(selectedYear) : undefined,
    month: selectedMonth ? parseInt(selectedMonth) : undefined,
  });
  const { data: statsData } = useAdvanceStats();
  const { data: employeesData } = useListEmployees();
  const createAdvance = useCreateAdvance();
  const updateAdvance = useUpdateAdvance();
  const deleteAdvance = useDeleteAdvance();

  const advances = advancesData?.data || [];
  const pagination = advancesData?.pagination;
  const stats = statsData?.data;

  const employees = useMemo(
    () => employeesData?.results?.data || [],
    [employeesData]
  );

  const summaryStats = useMemo(() => {
    if (stats) {
      return {
        total: parseFloat(stats.total_advance?.toString()) || 0,
        avg: parseFloat(stats.average_advance?.toString()) || 0,
        count: stats.total_count || advances.length,
        employees: new Set(advances.map((a: any) => a.employee)).size,
        highest: parseFloat(stats.highest_advance?.toString() || "0"),
      };
    }
    const total = advances.reduce((s: number, a: any) => s + parseFloat(a.amount), 0);
    return {
      total,
      avg: advances.length ? total / advances.length : 0,
      count: advances.length,
      employees: new Set(advances.map((a: any) => a.employee)).size,
      highest: 0,
    };
  }, [advances, stats]);

  const hasFilters = !!(searchTerm || employeeId || dateRange.start || dateRange.end || selectedYear || selectedMonth);

  const clearFilters = () => {
    setSearchTerm(""); setEmployeeId(""); setDateRange({ start: "", end: "" });
    setSelectedYear(""); setSelectedMonth(""); setCurrentPage(1);
  };

  const handleCreate = () => {
    if (!createForm.employee || createForm.amount <= 0) return;
    createAdvance.mutate({ date: createForm.date, employee: createForm.employee, amount: createForm.amount });
    setOpenCreate(false);
    setCreateForm(emptyForm);
  };

  const handleEdit = () => {
    if (!editTarget || !editTarget.form.employee || editTarget.form.amount <= 0) return;
    updateAdvance.mutate({ advanceId: editTarget.id, data: editTarget.form });
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    deleteAdvance.mutate(id);
    setShowDeleteConfirm(null);
  };

  const openEdit = (adv: any) => {
    setEditTarget({
      id: adv.id,
      form: {
        date: adv.date,
        employee: adv.employee,
        amount: parseFloat(adv.amount),
        notes: adv.notes || "",
      },
    });
  };

  /* loading state */
  if (isLoading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Loading…</p>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[.2em] uppercase text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                  Construction CMS
                </span>
              </div>
              <h1 className="text-[1.75rem] font-black text-slate-900 tracking-tight leading-none">
                Advance Payments
              </h1>
              <p className="text-slate-400 text-sm mt-1">Track and manage employee salary advances</p>
            </div>
            <button
              onClick={() => { setCreateForm(emptyForm); setOpenCreate(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 active:scale-95 transition-all shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Give Advance
            </button>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Disbursed", value: fmt(summaryStats.total), sub: `${summaryStats.count} transactions`, accent: "text-slate-900", badge: "bg-slate-100 text-slate-600" },
              { label: "Employees", value: summaryStats.employees.toString(), sub: "with advances", accent: "text-emerald-700", badge: "bg-emerald-50 text-emerald-600" },
              { label: "Avg per Record", value: fmt(Math.round(summaryStats.avg)), sub: "per transaction", accent: "text-violet-700", badge: "bg-violet-50 text-violet-600" },
              { label: "Highest Single", value: fmt(summaryStats.highest), sub: "single record", accent: "text-rose-700", badge: "bg-rose-50 text-rose-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className={`text-[10px] font-bold tracking-[.18em] uppercase mb-2 ${s.accent} opacity-60`}>{s.label}</p>
                <p className={`text-2xl font-black tabular-nums leading-none ${s.accent}`}>{s.value}</p>
                <span className={`inline-block mt-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.sub}</span>
              </div>
            ))}
          </div>

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-slate-100">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Filters</span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2.5">
                {/* search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employee…"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400 transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* employee */}
                <select
                  value={employeeId}
                  onChange={(e) => { setEmployeeId(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700 min-w-[140px]"
                >
                  <option value="">All Employees</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>

                {/* year */}
                <select
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700"
                >
                  <option value="">All Years</option>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y.toString()}>{y}</option>
                  ))}
                </select>

                {/* month */}
                <select
                  value={selectedMonth}
                  onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 text-slate-700"
                >
                  <option value="">All Months</option>
                  {MONTHS.map((m, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>{m}</option>
                  ))}
                </select>

                {/* date range */}
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-300 transition-all">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => { setDateRange({ ...dateRange, start: e.target.value }); setCurrentPage(1); }}
                    className="text-sm bg-transparent focus:outline-none text-slate-700 w-[120px]"
                  />
                  <span className="text-slate-300 text-xs">→</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => { setDateRange({ ...dateRange, end: e.target.value }); setCurrentPage(1); }}
                    className="text-sm bg-transparent focus:outline-none text-slate-700 w-[120px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── TABLE ── */}
          {advances.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 mb-1">No advance records</h3>
              <p className="text-xs text-slate-400 mb-5">
                {hasFilters ? "Try adjusting your filters" : "No advances have been recorded yet"}
              </p>
              {!hasFilters && (
                <button
                  onClick={() => setOpenCreate(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Give First Advance
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Employee</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Date</th>
                    <th className="px-5 py-3.5 text-right text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Amount</th>
                    <th className="px-5 py-3.5 text-left text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Notes</th>
                    <th className="px-5 py-3.5 text-center text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {advances.map((adv: any) => (
                    <tr key={adv.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* employee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                          </div>
                          <span className="font-semibold text-slate-800 text-[13px]">{adv.employee_name}</span>
                        </div>
                      </td>

                      {/* date */}
                      <td className="px-5 py-3.5 text-slate-500 text-[13px]">
                        {new Date(adv.date).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>

                      {/* amount */}
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-block font-black text-slate-900 tabular-nums bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg text-[13px]">
                          {fmt(parseFloat(adv.amount))}
                        </span>
                      </td>

                      {/* notes */}
                      <td className="px-5 py-3.5 text-slate-400 text-[12px] max-w-[200px] truncate">
                        {adv.notes || <span className="text-slate-300">—</span>}
                      </td>

                      {/* actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          {/* edit */}
                          <button
                            onClick={() => openEdit(adv)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="Edit advance"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {/* delete */}
                          <button
                            onClick={() => setShowDeleteConfirm(adv.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete advance"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PAGINATION ── */}
          {(pagination?.total_pages || 1) > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {pagination ? (pagination.page - 1) * pagination.page_size + 1 : 1}–
                {pagination ? Math.min(pagination.page * pagination.page_size, pagination.total) : advances.length}
                {" "}of {pagination?.total || advances.length} records
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination?.has_previous}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, pagination?.total_pages || 1) }, (_, i) => {
                  const total = pagination?.total_pages || 1;
                  let p: number;
                  if (total <= 5) p = i + 1;
                  else if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= total - 2) p = total - 4 + i;
                  else p = currentPage - 2 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination?.total_pages || 1, p + 1))}
                  disabled={!pagination?.has_next}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      {openCreate && (
        <AdvanceModal
          title="Give Advance"
          subtitle="Record a new salary advance"
          formData={createForm}
          setFormData={setCreateForm}
          employees={employees}
          onSave={handleCreate}
          onClose={() => setOpenCreate(false)}
          isPending={createAdvance.isPending}
          saveLabel="Give Advance"
        />
      )}

      {/* ── EDIT MODAL ── */}
      {editTarget && (
        <AdvanceModal
          title="Edit Advance"
          subtitle={`Editing record #${editTarget.id}`}
          formData={editTarget.form}
          setFormData={(f) => setEditTarget({ ...editTarget, form: f })}
          employees={employees}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
          isPending={updateAdvance.isPending}
          saveLabel="Save Changes"
        />
      )}

      {/* ── DELETE CONFIRM ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Delete Advance?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteAdvance.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
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