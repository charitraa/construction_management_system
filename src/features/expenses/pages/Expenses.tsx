import { useState, useMemo, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Wallet,
  PieChart,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Briefcase,
  Trash2,
  Edit2,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useListExpenses,
  useCreateExpense,
  useDeleteExpense,
  useGetExpense,
  useUpdateExpense,
  useGetExpenseStats,
  useExportExpenses,
  useListProjects
} from "../index";

export default function Expenses() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchDebouncing, setIsSearchDebouncing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [projectFilter, setProjectFilter] = useState<"all" | string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const { data: expensesData, isLoading: expensesLoading } = useListExpenses({
    page: currentPage,
    page_size: 10, // Use API's default or match backend pagination
    search: debouncedSearchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    project: projectFilter !== "all" ? projectFilter : undefined,
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
  });
  const { data: projectsData } = useListProjects();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const updateExpense = useUpdateExpense();
  const { data: expenseStatsData } = useGetExpenseStats();
  const exportExpenses = useExportExpenses();
  const { data: selectedExpenseData, isLoading: selectedExpenseLoading } = useGetExpense(selectedExpenseId || "");

  const expenses = expensesData?.results?.data || [];
  const projects = projectsData?.data || [];

  // Extract pagination information from API response
  const paginationInfo = {
    count: expensesData?.count || 0,
    next: expensesData?.next,
    previous: expensesData?.previous,
    totalPages: Math.ceil((expensesData?.count || 0) / 10), // Assuming page_size is 10
    currentPage: currentPage,
  };

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, categoryFilter, projectFilter, dateRange.start, dateRange.end]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Labor",
    amount: "",
    project: "",
  });

  const [editFormData, setEditFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    project: "",
  });

  // Note: Filtering and pagination are now handled by the API

  // Use API stats for accurate statistics
  const stats = useMemo(() => {
    if (expenseStatsData?.data) {
      const apiStats = expenseStatsData.data;
      return {
        totalAmount: apiStats.total_expenses || 0,
        categoryTotals: apiStats.category_breakdown || {},
        averageExpense: apiStats.average_expense || 0,
        highestExpense: apiStats.highest_expense || 0,
        transactionCount: apiStats.transaction_count || 0,
      };
    }

    // Fallback if no API stats available
    return {
      totalAmount: 0,
      categoryTotals: {},
      averageExpense: 0,
      highestExpense: 0,
      transactionCount: 0,
    };
  }, [expenseStatsData]);

  const handleOpenDialog = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "Labor",
      amount: "",
      project: projects[0]?.id || "",
    });
    setOpenDialog(true);
  };

  const handleViewExpense = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setViewDialog(true);
  };

  const handleEditExpense = (expense: any) => {
    setEditFormData({
      date: expense.date,
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      project: expense.project || "",
    });
    setSelectedExpenseId(expense.id);
    setEditDialog(true);
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount || !formData.project) {
      alert("Please fill all required fields");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    createExpense.mutate({
      date: formData.date,
      description: formData.description,
      category: formData.category,
      amount: formData.amount,
      project: formData.project,
    });

    setOpenDialog(false);
  };

  const handleSaveEdit = () => {
    if (!editFormData.description || !editFormData.amount || !editFormData.project) {
      alert("Please fill all required fields");
      return;
    }

    const amountValue = parseFloat(editFormData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    if (!selectedExpenseId) return;

    updateExpense.mutate({
      id: selectedExpenseId,
      data: {
        date: editFormData.date,
        description: editFormData.description,
        category: editFormData.category,
        amount: editFormData.amount,
        project: editFormData.project,
      },
    });

    setEditDialog(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    deleteExpense.mutate(expenseId, {
      onSuccess: () => {
        setShowDeleteConfirm(null);
      },
    });
  };

  const handleExportExpenses = () => {
    exportExpenses.mutate({
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      start_date: dateRange.start || undefined,
      end_date: dateRange.end || undefined,
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Labor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Materials":
        return "bg-green-100 text-green-700 border-green-200";
      case "Equipment":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Advance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Other":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Labor":
        return <Briefcase className="w-3 h-3" />;
      case "Materials":
        return <Package className="w-3 h-3" />;
      case "Equipment":
        return <Settings className="w-3 h-3" />;
      case "Advance":
        return <Wallet className="w-3 h-3" />;
      default:
        return <DollarSign className="w-3 h-3" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setProjectFilter("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  if (expensesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading expenses...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expenses</h1>
            <p className="text-gray-500 mt-1">Track and manage project expenses</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleExportExpenses}
              variant="outline"
              className="gap-2"
              disabled={exportExpenses.isPending}
            >
              <Eye className="w-4 h-4" />
              {exportExpenses.isPending ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              onClick={handleOpenDialog}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              disabled={createExpense.isPending}
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {stats.transactionCount} transactions
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Expense</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₹{Math.round(stats.averageExpense).toLocaleString()}
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
                <p className="text-sm font-medium text-gray-500">Highest Expense</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ₹{stats.highestExpense.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Single transaction
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {Object.keys(stats.categoryTotals).filter(cat => stats.categoryTotals[cat as keyof typeof stats.categoryTotals] > 0).length}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Active categories
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Expenses by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.categoryTotals).map(([category, amount]) => (
              <div key={category} className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-500">{category}</p>
                <p className="text-sm font-bold text-gray-900">₹{amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                {isSearchDebouncing ? (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <Input
                  placeholder="Search expenses by description..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value as typeof categoryFilter);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                {[...new Set(expenses.map(e => e.category))].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={projectFilter}
                onChange={(e) => {
                  setProjectFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={dateRange.start}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, start: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="pl-10 w-full sm:w-40 border-gray-200"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={dateRange.end}
                  onChange={(e) => {
                    setDateRange({ ...dateRange, end: e.target.value });
                    setCurrentPage(1);
                  }}
                  className="pl-10 w-full sm:w-40 border-gray-200"
                />
              </div>
            </div>

            {(debouncedSearchTerm || categoryFilter !== "all" || projectFilter !== "all" || dateRange.start || dateRange.end) && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {debouncedSearchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      Search: {debouncedSearchTerm}
                      <button onClick={() => setSearchTerm("")} className="hover:text-indigo-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {categoryFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      Category: {categoryFilter}
                      <button onClick={() => setCategoryFilter("all")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {projectFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-lg">
                      Project: {projects.find(p => p.id === projectFilter)?.name}
                      <button onClick={() => setProjectFilter("all")}>
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

        {/* Expenses Table */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
            <p className="text-gray-500 mb-4">
              {debouncedSearchTerm || categoryFilter !== "all" || projectFilter !== "all" || dateRange.start || dateRange.end
                ? "Try adjusting your filters"
                : "Get started by adding your first expense"}
            </p>
            {!debouncedSearchTerm && categoryFilter === "all" && projectFilter === "all" && !dateRange.start && !dateRange.end && (
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Expense
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                   <tbody>
                     {expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {new Date(expense.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                            {getCategoryIcon(expense.category)}
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-indigo-600">
                          ₹{parseFloat(expense.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {projects.find(p => p.id === expense.project)?.name || expense.project}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewExpense(expense.id)}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-500 hover:text-blue-700"
                              title="View expense"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-500 hover:text-green-700"
                              title="Edit expense"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(expense.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
                              title="Delete expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Total
                      </td>
                       <td className="px-6 py-4 text-right text-lg font-bold text-indigo-600">
                         ₹{expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toLocaleString()}
                       </td>
                       <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && expenses.length > 0 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, paginationInfo.count)} of {paginationInfo.count} expenses
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={!paginationInfo.previous}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
                      let pageNum;
                      if (paginationInfo.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= paginationInfo.totalPages - 2) {
                        pageNum = paginationInfo.totalPages - 4 + i;
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
                    onClick={() => setCurrentPage(p => Math.min(paginationInfo.totalPages, p + 1))}
                    disabled={!paginationInfo.next}
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

      {/* Add Expense Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter expense description"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[...new Set(expenses.map(e => e.category))].concat(['Labor', 'Materials', 'Equipment', 'Other']).filter((value, index, self) => self.indexOf(value) === index).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
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
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border-gray-200"
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
              disabled={createExpense.isPending}
            >
              {createExpense.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Expense Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Expense Details</DialogTitle>
          </DialogHeader>

          {selectedExpenseLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : selectedExpenseData?.data ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                    {new Date(selectedExpenseData.data.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded font-medium">
                    ₹{parseFloat(selectedExpenseData.data.amount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded">
                  {selectedExpenseData.data.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedExpenseData.data.category)}`}>
                  {getCategoryIcon(selectedExpenseData.data.category)}
                  {selectedExpenseData.data.category}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">
                  {selectedExpenseData.data.project_name || "No project assigned"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Created At
                  </label>
                  <p className="text-xs text-gray-600">
                    {new Date(selectedExpenseData.data.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Updated At
                  </label>
                  <p className="text-xs text-gray-600">
                    {new Date(selectedExpenseData.data.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">Expense not found</p>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setViewDialog(false);
                setSelectedExpenseId(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Expense</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Enter expense description"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    category: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {[...new Set(expenses.map(e => e.category))].concat(['Labor', 'Materials', 'Equipment', 'Other']).filter((value, index, self) => self.indexOf(value) === index).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={editFormData.amount}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={editFormData.project}
                onChange={(e) => setEditFormData({ ...editFormData, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
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
                value={editFormData.date}
                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                className="border-gray-200"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-green-600 hover:bg-green-700"
              disabled={updateExpense.isPending}
            >
              {updateExpense.isPending ? "Updating..." : "Update Expense"}
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
              <h3 className="text-xl font-semibold text-gray-900">Delete Expense</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this expense record? This action cannot be undone.
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
                onClick={() => handleDeleteExpense(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleteExpense.isPending}
              >
                {deleteExpense.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics
      {expenseStatsData?.data && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h4>
              <p className="text-2xl font-bold text-gray-900">₹{(expenseStatsData.data.total_expenses || 0).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Count</h4>
              <p className="text-2xl font-bold text-blue-600">{expenseStatsData.data.transaction_count || 0}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Average Expense</h4>
              <p className="text-2xl font-bold text-green-600">₹{(expenseStatsData.data.average_expense || 0).toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Highest Expense</h4>
              <p className="text-2xl font-bold text-purple-600">₹{(expenseStatsData.data.highest_expense || 0).toLocaleString()}</p>
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {expenseStatsData.data.category_breakdown && Object.entries(expenseStatsData.data.category_breakdown).map(([category, amount]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 font-medium">{category}</p>
                    <p className="text-lg font-bold text-gray-900">₹{(amount || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </Layout>
  );
}

// Missing icon components
const Package = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);