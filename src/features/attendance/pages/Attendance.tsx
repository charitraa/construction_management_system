import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useListAttendance,
  useCreateAttendance,
  useAttendanceStats,
  useListEmployees,
} from "../index";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    employee: "",
    status: "Present" as "Present" | "Absent",
  });

  const { data: attendanceData, isLoading: attendanceLoading } =
    useListAttendance();
  const { data: employeesData } = useListEmployees();
  const { data: statsData } = useAttendanceStats(selectedDate);
  const createAttendance = useCreateAttendance();

  const attendance = attendanceData?.data || [];
  const employees = employeesData?.data || [];
  const stats = statsData?.data;

  const handleOpenDialog = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      employee: employees[0]?.id || "",
      status: "Present",
    });
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (!formData.employee || !formData.date) {
      alert("Please fill all fields");
      return;
    }

    createAttendance.mutate({
      date: formData.date,
      employee: formData.employee,
      status: formData.status,
    });

    setShowAddDialog(false);
  };

  // Filter attendance by selected date
  const filteredAttendance = selectedDate
    ? attendance.filter((record) => record.date === selectedDate)
    : attendance;

  if (attendanceLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading attendance...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenDialog}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createAttendance.isPending}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Select Date:
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            {selectedDate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate("")}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        {stats && selectedDate && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Employees
              </h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Present</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.present}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Absent</h3>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Recorded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {record.employee_name || record.employee}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAttendance.length === 0 && selectedDate && (
          <div className="text-center py-8 text-gray-500">
            No attendance records found for{" "}
            {new Date(selectedDate).toLocaleDateString()}
          </div>
        )}

        {filteredAttendance.length === 0 && !selectedDate && (
          <div className="text-center py-8 text-gray-500">
            Select a date to view attendance records
          </div>
        )}
      </div>

      {/* Add Attendance Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <select
                value={formData.employee}
                onChange={(e) =>
                  setFormData({ ...formData, employee: e.target.value })
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Present" | "Absent",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createAttendance.isPending}
            >
              {createAttendance.isPending ? "Saving..." : "Save Attendance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
