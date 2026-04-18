import { Layout } from "@/components/Layout";
import { useDashboardOverview } from "../index";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboardOverview();

  const data = dashboardData?.data;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {data && (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{(data.main_stats.total_revenue / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-green-600 mt-2">
                  +{data.main_stats.revenue_trend}%
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-red-600">
                  ₹{(data.main_stats.total_expenses / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-red-600 mt-2">
                  {data.main_stats.expenses_trend}%
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">Profit</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{(data.main_stats.profit / 100000).toFixed(1)}L
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  +{data.main_stats.profit_trend}%
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Labor Cost
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  ₹{(data.main_stats.labor_cost / 100000).toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Active Projects
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.quick_stats.active_projects}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Employees
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.quick_stats.total_employees}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Attendance Rate
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {data.quick_stats.attendance_rate}%
                </p>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Monthly Trends
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart will be implemented with a charting library
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Expense Distribution
                </h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Chart will be implemented with a charting library
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
