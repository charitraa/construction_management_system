import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useData } from "@/context/DataContext";
import { format } from "date-fns";

export default function Advance() {
  const { advances, employees, addAdvance, deleteAdvance } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    employeeId: employees[0]?.id || 0,
    amount: 0,
  });

  const handleOpenDialog = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      employeeId: employees[0]?.id || 0,
      amount: 0,
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.employeeId || formData.amount === 0) {
      alert("Please fill all fields");
      return;
    }

    addAdvance({
      date: formData.date,
      employeeId: formData.employeeId,
      amount: formData.amount,
    });

    setOpenDialog(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      employeeId: employees[0]?.id || 0,
      amount: 0,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this advance record?")) {
      deleteAdvance(id);
    }
  };

  const totalAdvance = advances.reduce((sum, adv) => sum + adv.amount, 0);
  
  // Group by employee
  const advancesByEmployee = employees.map((emp) => {
    const empAdvances = advances.filter((a) => a.employeeId === emp.id);
    const total = empAdvances.reduce((sum, a) => sum + a.amount, 0);
    return { employee: emp, advances: empAdvances, total };
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Advance Payments</h1>
          <Button
            onClick={handleOpenDialog}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Give Advance
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Advance Given</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalAdvance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">{advances.length} transactions</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Employees with Advance</p>
            <p className="text-3xl font-bold text-gray-900">{advancesByEmployee.filter((a) => a.total > 0).length}</p>
            <p className="text-xs text-gray-500 mt-2">Out of {employees.length} employees</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Avg Advance</p>
            <p className="text-3xl font-bold text-gray-900">₹{advances.length > 0 ? Math.round(totalAdvance / advances.length).toLocaleString() : 0}</p>
            <p className="text-xs text-gray-500 mt-2">Per transaction</p>
          </div>
        </div>

        {/* Employee-wise Advances */}
        <div className="space-y-4">
          {advancesByEmployee.map((item) => (
            <div key={item.employee.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.employee.name}</h3>
                  <p className="text-xs text-gray-500">{item.employee.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{item.total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.advances.length} advances</p>
                </div>
              </div>
              
              {item.advances.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.advances
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((adv) => (
                          <tr key={adv.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-3 text-gray-700">{format(new Date(adv.date), "MMM dd, yyyy")}</td>
                            <td className="px-6 py-3 text-right font-semibold text-gray-900">₹{adv.amount.toLocaleString()}</td>
                            <td className="px-6 py-3">
                              <button
                                onClick={() => handleDelete(adv.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
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
      </div>

      {/* Add Advance Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Give Advance to Employee</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              Give Advance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
