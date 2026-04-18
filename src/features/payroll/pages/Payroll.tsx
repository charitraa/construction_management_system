import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { usePayrollByMonth, usePayrollSummary } from "../index";

export default function Payroll() {
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { data: payrollData, isLoading: payrollLoading } =
    usePayrollByMonth(selectedMonth);
  const { data: summaryData } = usePayrollSummary(selectedMonth);

  const payroll = payrollData?.data || [];
  const summary = summaryData?.data;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

  if (payrollLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading payroll...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Select Month:
              </label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto"
              />
            </div>
            {payroll.length > 0 && (
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        {summary && selectedMonth && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Wages</h3>
              <p className="text-2xl font-bold text-gray-900">
                ₹{summary.total_wages.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Advances
              </h3>
              <p className="text-2xl font-bold text-orange-600">
                ₹{summary.total_advances.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Net Pay</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{summary.total_net_pay.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Payroll Table */}
        {payroll.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
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
                  {payroll.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {entry.role}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-900">
                        {entry.days_worked}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        ₹{entry.daily_rate}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                        ₹{entry.total_wage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-orange-600">
                        ₹{entry.advance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-green-600 font-bold">
                        ₹{entry.net_pay.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedMonth ? (
          <div className="text-center py-8 text-gray-500">
            No payroll data found for{" "}
            {new Date(selectedMonth + "-01").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Select a month to view payroll data
          </div>
        )}
      </div>
    </Layout>
  );
}
