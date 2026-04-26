import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit2,
  Trash2,
  Download,
  Search,
  Users,
  Briefcase,
  Phone,
  DollarSign,
  UserPlus,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useListEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployeeStats,
  useExportEmployees,
} from "../index";

export default function Employees() {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<"" | "Mason" | "Labor">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data: employeesData, isLoading: employeesLoading } = useListEmployees({
    search: searchQuery || undefined,
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

  const [formData, setFormData] = useState({
    name: "",
    role: "Labor" as "Mason" | "Labor",
    daily_rate: 0,
    phone: "",
    address: "",
  });

  // Server-side pagination - no client-side filtering needed
  const totalCount = employeesData?.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const paginatedEmployees = employees;

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
      setFormData({
        name: "",
        role: "Labor",
        daily_rate: 0,
        phone: "",
        address: "",
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Name must be less than 100 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      errors.name = "Name can only contain letters and spaces";
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Role is required";
    }

    // Daily rate validation
    if (formData.daily_rate === 0 || formData.daily_rate === null || formData.daily_rate === undefined) {
      errors.daily_rate = "Daily rate is required";
    } else if (formData.daily_rate < 0) {
      errors.daily_rate = "Daily rate must be positive";
    } else if (formData.daily_rate > 100000) {
      errors.daily_rate = "Daily rate is too high";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9+\s-]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
    } else if (!/^\+?[0-9\s-]+$/.test(formData.phone.trim())) {
      errors.phone = "Phone can only contain numbers, spaces, hyphens, and +";
    }

    // Address validation (optional but if provided, validate)
    if (formData.address && formData.address.trim().length > 200) {
      errors.address = "Address must be less than 200 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const employeeData = {
      name: formData.name.trim(),
      role: formData.role,
      daily_rate: formData.daily_rate,
      phone: formData.phone.trim(),
      address: formData.address?.trim() || undefined,
    };

    if (editingId) {
      updateEmployee.mutate({ id: editingId, data: employeeData });
    } else {
      createEmployee.mutate(employeeData);
    }

    setOpenDialog(false);
    setFormData({
      name: "",
      role: "Labor",
      daily_rate: 0,
      phone: "",
      address: "",
    });
    setValidationErrors({});
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteEmployee.mutate(id);
    setShowDeleteConfirm(null);
  };

  const handleExportEmployees = () => {
    exportEmployees.mutate();
    setShowExportModal(false);
  };

  const clearFilters = () => {
    setFilterRole("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  if (employeesLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading employees...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Employees</h1>
            <p className="text-gray-500 mt-1">Manage your workforce and team members</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="gap-2 border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
              disabled={exportEmployees.isPending}
            >
              <Download className="w-4 h-4" />
              {exportEmployees.isPending ? "Exporting..." : "Export"}
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
              disabled={createEmployee.isPending || updateEmployee.isPending}
            >
              <UserPlus className="w-4 h-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Active workforce
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Masons</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{stats.Mason}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Skilled workers
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Labor</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.Labor}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Support staff
              </div>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value as "" | "Mason" | "Labor");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
              >
                <option value="">All Roles</option>
                <option value="Mason">Mason</option>
                <option value="Labor">Labor</option>
              </select>

              {(filterRole || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Employees Grid */}
        {paginatedEmployees.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterRole ? "Try adjusting your filters" : "Get started by adding your first employee"}
            </p>
            {!searchQuery && !filterRole && (
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg ${employee.role === "Mason"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gradient-to-br from-purple-500 to-purple-600"
                        }`}>
                        {employee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{employee.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${employee.role === "Mason"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                          }`}>
                          {employee.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenDialog(employee.id)}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-indigo-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(employee.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Daily Rate: <span className="font-semibold text-gray-900">Rs. {parseFloat(employee.daily_rate).toFixed(2)}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{employee.phone}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} employees
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || !employeesData?.previous}
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
                    disabled={currentPage === totalPages || !employeesData?.next}
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

      {/* Add/Edit Employee Dialog */}
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) {
            setValidationErrors({});
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingId ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 px-1 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter employee name"
                  className={`border-gray-200 ${validationErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      role: e.target.value as "Mason" | "Labor",
                    });
                    if (validationErrors.role) {
                      setValidationErrors((prev) => ({ ...prev, role: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white ${validationErrors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'}`}
                >
                  <option value="Labor">Labor</option>
                  <option value="Mason">Mason</option>
                </select>
                {validationErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate (Rs.) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.daily_rate}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      daily_rate: parseInt(e.target.value) || 0,
                    });
                    if (validationErrors.daily_rate) {
                      setValidationErrors((prev) => ({ ...prev, daily_rate: '' }));
                    }
                  }}
                  placeholder="Enter daily rate"
                  className={`border-gray-200 ${validationErrors.daily_rate ? 'border-red-500 focus:ring-red-500' : ''}`}
                  min="0"
                  max="100000"
                />
                {validationErrors.daily_rate && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.daily_rate}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (validationErrors.phone) {
                      setValidationErrors((prev) => ({ ...prev, phone: '' }));
                    }
                  }}
                  placeholder="Enter phone number (e.g., 9812356893)"
                  className={`border-gray-200 ${validationErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address (Optional)
                </label>
                <Input
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (validationErrors.address) {
                      setValidationErrors((prev) => ({ ...prev, address: '' }));
                    }
                  }}
                  placeholder="Enter address"
                  className={`border-gray-200 ${validationErrors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setOpenDialog(false);
                setValidationErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={createEmployee.isPending || updateEmployee.isPending}
            >
              {createEmployee.isPending ? "Adding..." : updateEmployee.isPending ? "Updating..." : editingId ? "Update Employee" : "Add Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Export Employees</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Download all employee records as a CSV file. The export includes names, roles, rates, and contact information.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowExportModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExportEmployees}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2"
                disabled={exportEmployees.isPending}
              >
                <Download className="w-4 h-4" />
                {exportEmployees.isPending ? "Downloading..." : "Download CSV"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Employee</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
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
                onClick={() => handleDelete(showDeleteConfirm)}
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