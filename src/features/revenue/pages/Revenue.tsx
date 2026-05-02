import { useState, useMemo } from "react";
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
  Building2,
  User,
  Trash2,
  Edit2,
  Eye,
  Download
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useListRevenue, useCreateRevenue, useListProjects } from "../index";

export default function Revenue() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState<"all" | string>("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const itemsPerPage = 8;

  const { data: revenueData, isLoading: revenueLoading } = useListRevenue();
  const { data: projectsData } = useListProjects();
  const createRevenue = useCreateRevenue();

  const revenue = revenueData?.data || [];
  const projects = projectsData?.data || [];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    client_name: "",
    description: "",
    amount: "",
    project: "",
  });

  // Filter revenue
  const filteredRevenue = useMemo(() => {
    let filtered = revenue;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.client_name && item.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (projectFilter !== "all") {
      filtered = filtered.filter(item => item.project === projectFilter);
    }

    if (dateRange.start) {
      filtered = filtered.filter(item => item.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => item.date <= dateRange.end);
    }

    return filtered;
  }, [revenue, searchTerm, projectFilter, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredRevenue.length / itemsPerPage);
  const paginatedRevenue = filteredRevenue.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = revenue.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const averageRevenue = revenue.length > 0 ? totalAmount / revenue.length : 0;
    const highestRevenue = revenue.length > 0 ? Math.max(...revenue.map(item => parseFloat(item.amount))) : 0;
    const projectRevenue = projects.map(project => ({
      name: project.name,
      total: revenue.filter(item => item.project === project.id).reduce((sum, item) => sum + parseFloat(item.amount), 0)
    })).filter(p => p.total > 0);

    return {
      totalAmount,
      averageRevenue,
      highestRevenue,
      transactionCount: revenue.length,
      projectRevenue,
    };
  }, [revenue, projects]);

  const handleOpenDialog = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      client_name: "",
      description: "",
      amount: "",
      project: projects[0]?.id || "",
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.description || !formData.amount || !formData.project || !formData.client_name) {
      alert("Please fill all required fields");
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (amountNum <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    createRevenue.mutate({
      date: formData.date,
      client_name: formData.client_name,
      description: formData.description,
      amount: formData.amount.toString(),
      project: formData.project,
    });

    setOpenDialog(false);
  };

  const handleDeleteRevenue = (revenueId: string) => {
    alert("Delete functionality will be implemented when API is ready");
    setShowDeleteConfirm(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProjectFilter("all");
    setDateRange({ start: "", end: "" });
    setCurrentPage(1);
  };

  const handleExportData = () => {
    const exportData = filteredRevenue.map(item => {
      const project = projects.find(p => p.id === item.project);
      return {
        Date: item.date,
        'Client Name': item.client_name || 'N/A',
        Description: item.description,
        Amount: `₹${parseFloat(item.amount).toLocaleString()}`,
        Project: project?.name || item.project,
      };
    });

    const headers = Object.keys(exportData[0] || {});
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (revenueLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading revenue records...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Revenue</h1>
            <p className="text-gray-500 mt-1">Track and manage all revenue streams</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="gap-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
              disabled={filteredRevenue.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={handleOpenDialog}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              disabled={createRevenue.isPending}
            >
              <Plus className="w-4 h-4" />
              Add Revenue
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {stats.transactionCount} transactions
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Revenue</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₹{Math.round(stats.averageRevenue).toLocaleString()}
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
                <p className="text-sm font-medium text-gray-500">Highest Revenue</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ₹{stats.highestRevenue.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {stats.projectRevenue.length}
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              With revenue
            </div>
          </div>
        </div>

        {/* Project Revenue Breakdown */}
        {stats.projectRevenue.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue by Project</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.projectRevenue.slice(0, 6).map((project) => (
                <div key={project.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700">{project.name}</span>
                  <span className="text-sm font-bold text-emerald-600">₹{project.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by description or client name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>

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

            {(searchTerm || projectFilter !== "all" || dateRange.start || dateRange.end) && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                      Search: {searchTerm}
                      <button onClick={() => setSearchTerm("")} className="hover:text-emerald-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {projectFilter !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                      Project: {projects.find(p => p.id === projectFilter)?.name}
                      <button onClick={() => setProjectFilter("all")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.start && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
                      From: {dateRange.start}
                      <button onClick={() => setDateRange({ ...dateRange, start: "" })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {dateRange.end && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg">
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

        {/* Revenue Table */}
        {paginatedRevenue.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No revenue records found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || projectFilter !== "all" || dateRange.start || dateRange.end
                ? "Try adjusting your filters"
                : "Get started by adding your first revenue entry"}
            </p>
            {!searchTerm && projectFilter === "all" && !dateRange.start && !dateRange.end && (
              <Button onClick={handleOpenDialog} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4" />
                Add Revenue
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRevenue.map((item) => {
                      const project = projects.find(p => p.id === item.project);
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-400" />
                              {item.client_name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-emerald-600">
                            ₹{parseFloat(item.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {project?.name || item.project}
                          </td>
                          <td className="px-6 py-4 text-sm text-center">
                            <button
                              onClick={() => setShowDeleteConfirm(item.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
                              title="Delete revenue"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t border-gray-200">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-semibold text-gray-900">
                        Total Revenue
                      </td>
                      <td className="px-6 py-4 text-right text-lg font-bold text-emerald-600">
                        ₹{filteredRevenue.reduce((sum, item) => sum + parseFloat(item.amount), 0).toLocaleString()}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRevenue.length)} of {filteredRevenue.length} records
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
                          className={`w-9 ${currentPage === pageNum ? "bg-emerald-600" : ""}`}
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

      {/* Add Revenue Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Revenue</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Enter client name"
                className="border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter revenue description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
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
                    amount: e.target.value,
                  })
                }
                placeholder="Enter amount"
                className="border-gray-200"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={createRevenue.isPending}
            >
              {createRevenue.isPending ? "Adding..." : "Add Revenue"}
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
              <h3 className="text-xl font-semibold text-gray-900">Delete Revenue Record</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this revenue record? This action cannot be undone.
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
                onClick={() => handleDeleteRevenue(showDeleteConfirm)}
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