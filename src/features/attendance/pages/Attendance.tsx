import React, { useState, useMemo } from "react";
import {
  Calendar,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  UserCheck,
  Users,
  Clock,
  CalendarRange,
  X,
  BarChart3,
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

// Helper Functions
const getStatusColor = (status: AttendanceStatus | null) => {
  if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
  switch (status) {
    case "Present":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Absent":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: AttendanceStatus | null) => {
  switch (status) {
    case "Present":
      return <CheckCircle className="w-4 h-4" />;
    case "Absent":
      return <XCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
};

const isPastDate = (dateStr: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateStr < today;
};

const isFutureDate = (dateStr: string) => {
  const today = new Date().toISOString().split("T")[0];
  return dateStr > today;
};

// Main Component
export default function AttendanceApp() {
  // Hooks
  const { toast } = useToast();

  // State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    employeeId: string;
    status: AttendanceStatus;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | "all">(
    "all",
  );

  // Export Range State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [exportEndDate, setExportEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [exportIncludeStats, setExportIncludeStats] = useState(true);

  // API Queries
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useEmployeesWithAttendance({
      date: selectedDate,
      search: searchTerm,
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

  // Mutations
  const updateAttendance = useUpdateAttendance();
  const createAttendance = useCreateAttendance();
  const { handleExport } = useExportAttendance();

  // Process data
  const employees = useMemo(
    () => employeesData?.data || [],
    [employeesData?.data],
  );
  const departments = useMemo(
    () => departmentsData?.data || ["all"],
    [departmentsData?.data],
  );
  const stats = useMemo(
    () => statsData?.data || { total: 0, present: 0, absent: 0, percentage: 0 },
    [statsData?.data],
  );
  const getDateRangeSummary = useMemo(
    () => ({
      totalDays: dateRangeSummaryData?.data?.total_days || 0,
      totalRecords: dateRangeSummaryData?.data?.total_records || 0,
      totalPresent: dateRangeSummaryData?.data?.total_present || 0,
      totalAbsent: dateRangeSummaryData?.data?.total_absent || 0,
      averageAttendance:
        dateRangeSummaryData?.data?.average_attendance?.toFixed(1) || "0",
    }),
    [dateRangeSummaryData?.data],
  );

  // Handle edit attendance
  const handleEditAttendance = (
    employeeId: string,
    currentStatus: AttendanceStatus | null,
  ) => {
    if (isPastDate(selectedDate)) {
      toast({
        variant: "destructive",
        title: "Cannot Edit",
        description:
          "Cannot edit past dates. Past attendance records are locked.",
      });
      return;
    }
    if (isFutureDate(selectedDate)) {
      toast({
        variant: "destructive",
        title: "Cannot Mark",
        description: "Cannot mark attendance for future dates.",
      });
      return;
    }
    setEditingRecord({ employeeId, status: currentStatus || "Present" });
    setShowEditModal(true);
  };

  const handleSaveAttendance = () => {
    if (!editingRecord) return;

    const employee = employees.find(
      (e: EmployeeWithAttendance) => e.id === editingRecord.employeeId,
    );
    if (!employee) return;

    if (employee.record_id) {
      // Update existing record
      updateAttendance.mutate({
        attendanceId: employee.record_id,
        data: { status: editingRecord.status },
      });
    } else {
      // Create new record
      createAttendance.mutate({
        date: selectedDate,
        employee: employee.id,
        status: editingRecord.status,
      });
    }

    setShowEditModal(false);
    setEditingRecord(null);
  };

  // Date navigation
  const handlePreviousDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const today = new Date().toISOString().split("T")[0];
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split("T")[0];
    if (nextDateStr <= today) setSelectedDate(nextDateStr);
  };

  const handleGoToToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  // Enhanced Export with Range Filters
  const handleExportData = () => {
    handleExport({
      start_date: exportStartDate,
      end_date: exportEndDate,
      format: exportFormat,
      include_stats: exportIncludeStats,
      department: departmentFilter,
      status: statusFilter,
    });
    setShowExportModal(false);
  };

  const isDateLocked = isPastDate(selectedDate);
  const isFuture = isFutureDate(selectedDate);
  const isCurrentToday = isToday(selectedDate);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Attendance Management
                </h1>
                <p className="text-slate-500 mt-1">
                  Track and manage employee attendance records
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-sm"
                >
                  <CalendarRange className="w-4 h-4" />
                  Export with Filters
                </button>
              </div>
            </div>
          </div>

          {/* Date Navigation Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePreviousDay}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium text-slate-700">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <button
                  onClick={handleNextDay}
                  disabled={isCurrentToday}
                  className={`p-2 rounded-lg transition-colors ${isCurrentToday ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"}`}
                >
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
                {!isCurrentToday && (
                  <button
                    onClick={handleGoToToday}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-2"
                  >
                    Today
                  </button>
                )}
              </div>

              {isDateLocked && (
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    Past Date - View Only
                  </span>
                </div>
              )}
              {isFuture && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">
                    Future Date - Cannot Mark
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Present</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {stats.present}
                  </p>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Absent</p>
                  <p className="text-2xl font-bold text-rose-600">
                    {stats.absent}
                  </p>
                </div>
                <div className="bg-rose-50 p-2 rounded-lg">
                  <XCircle className="w-5 h-5 text-rose-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Attendance Rate
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {stats.percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10"
                />
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as AttendanceStatus | "all")
                }
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingEmployees ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Loading employees...
                      </td>
                    </tr>
                  ) : employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee: EmployeeWithAttendance) => (
                      <tr
                        key={employee.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                              {employee.avatar ||
                                employee.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {employee.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {employee.department}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {employee.status ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}
                            >
                              {getStatusIcon(employee.status)}
                              {employee.status}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              Not marked
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleEditAttendance(
                                employee.id,
                                employee.status as AttendanceStatus | null,
                              )
                            }
                            disabled={isFuture || isDateLocked}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isFuture || isDateLocked
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            }`}
                          >
                            {employee.status ? "Edit" : "Mark"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>
              ✓ Today's attendance can be edited | ✗ Past dates are locked (view
              only) | ✗ Future dates cannot be modified
            </p>
          </div>
        </div>

        {/* Enhanced Export Modal with Range Filters */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Export Attendance Data
                    </h2>
                    <p className="text-sm text-slate-500">
                      Export with date range and filters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Date Range Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        max={exportEndDate}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        min={exportStartDate}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Date Range Buttons */}
                <div>
                  <label className="block text-xs text-slate-500 mb-2">
                    Quick Select
                  </label>
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
                            start = new Date(
                              end.getFullYear(),
                              end.getMonth(),
                              1,
                            );
                          } else if (range.days === "lastMonth") {
                            start = new Date(
                              end.getFullYear(),
                              end.getMonth() - 1,
                              1,
                            );
                            end.setDate(0);
                          } else {
                            start.setDate(
                              end.getDate() - (range.days as number),
                            );
                          }
                          setExportStartDate(start.toISOString().split("T")[0]);
                          setExportEndDate(end.toISOString().split("T")[0]);
                        }}
                        className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Filters Display */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Current Filters Applied:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      Department:{" "}
                      {departmentFilter === "all" ? "All" : departmentFilter}
                    </span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </span>
                    <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      Date Range: {exportStartDate} to {exportEndDate}
                    </span>
                  </div>
                </div>

                {/* Export Summary Preview */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-900">
                      Export Summary Preview
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-indigo-600">Total Days</p>
                      <p className="font-semibold text-indigo-900">
                        {getDateRangeSummary.totalDays}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-600">Total Records</p>
                      <p className="font-semibold text-indigo-900">
                        {getDateRangeSummary.totalRecords}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-600">Present</p>
                      <p className="font-semibold text-emerald-900">
                        {getDateRangeSummary.totalPresent}
                      </p>
                    </div>
                    <div>
                      <p className="text-rose-600">Absent</p>
                      <p className="font-semibold text-rose-900">
                        {getDateRangeSummary.totalAbsent}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Export Format
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="csv"
                          checked={exportFormat === "csv"}
                          onChange={(e) =>
                            setExportFormat(e.target.value as "csv")
                          }
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm">CSV</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="json"
                          checked={exportFormat === "json"}
                          onChange={(e) =>
                            setExportFormat(e.target.value as "json")
                          }
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-sm">JSON</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        checked={exportIncludeStats}
                        onChange={(e) =>
                          setExportIncludeStats(e.target.checked)
                        }
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">
                        Include summary statistics
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExportData}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Modal */}
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  Mark Attendance
                </h2>
                <p className="text-slate-500 mb-4">
                  {
                    employees.find(
                      (e: EmployeeWithAttendance) =>
                        e.id === editingRecord?.employeeId,
                    )?.name
                  }
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Present", "Absent"] as AttendanceStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            setEditingRecord({ ...editingRecord!, status })
                          }
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            editingRecord?.status === status
                              ? status === "Present"
                                ? "bg-emerald-500 text-white shadow-md"
                                : "bg-rose-500 text-white shadow-md"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {status}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
