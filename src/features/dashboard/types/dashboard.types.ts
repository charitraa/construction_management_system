export interface MainStats {
  total_revenue: number;
  total_expenses: number;
  profit: number;
  labor_cost: number;
  material_cost: number;
  revenue_trend: number;
  expenses_trend: number;
  profit_trend: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseDistribution {
  name: string;
  value: number;
  color: string;
  amount: number;
}

export interface QuickStats {
  active_projects: number;
  total_employees: number;
  attendance_rate: number;
}

export interface DashboardData {
  main_stats: MainStats;
  monthly_trends: MonthlyTrend[];
  expense_distribution: ExpenseDistribution[];
  quick_stats: QuickStats;
}

export interface DashboardOverviewResponse {
  data: DashboardData;
  message: string;
}
