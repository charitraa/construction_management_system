import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus, Edit2, Trash2, Search, Calendar, DollarSign,
  Target, Clock, CheckCircle, AlertCircle, X,
  ChevronLeft, ChevronRight, Building2, User, MapPin,
  Download, TrendingUp, Layers
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  useListProjects, useCreateProject, useUpdateProject,
  useDeleteProject, useProjectStats, useExportProjects,
} from "../index";

/* ─────────────────────────────── helpers ─────────────────────────────── */

const STATUS_META = {
  ongoing: { label: "Ongoing", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  completed: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  delayed: { label: "Delayed", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
} as const;

const StatusBadge = ({ status }: { status: keyof typeof STATUS_META }) => {
  const m = STATUS_META[status] ?? STATUS_META.ongoing;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const getProgress = (startDate: string) => {
  const elapsed = Math.max(0, (Date.now() - new Date(startDate).getTime()) / 86_400_000);
  return Math.min(100, Math.floor((elapsed / 365) * 100));
};

const fmt = (n: number) =>
  n >= 1e5 ? `₹${(n / 1e5).toFixed(1)}L` : `₹${n.toLocaleString("en-IN")}`;

/* ─────────────────────────────── stat card ─────────────────────────────── */

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;   /* Tailwind bg class for icon ring */
  iconColor: string;
  sub?: string;
}
const StatCard = ({ label, value, icon, accent, iconColor, sub }: StatCardProps) => (
  <div className="group relative bg-white border border-slate-100 rounded-2xl p-5 shadow-sm overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/60 pointer-events-none" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1.5 tabular-nums">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`${accent} p-2.5 rounded-xl`}>
        <div className={`${iconColor} w-5 h-5`}>{icon}</div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────── main page ─────────────────────────────── */

export default function Projects() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchDebouncing, setIsSearchDebouncing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "ongoing" | "completed" | "delayed">("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Validation errors
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Debounce search term
  useEffect(() => {
    setIsSearchDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearchDebouncing(false);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
      setIsSearchDebouncing(false);
    };
  }, [searchTerm]);

  const { data: projectsData, isLoading } = useListProjects({
    page: currentPage, page_size: itemsPerPage,
    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
    ...(statusFilter !== "all" && { status: statusFilter }),
  });
  const { data: statsData } = useProjectStats();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const exportProjects = useExportProjects();

  const projects = projectsData?.data ?? [];
  const stats = statsData?.data;
  const pagination = projectsData?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  const [form, setForm] = useState({
    name: "", client_name: "", location: "", description: "",
    start_date: "", status: "ongoing" as "ongoing" | "completed" | "delayed", budget: 0,
  });

  useEffect(() => {
    if (pagination?.page && pagination.page !== currentPage) setCurrentPage(pagination.page);
  }, [pagination?.page]);

  const openEdit = (id?: string) => {
    if (id) {
      const p = projects.find(x => x.id === id);
      if (p) { setForm({ name: p.name, client_name: p.client_name ?? "", location: p.location ?? "", description: p.description ?? "", start_date: p.start_date, status: p.status, budget: p.budget }); setEditingId(id); }
    } else {
      setForm({ name: "", client_name: "", location: "", description: "", start_date: "", status: "ongoing", budget: 0 });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const validateProjectForm = (data: typeof form) => {
    const errors: {[key: string]: string} = {};

    if (!data.name?.trim()) {
      errors.name = "Project name is required";
    }
    if (!data.client_name?.trim()) {
      errors.client_name = "Client name is required";
    }
    if (!data.location?.trim()) {
      errors.location = "Location is required";
    }
    if (!data.description?.trim()) {
      errors.description = "Description is required";
    }
    if (!data.start_date) {
      errors.start_date = "Start date is required";
    }
    if (!data.budget || data.budget <= 0) {
      errors.budget = "Budget must be greater than 0";
    }

    return errors;
  };

  const handleSave = () => {
    const errors = validateProjectForm(form);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (editingId) updateProject.mutate({ id: editingId, data: form });
    else createProject.mutate(form);
    setOpenDialog(false);
    setFormErrors({});
    setEditingId(null);
  };

  const handleDelete = (id: string) => deleteProject.mutate(id, { onSuccess: () => setShowDeleteConfirm(null) });

  /* ── loading ── */
  if (isLoading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium tracking-wide">Loading projects…</p>
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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-amber-500 rounded-full" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600">Construction CMS</span>
              </div>
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Projects</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track and manage all construction projects</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => exportProjects.mutate({})}
                disabled={exportProjects.isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportProjects.isPending ? "Exporting…" : "Export CSV"}
              </button>
              <button
                onClick={() => openEdit()}
                disabled={createProject.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          {/* ── STATS ── */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total" value={stats.total} icon={<Layers className="w-5 h-5" />} accent="bg-slate-100" iconColor="text-slate-600" sub="All projects" />
              <StatCard label="Ongoing" value={stats.ongoing} icon={<Clock className="w-5 h-5" />} accent="bg-sky-100" iconColor="text-sky-600" sub="In progress" />
              <StatCard label="Completed" value={stats.by_status.completed} icon={<CheckCircle className="w-5 h-5" />} accent="bg-emerald-100" iconColor="text-emerald-600" sub="Delivered" />
              <StatCard label="Delayed" value={stats.by_status.delayed ?? 0} icon={<AlertCircle className="w-5 h-5" />} accent="bg-rose-100" iconColor="text-rose-600" sub="Need attention" />
            </div>
          )}

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by project name, client, or location…"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-10 border-slate-200 rounded-xl focus-visible:ring-amber-300 bg-slate-50 focus:bg-white transition-colors"
                />
                {isSearchDebouncing && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {(["all", "ongoing", "completed", "delayed"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                  >
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {(debouncedSearchTerm || statusFilter !== "all") && (
                <button
                  onClick={() => { setSearchTerm(""); setDebouncedSearchTerm(""); setStatusFilter("all"); setCurrentPage(1); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ── PROJECTS GRID ── */}
          {projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No projects found</h3>
              <p className="text-sm text-slate-400 mb-5">
                {debouncedSearchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "Get started by creating your first project"}
              </p>

              {!debouncedSearchTerm && statusFilter === "all" && (
                <button
                  onClick={() => openEdit()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Project
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects.map((project) => {
                  const progress = getProgress(project.start_date);
                  const progressColor = progress < 40 ? "bg-sky-400" : progress < 75 ? "bg-amber-400" : "bg-emerald-400";
                  return (
                    <div key={project.id} className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden">

                      {/* top accent bar */}
                      <div className={`h-1 w-full ${project.status === "completed" ? "bg-emerald-400"
                        : project.status === "delayed" ? "bg-rose-400"
                          : "bg-amber-400"
                        }`} />

                      {/* header */}
                      <div className="px-5 pt-4 pb-3 flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 pr-2">{project.name}</h3>
                          <div className="mt-1.5"><StatusBadge status={project.status} /></div>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                          {project.status !== "completed" && (
                            <button
                              onClick={() => updateProject.mutate({ id: project.id, data: { status: "completed" } })}
                              title="Mark complete"
                              className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                            ><CheckCircle className="w-4 h-4" /></button>
                          )}
                          <button onClick={() => openEdit(project.id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setShowDeleteConfirm(project.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <p className="px-5 text-[13px] text-slate-500 leading-relaxed line-clamp-2">{project.description}</p>

                      {/* meta rows */}
                      <div className="px-5 py-4 mt-2 border-t border-slate-100 space-y-2.5 flex-1">
                        {[
                          { icon: <User className="w-3.5 h-3.5" />, label: "Client", value: project.client_name },
                          { icon: <MapPin className="w-3.5 h-3.5" />, label: "Location", value: project.location },
                          { icon: <Calendar className="w-3.5 h-3.5" />, label: "Started", value: new Date(project.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                        ].map(({ icon, label, value }) => (
                          <div key={label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                              {icon}
                              <span className="text-[12px] font-medium">{label}</span>
                            </div>
                            <span className="text-[12px] font-semibold text-slate-700 max-w-[55%] text-right truncate">{value}</span>
                          </div>
                        ))}

                        {/* progress */}
                        {/* <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-400">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[12px] font-medium">Progress</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-700 ${progressColor}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[12px] font-bold text-slate-700 w-8 text-right">{progress}%</span>
                          </div>
                        </div> */}
                      </div>

                      {/* budget footer */}
                      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-medium">Budget</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-slate-900">{fmt(project.budget)}</span>
                          <span className="text-[11px] text-slate-400 ml-1.5">₹{project.budget.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── PAGINATION ── */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-slate-400">
                    {((pagination.page - 1) * pagination.page_size) + 1}–{Math.min(pagination.page * pagination.page_size, pagination.total)} of <span className="font-semibold text-slate-600">{pagination.total}</span> projects
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={!pagination.has_previous}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    ><ChevronLeft className="w-4 h-4" /></button>

                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      let n: number;
                      if (pagination.total_pages <= 5) n = i + 1;
                      else if (pagination.page <= 3) n = i + 1;
                      else if (pagination.page >= pagination.total_pages - 2) n = pagination.total_pages - 4 + i;
                      else n = pagination.page - 2 + i;
                      const active = pagination.page === n;
                      return (
                        <button key={n} onClick={() => setCurrentPage(n)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${active ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                        >{n}</button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
                      disabled={!pagination.has_next}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    ><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-slate-200 shadow-xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Project" : "New Project"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {[
              { key: "name", label: "Project Name", placeholder: "Enter project name" },
              { key: "client_name", label: "Client Name", placeholder: "Enter client name" },
              { key: "location", label: "Location", placeholder: "Enter project location" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {label} <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={(form as any)[key]}
                  onChange={(e) => {
                    setForm({ ...form, [key]: e.target.value });
                    if (formErrors[key]) {
                      setFormErrors({ ...formErrors, [key]: "" });
                    }
                  }}
                  placeholder={placeholder}
                  className={`border-slate-200 rounded-xl focus-visible:ring-amber-300 ${formErrors[key] ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {formErrors[key] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[key]}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm({ ...form, description: e.target.value });
                  if (formErrors.description) {
                    setFormErrors({ ...formErrors, description: "" });
                  }
                }}
                placeholder="Describe the project scope and objectives"
                rows={3}
                className={`w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none bg-white text-slate-800 placeholder:text-slate-400 ${formErrors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {formErrors.description && (
                <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Start Date <span className="text-rose-400">*</span>
                </label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => {
                    setForm({ ...form, start_date: e.target.value });
                    if (formErrors.start_date) {
                      setFormErrors({ ...formErrors, start_date: "" });
                    }
                  }}
                  className={`border-slate-200 rounded-xl focus-visible:ring-amber-300 ${formErrors.start_date ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {formErrors.start_date && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  Status <span className="text-rose-400">*</span>
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-slate-800"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Budget (₹) <span className="text-rose-400">*</span>
              </label>
              <Input
                type="number"
                value={form.budget || ""}
                onChange={(e) => {
                  setForm({ ...form, budget: parseInt(e.target.value) || 0 });
                  if (formErrors.budget) {
                    setFormErrors({ ...formErrors, budget: "" });
                  }
                }}
                placeholder="e.g. 2500000"
                className={`border-slate-200 rounded-xl focus-visible:ring-amber-300 ${formErrors.budget ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {formErrors.budget && (
                <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>
              )}
              {form.budget > 0 && (
                <p className="text-xs text-amber-600 font-semibold mt-1.5">
                  ≈ {fmt(form.budget)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="rounded-xl border-slate-200 text-slate-600">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createProject.isPending || updateProject.isPending}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6"
            >
              {createProject.isPending || updateProject.isPending ? "Saving…" : editingId ? "Update Project" : "Create Project"}
            </Button>
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
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete project?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              This action is permanent. All associated data will be removed and cannot be recovered.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >Cancel</button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleteProject.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-60 transition-all"
              >{deleteProject.isPending ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}