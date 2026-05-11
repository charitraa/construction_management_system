import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  Users,
  Clock,
  CalendarRange,
  X,
  BarChart3,
  Search,
  UserCheck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import {
  useEmployeesWithAttendance,
  useDepartments,
  useUpdateAttendance,
  useAttendanceStats,
  useAttendanceDateRangeSummary,
  useCreateAttendance,
  useExportAttendance,
} from "../hooks";
import {
  EmployeeWithAttendance,
  AttendanceStatus,
} from "../types/attendance.types";
import { useToast } from "@/hooks/use-toast";

/* ─────────────────────── helpers ─────────────────────── */

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const isToday = (dateStr: string) =>
  dateStr === new Date().toISOString().split("T")[0];

const isPastDate = (dateStr: string) =>
  dateStr < new Date().toISOString().split("T")[0];

const isFutureDate = (dateStr: string) =>
  dateStr > new Date().toISOString().split("T")[0];

/* ─────────────────────── status badge ─────────────────────── */

const StatusBadge = ({ status }: { status: AttendanceStatus | null }) => {
  if (!status)
    return <span className="text-[11px] text-slate-400 font-medium">Not marked</span>;

  const isPresent = status === "Present";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border
        ${isPresent
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-rose-50 text-rose-800 border-rose-200"
        }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPresent ? "bg-emerald-400" : "bg-rose-400"}`}
      />
      {status}
    </span>
  );
};

/* ─────────────────────── field helpers ─────────────────────── */

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold tracking-[.15em] uppercase text-slate-400 mb-1.5">
    {children}
  </label>
);

/* ─────────────────────── main page ─────────────────────── */

export default function AttendancePage() {
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    employeeId: string;
    status: AttendanceStatus;
  } | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [exportEndDate, setExportEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [exportIncludeStats, setExportIncludeStats] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* api */
  const { data: employeesData, isLoading } = useEmployeesWithAttendance({
    date: selectedDate,
    search: debouncedSearch,
    department: departmentFilter,
    status: statusFilter,
  });
  const { data: departmentsData } = useDepartments();
  const { data: statsData } = useAttendanceStats(selectedDate);
  const { data: dateRangeSummaryData } = useAttendanceDateRangeSummary({
    start_date: exportStartDate,
    end_date: exportEndDate,
    department: departmentFilter,
    status: statusFilter,
  });
  const updateAttendance = useUpdateAttendance();
  const createAttendance = useCreateAttendance();
  const { handleExport } = useExportAttendance();

  const employees = useMemo(() => employeesData?.data || [], [employeesData?.data]);
  const departments = useMemo(() => departmentsData?.data || ["all"], [departmentsData?.data]);
  const stats = useMemo(
    () => statsData?.data || { total: 0, present: 0, absent: 0, percentage: 0 },
    [statsData?.data],
  );
  const rangeSummary = useMemo(
    () => ({
      totalDays: dateRangeSummaryData?.data?.total_days || 0,
      totalRecords: dateRangeSummaryData?.data?.total_records || 0,
      totalPresent: dateRangeSummaryData?.data?.total_present || 0,
      totalAbsent: dateRangeSummaryData?.data?.total_absent || 0,
      averageAttendance: dateRangeSummaryData?.data?.average_attendance?.toFixed(1) || "0",
    }),
    [dateRangeSummaryData?.data],
  );

  const isDateLocked = isPastDate(selectedDate);
  const isFuture = isFutureDate(selectedDate);
  const isCurrentToday = isToday(selectedDate);
  const hasFilters = departmentFilter !== "all" || statusFilter !== "all" || searchInput;

  /* handlers */
  const handleEditAttendance = (employeeId: string, currentStatus: AttendanceStatus | null) => {
    if (isDateLocked) {
      toast({ variant: "destructive", title: "Cannot Edit", description: "Past attendance records are locked." });
      return;
    }
    if (isFuture) {
      toast({ variant: "destructive", title: "Cannot Mark", description: "Cannot mark attendance for future dates." });
      return;
    }
    setEditingRecord({ employeeId, status: currentStatus || "Present" });
    setShowEditModal(true);
  };

  const handleSaveAttendance = () => {
    if (!editingRecord) return;
    const employee = employees.find((e: EmployeeWithAttendance) => e.id === editingRecord.employeeId);
    if (!employee) return;
    if (employee.record_id) {
      updateAttendance.mutate({ attendanceId: employee.record_id, data: { status: editingRecord.status } });
    } else {
      createAttendance.mutate({ date: selectedDate, employee: employee.id, status: editingRecord.status });
    }
    setShowEditModal(false);
    setEditingRecord(null);
  };

  const handlePreviousDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const today = new Date().toISOString().split("T")[0];
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const next = d.toISOString().split("T")[0];
    if (next <= today) setSelectedDate(next);
  };

  const clearFilters = () => {
    setDepartmentFilter("all");
    setStatusFilter("all");
    setSearchInput("");
  };

  const handleExportData = () => {
    handleExport({
      start_date: exportStartDate,
      end_date: exportEndDate,
      export_format: exportFormat,
      include_stats: exportIncludeStats,
      department: departmentFilter,
      status: statusFilter,
    });
    setShowExportModal(false);
  };

  /* loading */
  if (isLoading && employees.length === 0)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-[3px] border-amber-200 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium tracking-wide">Loading attendance…</p>
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
                <span className="text-[10px] font-bold tracking-[.2em] uppercase text-red-600">Construction Managemenet System</span>
              </div>
              <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">Attendance</h1>
              <p className="text-slate-400 text-sm mt-0.5">Track and manage employee attendance records</p>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <CalendarRange className="w-4 h-4" />
              Export with Filters
            </button>
          </div>

          {/* ── DATE NAV ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousDay}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">{formatDate(selectedDate)}</span>
              </div>

              <button
                onClick={handleNextDay}
                disabled={isCurrentToday}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isCurrentToday && (
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Today
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isDateLocked && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-700">
                  <Clock className="w-3.5 h-3.5" /> Past Date — View Only
                </span>
              )}
              {isFuture && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
                  <AlertCircle className="w-3.5 h-3.5" /> Future Date — Cannot Mark
                </span>
              )}
              {isCurrentToday && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle className="w-3.5 h-3.5" /> Today — Editable
                </span>
              )}
            </div>
          </div>

          {/* ── STATS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-slate-400">Total Staff</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1.5 tabular-nums leading-none">{stats.total}</p>
              <p className="text-[11px] text-slate-400 mt-1">Active workforce</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-emerald-500">Present</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1.5 tabular-nums leading-none">{stats.present}</p>
              <p className="text-[11px] text-slate-400 mt-1">On site today</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-rose-500">Absent</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1.5 tabular-nums leading-none">{stats.absent}</p>
              <p className="text-[11px] text-slate-400 mt-1">Not present</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold tracking-[.18em] uppercase text-indigo-500">Rate</p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1.5 tabular-nums leading-none">
                {stats.percentage.toFixed(1)}%
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Attendance rate</p>
            </div>
          </div>

          {/* ── FILTER BAR ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search employees…"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition-colors"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {departments.map((dept: string) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | "all")}
                className="px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
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

          {/* ── EMPLOYEE CARDS ── */}
          {employees.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No employees found</h3>
              <p className="text-sm text-slate-400">
                {hasFilters ? "Try adjusting your filters" : "No employees available for this date"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {employees.map((employee: EmployeeWithAttendance) => {
                const initials = employee.name.slice(0, 2).toUpperCase();
                const isPresent = employee.status === "Present";
                const isAbsent = employee.status === "Absent";

                return (
                  <div
                    key={employee.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition-colors group relative"
                  >
                    {/* avatar + name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0
                        ${isPresent ? "bg-emerald-50 text-emerald-800" : isAbsent ? "bg-rose-50 text-rose-800" : "bg-slate-100 text-slate-600"}`}>
                        {employee.avatar || initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-tight">{employee.name}</p>
                        {employee.department && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{employee.department}</p>
                        )}
                        <div className="mt-1">
                          <StatusBadge status={employee.status as AttendanceStatus | null} />
                        </div>
                      </div>
                    </div>

                    {/* details */}
                    <div className="border-t border-slate-50 pt-3 space-y-2">
                      {employee.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          {employee.email}
                        </div>
                      )}
                      {/* quick toggle buttons - only on today */}
                      {isCurrentToday && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setEditingRecord({ employeeId: employee.id, status: "Present" });
                              const emp = employees.find((e: EmployeeWithAttendance) => e.id === employee.id);
                              if (emp?.record_id) {
                                updateAttendance.mutate({ attendanceId: emp.record_id, data: { status: "Present" } });
                              } else {
                                createAttendance.mutate({ date: selectedDate, employee: employee.id, status: "Present" });
                              }
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all
                              ${isPresent
                                ? "bg-emerald-500 text-white"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              }`}
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() => {
                              const emp = employees.find((e: EmployeeWithAttendance) => e.id === employee.id);
                              if (emp?.record_id) {
                                updateAttendance.mutate({ attendanceId: emp.record_id, data: { status: "Absent" } });
                              } else {
                                createAttendance.mutate({ date: selectedDate, employee: employee.id, status: "Absent" });
                              }
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all
                              ${isAbsent
                                ? "bg-rose-500 text-white"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                              }`}
                          >
                            ✗ Absent
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FOOTER NOTE ── */}
          <p className="text-center text-[11px] text-slate-400">
            ✓ Today's attendance is editable &nbsp;·&nbsp; Past dates are locked (view only) &nbsp;·&nbsp; Future dates cannot be modified
          </p>

        </div>
      </div>

      {/* ── MARK / EDIT MODAL ── */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
              <UserCheck className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Mark Attendance</h3>
            <p className="text-sm text-slate-500 mb-5">
              {employees.find((e: EmployeeWithAttendance) => e.id === editingRecord?.employeeId)?.name}
            </p>

            <FieldLabel>Status</FieldLabel>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(["Present", "Absent"] as AttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setEditingRecord({ ...editingRecord!, status })}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all
                    ${editingRecord?.status === status
                      ? status === "Present"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-rose-500 text-white shadow-md"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EXPORT MODAL ── */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden">

            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                  <FileSpreadsheet className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Export Attendance Data</p>
                  <p className="text-[11px] text-slate-400">Select range and format</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* date range */}
              <div>
                <FieldLabel>Date Range</FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">Start</p>
                    <input
                      type="date"
                      value={exportStartDate}
                      onChange={(e) => setExportStartDate(e.target.value)}
                      max={exportEndDate}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 mb-1">End</p>
                    <input
                      type="date"
                      value={exportEndDate}
                      onChange={(e) => setExportEndDate(e.target.value)}
                      min={exportStartDate}
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    />
                  </div>
                </div>
              </div>

              {/* quick select */}
              <div>
                <FieldLabel>Quick Select</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Last 7 Days", days: 7 },
                    { label: "Last 30 Days", days: 30 },
                    { label: "This Month", days: "month" },
                    { label: "Last Month", days: "lastMonth" },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        const end = new Date();
                        let start = new Date();
                        if (range.days === "month") {
                          start = new Date(end.getFullYear(), end.getMonth(), 1);
                        } else if (range.days === "lastMonth") {
                          start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
                          end.setDate(0);
                        } else {
                          start.setDate(end.getDate() - (range.days as number));
                        }
                        setExportStartDate(start.toISOString().split("T")[0]);
                        setExportEndDate(end.toISOString().split("T")[0]);
                      }}
                      className="px-3 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* summary preview */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[10px] font-bold tracking-[.15em] uppercase text-slate-400">Export Preview</p>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Days", value: rangeSummary.totalDays, color: "text-slate-800" },
                    { label: "Records", value: rangeSummary.totalRecords, color: "text-slate-800" },
                    { label: "Present", value: rangeSummary.totalPresent, color: "text-emerald-700" },
                    { label: "Absent", value: rangeSummary.totalAbsent, color: "text-rose-700" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] text-slate-400">{item.label}</p>
                      <p className={`text-base font-extrabold tabular-nums ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* format + options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Format</FieldLabel>
                  <div className="flex gap-3">
                    {(["csv"] as const).map((fmt) => (
                      <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={fmt}
                          checked={exportFormat === fmt}
                          onChange={() => setExportFormat(fmt)}
                          className="w-4 h-4 accent-slate-900"
                        />
                        <span className="text-sm font-semibold text-slate-700 uppercase">{fmt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <FieldLabel>Options</FieldLabel>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportIncludeStats}
                      onChange={(e) => setExportIncludeStats(e.target.checked)}
                      className="w-4 h-4 accent-slate-900 rounded"
                    />
                    <span className="text-sm text-slate-600">Include summary stats</span>
                  </label>
                </div>
              </div>
            </div>

            {/* modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all"
              >
                <Download className="w-4 h-4" />
                Download {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}