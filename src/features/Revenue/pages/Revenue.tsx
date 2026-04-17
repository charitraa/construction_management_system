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

export default function Revenue() {
  const { revenues, addRevenue, updateRevenue, deleteRevenue, projects } = useData();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"" | "Received" | "Pending" | "Overdue">("");
  const [filterPayMethod, setFilterPayMethod] = useState<"" | "Cash" | "Online" | "Check">("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    projectId: projects[0]?.id || "",
    clientName: "",
    amount: 0,
    payMethod: "Cash" as "Cash" | "Online" | "Check",
    status: "Received" as "Received" | "Pending" | "Overdue",
  });

  const handleOpenDialog = (revenueId?: number) => {
    if (revenueId) {
      const revenue = revenues.find((r) => r.id === revenueId);
      if (revenue) {
        setFormData({
          date: revenue.date,
          projectId: revenue.projectId,
          clientName: revenue.clientName,
          amount: revenue.amount,
          payMethod: revenue.payMethod,
          status: revenue.status,
        });
        setEditingId(revenueId);
      }
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        projectId: projects[0]?.id || "",
        clientName: "",
        amount: 0,
        payMethod: "Cash",
        status: "Received",
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.projectId || !formData.clientName || formData.amount === 0) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      updateRevenue(editingId, {
        date: formData.date,
        projectId: formData.projectId,
        clientName: formData.clientName,
        amount: formData.amount,
        payMethod: formData.payMethod,
        status: formData.status,
      });
    } else {
      addRevenue({
        date: formData.date,
        projectId: formData.projectId,
        clientName: formData.clientName,
        amount: formData.amount,
        payMethod: formData.payMethod,
        status: formData.status,
      });
    }

    setOpenDialog(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this revenue record?")) {
      deleteRevenue(id);
    }
  };

  const handleExportRevenue = () => {
    let dataToExport = revenues;

    if (filterStatus) {
      dataToExport = dataToExport.filter(r => r.status === filterStatus);
    }

    if (filterPayMethod) {
      dataToExport = dataToExport.filter(r => r.payMethod === filterPayMethod);
    }

    if (filterStartDate) {
      dataToExport = dataToExport.filter(r => r.date >= filterStartDate);
    }

    if (filterEndDate) {
      dataToExport = dataToExport.filter(r => r.date <= filterEndDate);
    }

    if (dataToExport.length === 0) {
      alert("No revenue records to export");
      return;
    }

    const columns = ["Date", "Project", "Client", "Amount", "Payment Method", "Status"];
    const rows = dataToExport.map(rev => {
      const project = projects.find(p => p.id === rev.projectId);
      return [
        rev.date,
        project?.name || "N/A",
        rev.clientName,
        rev.amount,
        rev.payMethod,
        rev.status,
      ];
    });

    const filename = `revenue_${format(new Date(), "yyyy-MM-dd")}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
    setFilterStatus("");
    setFilterPayMethod("");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const receivedRevenue = revenues
    .filter((r) => r.status === "Received")
    .reduce((sum, r) => sum + r.amount, 0);
  const pendingRevenue = revenues
    .filter((r) => r.status === "Pending")
    .reduce((sum, r) => sum + r.amount, 0);
  const overdueRevenue = revenues
    .filter((r) => r.status === "Overdue")
    .reduce((sum, r) => sum + r.amount, 0);

  function StatusBadge({ status }: { status: string }) {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Received":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>{status}</span>;
      case "Pending":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>{status}</span>;
      case "Overdue":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>{status}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
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
              Record Payment
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-gray-500 mt-2">All invoices</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <p className="text-sm font-medium text-green-700 mb-2">Received</p>
            <p className="text-3xl font-bold text-green-900">₹{(receivedRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-green-600 mt-2">{revenues.filter((r) => r.status === "Received").length} payments</p>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
            <p className="text-sm font-medium text-yellow-700 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">₹{(pendingRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-yellow-600 mt-2">{revenues.filter((r) => r.status === "Pending").length} payments</p>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <p className="text-sm font-medium text-red-700 mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-900">₹{(overdueRevenue / 100000).toFixed(1)}L</p>
            <p className="text-xs text-red-600 mt-2">{revenues.filter((r) => r.status === "Overdue").length} payments</p>
          </div>
        </div>

        {/* Payment Transactions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Project
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenues
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((revenue) => {
                    const project = projects.find((p) => p.id === revenue.projectId);
                    return (
                      <tr
                        key={revenue.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {format(new Date(revenue.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {project?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {revenue.clientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                          ₹{revenue.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {revenue.payMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={revenue.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenDialog(revenue.id)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(revenue.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Payment Record" : "Record New Payment"}
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
                Project
              </label>
              <select
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <Input
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                placeholder="Enter client name"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.payMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payMethod: e.target.value as "Cash" | "Online" | "Check",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Received" | "Pending" | "Overdue",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Received">Received</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
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
              {editingId ? "Update" : "Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Revenue</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status (Optional)
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Received">Received</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Payment Method (Optional)
                </label>
                <select
                  value={filterPayMethod}
                  onChange={(e) => setFilterPayMethod(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Check">Check</option>
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
                {revenues.length > 0
                  ? `Total records: ${revenues.length}`
                  : "No revenue records available"}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowExportModal(false);
                  setFilterStartDate("");
                  setFilterEndDate("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExportRevenue}
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
