import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Edit2, Trash2, Download, Search,
  Users, Briefcase, Phone, UserPlus, X,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  useListEmployees, useCreateEmployee, useUpdateEmployee,
  useDeleteEmployee, useEmployeeStats, useExportEmployees,
} from "../index";

/* ─────────────────────── field helpers ─────────────────────── */

const FieldLabel = ({ children, optional }: { children: React.ReactNode; optional?: boolean }) => (
  <label className="block text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 mb-1.5">
    {children}{!optional && <span className="text-rose-400 normal-case tracking-normal"> *</span>}
    {optional && <span className="text-slate-300 normal-case tracking-normal font-normal"> (optional)</span>}
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-[11px] text-rose-500 mt-1 font-medium">{msg}</p> : null;

/* ─────────────────────── role badge ─────────────────────── */

const RoleBadge = ({ role }: { role: "Mason" | "Labor" }) => {
  const isMason = role === "Mason";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border
      ${isMason
        ? "bg-blue-50 text-blue-800 border-blue-200"
        : "bg-violet-50 text-violet-800 border-violet-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isMason ? "bg-blue-400" : "bg-violet-400"}`} />
      {role}
    </span>
  );
};

/* ─────────────────────── main page ─────────────────────── */

export default function Employees() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"" | "Mason" | "Labor">("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: employeesData, isLoading: employeesLoading } = useListEmployees({
    search: debouncedSearchQuery || undefined,
    role: filterRole || undefined,
    page: currentPage,
    page_size: itemsPerPage,
  });
  const { data: statsData } = useEmployeeStats();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const exportEmployees = useExportEmployees();

  const employees = employeesData?.results?.data || [];
  const stats = statsData?.data;
  const totalCount = employeesData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedEmployees = employees;

  const [formData, setFormData] = useState({
    name: "",
    role: "Labor" as "Mason" | "Labor",
    daily_rate: 0,
    phone: "",
    address: "",
  });

  const handleOpenDialog = (employeeId?: string) => {
    setValidationErrors({});
    if (employeeId) {
      const employee = employees.find((e) => e.id === employeeId);
      if (employee) {
        setFormData({
          name: employee.name,
          role: employee.role,
          daily_rate: parseFloat(employee.daily_rate) || 0,
          phone: employee.phone,
          address: employee.address || "",
        });
        setEditingId(employeeId);
      }
    } else {
      setFormData({ name: "", role: "Labor", daily_rate: 0, phone: "", address: "" });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    else if (formData.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    else if (formData.name.trim().length > 100) errors.name = "Name must be less than 100 characters";
    else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) errors.name = "Name can only contain letters and spaces";
    if (!formData.role) errors.role = "Role is required";
    if (!formData.daily_rate) errors.daily_rate = "Daily rate is required";
    else if (formData.daily_rate < 0) errors.daily_rate = "Daily rate must be positive";
    else if (formData.daily_rate > 100000) errors.daily_rate = "Daily rate is too high";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) errors.phone = "Please enter a valid phone number (10-15 digits)";
    if (formData.address && formData.address.trim().length > 200) errors.address = "Address must be less than 200 characters";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const employeeData = {
      name: formData.name.trim(),
      role: formData.role,
      daily_rate: formData.daily_rate,
      phone: formData.phone.trim(),
      address: formData.address?.trim() || undefined,
    };
    if (editingId) updateEmployee.mutate({ id: editingId, data: employeeData });
    else createEmployee.mutate(employeeData);
    setOpenDialog(false);
    setFormData({ name: "", role: "Labor", daily_rate: 0, phone: "", address: "" });
    setValidationErrors({});
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteEmployee.mutate(id);
    setShowDeleteConfirm(null);
  };

  const clearFilters = () => {
    setFilterRole("");
    setSearchInput("");
    setDebouncedSearchQuery("");
    setCurrentPage(1);
  };

  const clearField = (key: string) => {
    if (validationErrors[key]) setValidationErrors(prev => ({ ...prev, [key]: "" }));
  };

  /* ── loading ── */
  if (employeesLoading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading employees…</p>
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
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Employees</h1>
              <p className="text-slate-400 text-sm mt-0.5">Manage your workforce and team members</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExportModal(true)}
                disabled={exportEmployees.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportEmployees.isPending ? "Exporting…" : "Export CSV"}
              </button>
              <button
                onClick={() => handleOpenDialog()}
                disabled={createEmployee.isPending || updateEmployee.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>

          {/* ── STATS ── */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400">Total Employees</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums leading-none">{stats.total}</p>
                <p className="text-[11px] text-slate-400 mt-1">Active workforce</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold tracking-[.18em] uppercase text-blue-500">Masons</p>
                <p className="text-2xl font-extrabold text-blue-600 mt-1.5 tabular-nums leading-none">{stats.Mason}</p>
                <p className="text-[11px] text-slate-400 mt-1">Skilled workers</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold tracking-[.18em] uppercase text-violet-500">Labor</p>
                <p className="text-2xl font-extrabold text-violet-600 mt-1.5 tabular-nums leading-none">{stats.Labor}</p>
                <p className="text-[11px] text-slate-400 mt-1">Support staff</p>
              </div>
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or phone…"
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-amber-300 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => { setFilterRole(e.target.value as "" | "Mason" | "Labor"); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="">All Roles</option>
                <option value="Mason">Mason</option>
                <option value="Labor">Labor</option>
              </select>
              {(filterRole || searchInput) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ── EMPLOYEE CARDS ── */}
          {paginatedEmployees.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No employees found</h3>
              <p className="text-sm text-slate-400 mb-5">
                {searchInput || filterRole ? "Try adjusting your filters" : "Get started by adding your first employee"}
              </p>
              {!searchInput && !filterRole && (
                <button
                  onClick={() => handleOpenDialog()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Employee
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors group relative"
                  >
                    {/* action buttons */}
                    <div className="absolute top-3 right-3 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenDialog(employee.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(employee.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0
                        ${employee.role === "Mason" ? "bg-blue-50 text-blue-800" : "bg-violet-50 text-violet-800"}`}>
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">{employee.name}</p>
                        <div className="mt-1">
                          <RoleBadge role={employee.role} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-50 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Daily rate</span>
                        <span className="font-bold text-slate-800 tabular-nums">
                          Rs. {parseFloat(employee.daily_rate).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-300 flex-shrink-0" />
                        {employee.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── PAGINATION ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                    <span className="font-semibold text-slate-600">{totalCount}</span> employees
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || !employeesData?.previous}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let n: number;
                      if (totalPages <= 5) n = i + 1;
                      else if (currentPage <= 3) n = i + 1;
                      else if (currentPage >= totalPages - 2) n = totalPages - 4 + i;
                      else n = currentPage - 2 + i;
                      return (
                        <button
                          key={n}
                          onClick={() => setCurrentPage(n)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all
                            ${currentPage === n
                              ? "bg-slate-900 text-white"
                              : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                        >
                          {n}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages || !employeesData?.next}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog
        open={openDialog}
        onOpenChange={(open) => { setOpenDialog(open); if (!open) setValidationErrors({}); }}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Employee" : "New Employee"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto px-1">
            {/* Name */}
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); clearField("name"); }}
                placeholder="e.g. Ramesh Thapa"
                className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${validationErrors.name ? "border-rose-400" : ""}`}
              />
              <FieldError msg={validationErrors.name} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <FieldLabel>Role</FieldLabel>
                <select
                  value={formData.role}
                  onChange={(e) => { setFormData({ ...formData, role: e.target.value as "Mason" | "Labor" }); clearField("role"); }}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-300
                    ${validationErrors.role ? "border-rose-400" : "border-slate-200"}`}
                >
                  <option value="Labor">Labor</option>
                  <option value="Mason">Mason</option>
                </select>
                <FieldError msg={validationErrors.role} />
              </div>

              {/* Daily Rate */}
              <div>
                <FieldLabel>Daily Rate (Rs.)</FieldLabel>
                <Input
                  type="text"
                  value={formData.daily_rate}
                  onChange={(e) => { setFormData({ ...formData, daily_rate: parseInt(e.target.value) || 0 }); clearField("daily_rate"); }}
                  placeholder="e.g. 850"
                  className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${validationErrors.daily_rate ? "border-rose-400" : ""}`}
                />
                <FieldError msg={validationErrors.daily_rate} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <Input
                value={formData.phone}
                onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); clearField("phone"); }}
                placeholder="e.g. 9812356893"
                className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${validationErrors.phone ? "border-rose-400" : ""}`}
              />
              <FieldError msg={validationErrors.phone} />
            </div>

            {/* Address */}
            <div>
              <FieldLabel optional>Address</FieldLabel>
              <Input
                value={formData.address}
                onChange={(e) => { setFormData({ ...formData, address: e.target.value }); clearField("address"); }}
                placeholder="e.g. Kathmandu, Ward 5"
                className={`rounded-xl border-slate-200 focus-visible:ring-amber-300 ${validationErrors.address ? "border-rose-400" : ""}`}
              />
              <FieldError msg={validationErrors.address} />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => { setOpenDialog(false); setValidationErrors({}); }}
              className="rounded-xl border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createEmployee.isPending || updateEmployee.isPending}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6"
            >
              {createEmployee.isPending ? "Adding…" : updateEmployee.isPending ? "Updating…" : editingId ? "Update Employee" : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EXPORT MODAL ── */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
              <Download className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Export employees</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Download all employee records as a CSV file including names, roles, rates, and contact info.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { exportEmployees.mutate(); setShowExportModal(false); }}
                disabled={exportEmployees.isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-60 transition-all"
              >
                <Download className="w-4 h-4" />
                {exportEmployees.isPending ? "Downloading…" : "Download CSV"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
              <Trash2 className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete employee?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This record will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteEmployee.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-60 transition-all"
              >
                {deleteEmployee.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}