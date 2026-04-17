import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter } from "lucide-react";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { useData } from "@/context/DataContext";
import { exportToCSV } from "@/lib/exportUtils";

export default function Attendance() {
  const { employees, attendance, addAttendance, updateAttendance, getAttendanceByDate } = useData();
  
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const dateStr = selectedDate;
  const todayAttendance = selectedDate ? getAttendanceByDate(dateStr) : [];

  const handleStatusChange = (employeeId: number, status: "Present" | "Absent") => {
    const existing = todayAttendance.find((a) => a.employeeId === employeeId);
    if (existing) {
      updateAttendance(existing.id, {
        date: dateStr,
        employeeId,
        status,
      });
    } else {
      addAttendance({
        date: dateStr,
        employeeId,
        status,
      });
    }
  };

  const handleSaveAttendance = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setSelectedDate("");
    }, 2000);
  };

  const handleExportAttendance = () => {
    const dataToExport = filterStartDate && filterEndDate 
      ? attendance.filter(record => {
          const recordDate = record.date;
          return recordDate >= filterStartDate && recordDate <= filterEndDate;
        })
      : attendance;

    if (dataToExport.length === 0) {
      alert("No attendance records to export");
      return;
    }

    const columns = ["Date", "Employee Name", "Status"];
    const rows = dataToExport.map(record => {
      const employee = employees.find(e => e.id === record.employeeId);
      return [
        record.date,
        employee?.name || "Unknown",
        record.status,
      ];
    });

    const filename = `attendance_${format(new Date(), "yyyy-MM-dd_HHmmss")}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
  };

  const presentCount = todayAttendance.filter((a) => a.status === "Present").length;
  const absentCount = todayAttendance.filter((a) => a.status === "Absent").length;
  const totalRecorded = presentCount + absentCount;

  // Get today's date in YYYY-MM-DD format for input min attribute
  const todayStr = format(today, "yyyy-MM-dd");

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <Button
            onClick={() => setShowExportModal(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>

        {/* Step 1: Date Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Step 1: Select Date</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Select a date to mark attendance. You can only select today or future dates.
          </p>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={todayStr}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedDate && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              Selected: {format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM dd, yyyy")}
            </p>
          )}
        </div>

        {/* Step 2: Mark Attendance */}
        {selectedDate && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <p className="text-sm text-blue-700 font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900">{employees.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-700 font-medium">Present</p>
                <p className="text-2xl font-bold text-green-900">{presentCount}</p>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <p className="text-sm text-red-700 font-medium">Absent</p>
                <p className="text-2xl font-bold text-red-900">{absentCount}</p>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Step 2: Mark Attendance
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click Present or Absent for each employee
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Employee Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Mark Attendance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => {
                      const record = todayAttendance.find((a) => a.employeeId === employee.id);
                      const isPresent = record?.status === "Present";
                      const isAbsent = record?.status === "Absent";
                      const isMarked = isPresent || isAbsent;

                      return (
                        <tr
                          key={employee.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {employee.role}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStatusChange(employee.id, "Present")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isPresent
                                    ? "bg-green-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                ✓ Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(employee.id, "Absent")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isAbsent
                                    ? "bg-red-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                ✗ Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {employees.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No employees found. Please add employees first.
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setSelectedDate("")}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAttendance}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {isSaved ? "✓ Saved!" : "Save Attendance"}
              </Button>
            </div>
          </>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Attendance Data</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-sm text-gray-600">
                  {attendance.length > 0
                    ? `Total records: ${attendance.length}`
                    : "No attendance records available"}
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
                  onClick={handleExportAttendance}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
