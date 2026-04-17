import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { exportToCSV } from "@/lib/exportUtils";

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterRole, setFilterRole] = useState<"" | "Mason" | "Labor">("");
  const [formData, setFormData] = useState({
    name: "",
    role: "Labor" as "Mason" | "Labor",
    dailyRate: 0,
    phone: "",
  });

  const handleOpenDialog = (employeeId?: number) => {
    if (employeeId) {
      const employee = employees.find((e) => e.id === employeeId);
      if (employee) {
        setFormData({
          name: employee.name,
          role: employee.role,
          dailyRate: employee.dailyRate,
          phone: employee.phone,
        });
        setEditingId(employeeId);
      }
    } else {
      setFormData({
        name: "",
        role: "Labor",
        dailyRate: 0,
        phone: "",
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone || formData.dailyRate === 0) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      updateEmployee(editingId, {
        name: formData.name,
        role: formData.role,
        dailyRate: formData.dailyRate,
        phone: formData.phone,
      });
    } else {
      addEmployee({
        name: formData.name,
        role: formData.role,
        dailyRate: formData.dailyRate,
        phone: formData.phone,
      });
    }

    setOpenDialog(false);
    setFormData({
      name: "",
      role: "Labor",
      dailyRate: 0,
      phone: "",
    });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  const handleExportEmployees = () => {
    const dataToExport = filterRole
      ? employees.filter(emp => emp.role === filterRole)
      : employees;

    if (dataToExport.length === 0) {
      alert("No employees to export");
      return;
    }

    const columns = ["Name", "Role", "Daily Rate", "Phone"];
    const rows = dataToExport.map(emp => [
      emp.name,
      emp.role,
      emp.dailyRate,
      emp.phone,
    ]);

    const filename = `employees_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
    setFilterRole("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowExportModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Daily Rate
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          employee.role === "Mason"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{employee.dailyRate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDialog(employee.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Count */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-600">
            Total Employees: <span className="font-bold text-gray-900">{employees.length}</span>
          </p>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as "Mason" | "Labor",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Labor">Labor</option>
                <option value="Mason">Mason</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Rate (₹)
              </label>
              <Input
                type="number"
                value={formData.dailyRate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyRate: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter daily rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Employees</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Role (Optional)
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as "" | "Mason" | "Labor")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="Labor">Labor</option>
                  <option value="Mason">Mason</option>
                </select>
              </div>

              <p className="text-sm text-gray-600">
                {filterRole
                  ? `${employees.filter(e => e.role === filterRole).length} employee(s) found`
                  : `Total employees: ${employees.length}`}
              </p>
            </div>

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
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
