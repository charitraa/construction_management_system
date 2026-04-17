import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { useState } from "react";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";

export default function Payroll() {
  const { employees, attendance, advances } = useData();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMonth, setExportMonth] = useState(selectedMonth);

  const getPayrollForMonth = () => {
    const [year, month] = selectedMonth.split("-");

    return employees.map((emp) => {
      // Count days present in the selected month
      const daysWorked = attendance.filter((a) => {
        const aDate = a.date.slice(0, 7);
        return aDate === selectedMonth && a.employeeId === emp.id && a.status === "Present";
      }).length;

      const totalWage = daysWorked * emp.dailyRate;

      // Get total advance for this employee
      const totalAdvance = advances
        .filter((a) => a.employeeId === emp.id)
        .reduce((sum, a) => sum + a.amount, 0);

      const netPay = totalWage - totalAdvance;

      return {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        daysWorked,
        dailyRate: emp.dailyRate,
        totalWage,
        advance: totalAdvance,
        netPay,
      };
    });
  };

  const payrollData = getPayrollForMonth();
  const totalWage = payrollData.reduce((sum, emp) => sum + emp.totalWage, 0);
  const totalAdvance = payrollData.reduce((sum, emp) => sum + emp.advance, 0);
  const totalNetPay = payrollData.reduce((sum, emp) => sum + emp.netPay, 0);

  const handleExportPayroll = () => {
    const [year, month] = exportMonth.split("-");

    const columns = ["Employee Name", "Role", "Days Worked", "Daily Rate", "Total Wage", "Advance", "Net Pay"];
    const rows: (string | number)[][] = [];

    // Get payroll data for the selected month
    const exportPayrollData = employees.map((emp) => {
      const daysWorked = attendance.filter((a) => {
        const aDate = a.date.slice(0, 7);
        return aDate === exportMonth && a.employeeId === emp.id && a.status === "Present";
      }).length;

      const totalWage = daysWorked * emp.dailyRate;
      const totalAdvance = advances
        .filter((a) => a.employeeId === emp.id)
        .reduce((sum, a) => sum + a.amount, 0);
      const netPay = totalWage - totalAdvance;

      return {
        name: emp.name,
        role: emp.role,
        daysWorked,
        dailyRate: emp.dailyRate,
        totalWage,
        advance: totalAdvance,
        netPay,
      };
    });

    rows.push(
      ...exportPayrollData.map(record => [
        record.name,
        record.role,
        record.daysWorked,
        record.dailyRate,
        record.totalWage,
        record.advance,
        record.netPay,
      ])
    );

    const filename = `payroll_${exportMonth}`;
    exportToCSV(filename, columns, rows);
    setShowExportModal(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-700 mr-2">Select Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setExportMonth(selectedMonth);
                setShowExportModal(true);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Generate Payslip
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Wages</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalWage.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">All employees</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Advance</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalAdvance.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Paid out</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Net Pay</p>
            <p className="text-3xl font-bold text-green-600">₹{totalNetPay.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">To be paid</p>
          </div>
        </div>

        {/* Payroll Table */}
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
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Days Worked
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Daily Rate
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Total Wage
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Advance
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Net Pay
                  </th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {record.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.role === "Mason"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {record.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      {record.daysWorked}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      ₹{record.dailyRate}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                      ₹{record.totalWage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      ₹{record.advance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-green-600 font-semibold">
                      ₹{record.netPay.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">TOTAL WAGES</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalWage.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">TOTAL ADVANCE</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalAdvance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">TOTAL NET PAY</p>
              <p className="text-2xl font-bold text-green-600">₹{totalNetPay.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Payroll</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Month
                  </label>
                  <input
                    type="month"
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-sm text-gray-600">
                  {payrollData.length > 0
                    ? `${payrollData.length} employees in payroll`
                    : "No payroll data available"}
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
                  onClick={handleExportPayroll}
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
