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
import { format } from "date-fns";
import { exportToCSV } from "@/lib/exportUtils";

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"" | "Materials" | "Labor" | "Equipment" | "Other">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Materials" as "Materials" | "Labor" | "Equipment" | "Other",
    description: "",
    amount: 0,
  });

  const handleOpenDialog = (expenseId?: number) => {
    if (expenseId) {
      const expense = expenses.find((e) => e.id === expenseId);
      if (expense) {
        setFormData({
          date: expense.date,
          category: expense.category,
          description: expense.description,
          amount: expense.amount,
        });
        setEditingId(expenseId);
      }
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        category: "Materials",
        description: "",
        amount: 0,
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.description || formData.amount === 0) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      updateExpense(editingId, {
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
      });
    } else {
      addExpense({
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
      });
    }

    setOpenDialog(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpense(id);
    }
  };

  const handleExportExpenses = () => {
    let dataToExport = expenses;

    if (filterCategory) {
      dataToExport = dataToExport.filter(e => e.category === filterCategory);
    }

    if (filterStartDate) {
      dataToExport = dataToExport.filter(e => e.date >= filterStartDate);
    }

    if (filterEndDate) {
      dataToExport = dataToExport.filter(e => e.date <= filterEndDate);
    }

    if (dataToExport.length === 0) {
      alert("No expenses to export");
      return;
    }

    const columns = ["Date", "Description", "Category", "Amount"];
    const rows = dataToExport.map(exp => [
      exp.date,
      exp.description,
      exp.category,
      exp.amount,
    ]);

    const filename = `expenses_${format(new Date(), "yyyy-MM-dd")}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
    setFilterCategory("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const categoryTotals = {
    Materials: expenses
      .filter((e) => e.category === "Materials")
      .reduce((sum, e) => sum + e.amount, 0),
    Labor: expenses
      .filter((e) => e.category === "Labor")
      .reduce((sum, e) => sum + e.amount, 0),
    Equipment: expenses
      .filter((e) => e.category === "Equipment")
      .reduce((sum, e) => sum + e.amount, 0),
    Other: expenses
      .filter((e) => e.category === "Other")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
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
              Add Expense
            </Button>
          </div>
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600 mb-1">Materials</p>
            <p className="text-2xl font-bold text-gray-900">₹{categoryTotals.Materials.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{expenses.filter((e) => e.category === "Materials").length} items</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600 mb-1">Labor</p>
            <p className="text-2xl font-bold text-gray-900">₹{categoryTotals.Labor.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{expenses.filter((e) => e.category === "Labor").length} items</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-600 mb-1">Equipment</p>
            <p className="text-2xl font-bold text-gray-900">₹{categoryTotals.Equipment.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{expenses.filter((e) => e.category === "Equipment").length} items</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <p className="text-xs font-medium text-blue-700 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-900">₹{totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">{expenses.length} transactions</p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            expense.category === "Materials"
                              ? "bg-blue-100 text-blue-700"
                              : expense.category === "Labor"
                              ? "bg-purple-100 text-purple-700"
                              : expense.category === "Equipment"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(expense.id)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
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
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What was purchased?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as
                      | "Materials"
                      | "Labor"
                      | "Equipment"
                      | "Other",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Materials">Materials</option>
                <option value="Labor">Labor</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Expenses</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category (Optional)
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Materials">Materials</option>
                  <option value="Labor">Labor</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Optional)
                </label>
                <Input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <Input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </div>

              <p className="text-sm text-gray-600">
                {expenses.length > 0
                  ? `Total expenses: ${expenses.length}`
                  : "No expenses available"}
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
                onClick={handleExportExpenses}
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
