import { BarChart3, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";
import { Layout } from "@/components/Layout";

// Mock data for charts
const monthlyData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 38000 },
  { month: "Mar", revenue: 48000, expenses: 35000 },
  { month: "Apr", revenue: 61000, expenses: 42000 },
  { month: "May", revenue: 55000, expenses: 40000 },
  { month: "Jun", revenue: 67000, expenses: 45000 },
];

const expenseCategories = [
  { name: "Labor", value: 45, color: "#3B82F6" },
  { name: "Materials", value: 35, color: "#60A5FA" },
  { name: "Equipment", value: 15, color: "#93C5FD" },
  { name: "Other", value: 5, color: "#DBEAFE" },
];

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                trend >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function SimpleBarChart() {
  const maxValue = Math.max(
    ...monthlyData.flatMap((d) => [d.revenue, d.expenses])
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Revenue vs Expenses
      </h3>
      <div className="space-y-6">
        {monthlyData.map((data) => (
          <div key={data.month}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {data.month}
              </span>
              <span className="text-xs text-gray-500">
                ${(data.revenue / 1000).toFixed(0)}k / ${(data.expenses / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex gap-2 h-8">
              <div
                className="bg-blue-600 rounded-sm transition-all hover:bg-blue-700"
                style={{
                  width: `${(data.revenue / maxValue) * 100}%`,
                  minWidth: "4px",
                }}
                title={`Revenue: $${data.revenue}`}
              />
              <div
                className="bg-gray-300 rounded-sm transition-all hover:bg-gray-400"
                style={{
                  width: `${(data.expenses / maxValue) * 100}%`,
                  minWidth: "4px",
                }}
                title={`Expenses: $${data.expenses}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-600" />
          <span className="text-xs text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-xs text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  );
}

function SimplePieChart() {
  const total = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Expense Distribution
      </h3>
      <div className="flex items-center justify-between gap-8">
        <div className="flex-1">
          <svg viewBox="0 0 120 120" className="w-full max-w-xs mx-auto">
            {expenseCategories.map((cat, index) => {
              const percentage = cat.value / total;
              const circumference = 2 * Math.PI * 45;
              const strokeDashoffset =
                circumference - percentage * circumference;
              const rotation = expenseCategories
                .slice(0, index)
                .reduce((sum, c) => sum + (c.value / total) * 360, 0);

              return (
                <circle
                  key={cat.name}
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(${rotation} 60 60)`}
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-3">
          {expenseCategories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Revenue"
            value="$328,000"
            icon={TrendingUp}
            trend={12}
            bgColor="bg-blue-600"
          />
          <StatCard
            title="Total Expenses"
            value="$232,000"
            icon={Zap}
            trend={-5}
            bgColor="bg-orange-600"
          />
          <StatCard
            title="Profit"
            value="$96,000"
            icon={BarChart3}
            trend={18}
            bgColor="bg-green-600"
          />
          <StatCard
            title="Labor Cost"
            value="$156,000"
            icon={Users}
            trend={3}
            bgColor="bg-purple-600"
          />
          <StatCard
            title="Material Cost"
            value="$76,000"
            icon={BarChart3}
            trend={8}
            bgColor="bg-cyan-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SimpleBarChart />
          </div>
          <div>
            <SimplePieChart />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-4">
              Active Projects
            </h4>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-2">Ongoing construction</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-4">
              Total Employees
            </h4>
            <p className="text-3xl font-bold text-gray-900">48</p>
            <p className="text-xs text-gray-500 mt-2">Full-time & Contract</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-4">
              Attendance Rate
            </h4>
            <p className="text-3xl font-bold text-gray-900">94%</p>
            <p className="text-xs text-gray-500 mt-2">Current month</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
