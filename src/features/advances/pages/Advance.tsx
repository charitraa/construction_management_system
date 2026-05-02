import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useListAdvances,
  useCreateAdvance,
  useAdvanceStats,
  useListEmployees,
} from "../index";

export default function Advance() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
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

  // Extract data from API responses
  const advances = advancesData?.data || [];
  const stats = statsData?.data;

  // Handle different employee data structures
  const employees = useMemo(() => {
    const empData = employeesData?.results?.data || employeesData?.results.data || [];
    return empData;
  }, [employeesData]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    employee: "",
    amount: 0,
    notes: "",
  });

  // Get employees who have taken advances (from API data)
  const employeesWithAdvances = useMemo(() => {
    const employeeAdvanceMap = new Map();

    advances.forEach((adv) => {
      if (!employeeAdvanceMap.has(adv.employee)) {
        employeeAdvanceMap.set(adv.employee, {
          employeeId: adv.employee,
          employeeName: adv.employee_name,
          employeeRole: adv.employee_name,
          totalAmount: 0,
          advances: [],
        });
      }
      const empData = employeeAdvanceMap.get(adv.employee);
      empData.totalAmount += parseFloat(adv.amount.toString());
      empData.advances.push(adv);
    });

    return Array.from(employeeAdvanceMap.values());
  }, [advances]);

  // Filter employees with advances based on search
  const filteredEmployeesWithAdvances = useMemo(() => {
    let filtered = employeesWithAdvances;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employeeRole && emp.employeeRole.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedEmployee) {
      filtered = filtered.filter(emp => emp.employeeId === selectedEmployee);
    }

    // Apply date range filter to advances within each employee
    if (dateRange.start || dateRange.end || selectedYear || selectedMonth) {
      filtered = filtered.map(emp => ({
        ...emp,
        advances: emp.advances.filter(adv => {
          let matches = true;

          // Date range filter
          if (dateRange.start && adv.date < dateRange.start) matches = false;
          if (dateRange.end && adv.date > dateRange.end) matches = false;

          // Year and month filter
          if (selectedYear || selectedMonth) {
            const advDate = new Date(adv.date);
            if (selectedYear && advDate.getFullYear() !== selectedYear) matches = false;
            if (selectedMonth && advDate.getMonth() + 1 !== selectedMonth) matches = false;
          }

          return matches;
        }),
        totalAmount: emp.advances
          .filter(adv => {
            let matches = true;

            // Date range filter
            if (dateRange.start && adv.date < dateRange.start) matches = false;
            if (dateRange.end && adv.date > dateRange.end) matches = false;

            // Year and month filter
            if (selectedYear || selectedMonth) {
              const advDate = new Date(adv.date);
              if (selectedYear && advDate.getFullYear() !== selectedYear) matches = false;
              if (selectedMonth && advDate.getMonth() + 1 !== selectedMonth) matches = false;
            }

            return matches;
          })
          .reduce((sum, adv) => sum + parseFloat(adv.amount), 0)
      })).filter(emp => emp.advances.length > 0);
    }

    return filtered;
  }, [employeesWithAdvances, searchTerm, selectedEmployee, dateRange, selectedYear, selectedMonth]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployeesWithAdvances.length / itemsPerPage);
  const paginatedAdvances = filteredEmployeesWithAdvances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate summary statistics from stats API or compute from data
  const summaryStats = useMemo(() => {
    // Use stats from API if available
    if (stats) {
      return {
        totalAdvance: parseFloat(stats.total_advance.toString()) || 0,
        avgAdvance: parseFloat(stats.average_advance.toString()) || 0,
        transactionCount: stats.total_count || advances.length,
      };
    }

    // Fallback to computed stats
    const totalAdvance = advances.reduce((sum, adv) => sum + parseFloat(adv.amount.toString()), 0);
    const uniqueEmployees = new Set(advances.map(adv => adv.employee)).size;
    const avgAdvance = advances.length > 0 ? totalAdvance / advances.length : 0;

    return {
      totalAdvance,
      uniqueEmployees,
      avgAdvance,
      transactionCount: advances.length,
    };
  }, [advances, stats]);

  const handleOpenDialog = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      employee: employees[0]?.id || "",
      amount: 0,
      notes: "",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.employee || formData.amount === 0) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.amount < 0) {
      alert("Amount cannot be negative");
      return;
    }

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

  const handleDeleteAdvance = (advanceId: string) => {
    // Delete functionality when API is ready
    alert("Delete functionality will be implemented when API is ready");
    setShowDeleteConfirm(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedEmployee(null);
    setDateRange({ start: "", end: "" });
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth(new Date().getMonth() + 1);
    setCurrentPage(1);
  };

  if (advancesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading advance records...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Advance Payments</h1>
            <p className="text-gray-500 mt-1">Manage employee salary advances</p>
          </div>
          <Button
            onClick={handleOpenDialog}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            disabled={createAdvance.isPending}
          >
            <Plus className="w-4 h-4" />
            Give Advance
          </Button>
        </div>

        {/* Stats Cards - Using data from stats API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Advance Given</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{summaryStats.totalAdvance.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {summaryStats.transactionCount} transactions
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Employees with Advance</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {summaryStats.uniqueEmployees}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Total employees in system
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Advance</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₹{Math.round(summaryStats.avgAdvance).toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Per transaction
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Highest Advance</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ₹{stats?.highest_advance.toString() ? parseFloat(stats.highest_advance.toString()).toLocaleString() : '0'}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Single transaction
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by employee name or role..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 w-24"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 w-32"
                  >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, start: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="pl-10 w-40 border-gray-200"
                  />
                </div>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, end: e.target.value });
                      setCurrentPage(1);
                    }}
                    className="pl-10 w-40 border-gray-200"
                  />
                </div>
              </div>
            </div>

            {(searchTerm || dateRange.start || dateRange.end ||
               selectedYear !== new Date().getFullYear() || selectedMonth !== new Date().getMonth() + 1) && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(selectedYear !== new Date().getFullYear() || selectedMonth !== new Date().getMonth() + 1) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      Period: {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      <button onClick={() => {
                        setSelectedYear(new Date().getFullYear());
                        setSelectedMonth(new Date().getMonth() + 1);
                      }} className="hover:text-indigo-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.start && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      From: {dateRange.start}
                      <button onClick={() => setDateRange({ ...dateRange, start: "" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.end && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      To: {dateRange.end}
                      <button onClick={() => setDateRange({ ...dateRange, end: "" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Employees with Advances List */}
        {filteredEmployeesWithAdvances.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No advance records found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || dateRange.start || dateRange.end ||
               selectedYear !== new Date().getFullYear() || selectedMonth !== new Date().getMonth() + 1
                ? "Try adjusting your filters"
                : "No advances have been given yet"}
            </p>
            {!searchTerm && !dateRange.start && !dateRange.end && (
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Give First Advance
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedAdvances.map((item) => (
                <div
                  key={item.employeeId}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Employee Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg ${item.employeeRole === "Mason"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : "bg-gradient-to-br from-purple-500 to-purple-600"
                          }`}>
                          {item.employeeName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {item.employeeName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.employeeRole === "Mason"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                              }`}>
                              {item.employeeRole || "Labor"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500">Total Advances</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          ₹{item.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.advances.length} transaction{item.advances.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Advances Table */}
                  {item.advances.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-700 text-xs uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                              Notes
                            </th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.advances
                            .sort(
                              (a, b) =>
                                new Date(b.date).getTime() -
                                new Date(a.date).getTime(),
                            )
                            .map((adv) => (
                              <tr
                                key={adv.id}
                                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-6 py-3 text-gray-700">
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-3 h-3 text-gray-400" />
                                    {new Date(adv.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                  <span className="font-semibold text-gray-900">
                                    ₹{parseFloat(adv.amount).toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-3 text-gray-500 max-w-xs truncate">
                                  {adv.notes || '-'}
                                </td>
                                <td className="px-6 py-3 text-center">
                                  <button
                                    onClick={() => setShowDeleteConfirm(adv.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
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
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployeesWithAdvances.length)} of {filteredEmployeesWithAdvances.length} employees
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 ${currentPage === pageNum ? "bg-indigo-600" : ""}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Advance Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Give Advance to Employee
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employee}
                onChange={(e) =>
                  setFormData({ ...formData, employee: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Enter amount"
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={createAdvance.isPending}
            >
              {createAdvance.isPending ? "Giving..." : "Give Advance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Advance Record</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this advance record? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteAdvance(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}