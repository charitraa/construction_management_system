/**
 * Sample data for the marketing product previews.
 *
 * Every field here maps 1:1 onto a field the real API actually returns
 * (see src/features/<module>/types). The records themselves are illustrative
 * sample data, not customer data — previews are labelled "Sample data" in the UI.
 */

export const CURRENCY = "Rs";

/** Rs 1,74,00,000 style grouping (South-Asian lakh/crore), matching the app. */
export function formatRs(value: number): string {
  const n = Math.round(Math.abs(value));
  const s = String(n);
  let out: string;
  if (s.length <= 3) {
    out = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    out = `${rest},${last3}`;
  }
  return `${value < 0 ? "-" : ""}${CURRENCY} ${out}`;
}

/** Compact form used on stat tiles, mirroring the dashboard's `fmt` helper. */
export function formatRsShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 100000) return `${CURRENCY} ${(value / 100000).toFixed(2)}L`;
  if (abs >= 1000) return `${CURRENCY} ${(value / 1000).toFixed(1)}K`;
  return `${CURRENCY} ${value.toFixed(0)}`;
}

/* ── Projects ─────────────────────────────────────────────── */

export type ProjectStatus = "ongoing" | "completed" | "delayed";

export interface DemoProject {
  name: string;
  client_name: string;
  location: string;
  status: ProjectStatus;
  budget: number;
  received: number;
  progress: number; // derived from start date in the app
  start_date: string;
}

export const DEMO_PROJECTS: DemoProject[] = [
  {
    name: "Lalitpur Residence",
    client_name: "R. Maharjan",
    location: "Jhamsikhel, Lalitpur",
    status: "ongoing",
    budget: 2500000,
    received: 1740000,
    progress: 82,
    start_date: "2025-11-04",
  },
  {
    name: "Commercial Complex",
    client_name: "Himal Traders",
    location: "New Baneshwor",
    status: "ongoing",
    budget: 8400000,
    received: 5100000,
    progress: 67,
    start_date: "2026-01-12",
  },
  {
    name: "Office Building — Block B",
    client_name: "Sunrise Group",
    location: "Chabahil",
    status: "delayed",
    budget: 4200000,
    received: 1950000,
    progress: 74,
    start_date: "2025-08-21",
  },
  {
    name: "Warehouse Extension",
    client_name: "Everest Logistics",
    location: "Balaju",
    status: "completed",
    budget: 1650000,
    received: 1650000,
    progress: 100,
    start_date: "2025-05-02",
  },
];

export const DEMO_PROJECT_STATS = {
  total: 14,
  ongoing: 8,
  completed: 4,
  delayed: 2,
};

/* ── Employees ────────────────────────────────────────────── */

export interface DemoEmployee {
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number;
  phone: string;
  attendance: "Full Day" | "Half Day" | "Absent";
}

export const DEMO_EMPLOYEES: DemoEmployee[] = [
  { name: "Ram Sharma", role: "Mason", daily_rate: 1800, phone: "98•• ••4412", attendance: "Full Day" },
  { name: "Sita Thapa", role: "Mason", daily_rate: 1750, phone: "98•• ••7730", attendance: "Full Day" },
  { name: "Bikash Gurung", role: "Labor", daily_rate: 1200, phone: "98•• ••1096", attendance: "Half Day" },
  { name: "Anita Rai", role: "Labor", daily_rate: 1200, phone: "98•• ••5521", attendance: "Full Day" },
  { name: "Krishna Tamang", role: "Labor", daily_rate: 1150, phone: "98•• ••8834", attendance: "Absent" },
];

export const DEMO_EMPLOYEE_STATS = { total: 32, Mason: 11, Labor: 21 };

export const DEMO_ATTENDANCE_STATS = {
  total: 32,
  present: 28,
  absent: 4,
  percentage: 87.5,
};

/* ── Payroll ──────────────────────────────────────────────── */

export interface DemoPayrollRow {
  name: string;
  role: string;
  days: number;
  daily_rate: number;
  wage: number;
  advance: number;
  net: number;
}

export const DEMO_PAYROLL: DemoPayrollRow[] = [
  { name: "Ram Sharma", role: "Mason", days: 24, daily_rate: 1800, wage: 43200, advance: 8000, net: 35200 },
  { name: "Sita Thapa", role: "Mason", days: 22, daily_rate: 1750, wage: 38500, advance: 5000, net: 33500 },
  { name: "Bikash Gurung", role: "Labor", days: 25, daily_rate: 1200, wage: 30000, advance: 12000, net: 18000 },
  { name: "Anita Rai", role: "Labor", days: 23, daily_rate: 1200, wage: 27600, advance: 4000, net: 23600 },
];

export const DEMO_PAYROLL_SUMMARY = {
  total_wages: 139300,
  total_advances: 29000,
  total_net_pay: 110300,
};

/* ── Expenses ─────────────────────────────────────────────── */

export interface DemoExpense {
  date: string;
  description: string;
  category: "Labor" | "Materials" | "Equipment" | "Advance" | "Other";
  amount: number;
  project: string;
}

export const DEMO_EXPENSES: DemoExpense[] = [
  { date: "2026-08-14", description: "Cement — 240 bags", category: "Materials", amount: 216000, project: "Commercial Complex" },
  { date: "2026-08-13", description: "Weekly labour payment", category: "Labor", amount: 84500, project: "Lalitpur Residence" },
  { date: "2026-08-12", description: "Mixer rental", category: "Equipment", amount: 18000, project: "Commercial Complex" },
  { date: "2026-08-11", description: "Advance — B. Gurung", category: "Advance", amount: 12000, project: "Office Building — Block B" },
  { date: "2026-08-10", description: "Rebar — 4.8 tons", category: "Materials", amount: 372000, project: "Office Building — Block B" },
];

export const DEMO_EXPENSE_BREAKDOWN: { name: string; value: number; color: string }[] = [
  { name: "Materials", value: 588000, color: "#10B981" },
  { name: "Labor", value: 396000, color: "#3B82F6" },
  { name: "Equipment", value: 142000, color: "#F59E0B" },
  { name: "Advance", value: 29000, color: "#8B5CF6" },
  { name: "Other", value: 61000, color: "#94A3B8" },
];

/* ── Revenue ──────────────────────────────────────────────── */

export interface DemoRevenue {
  date: string;
  description: string;
  client_name: string;
  pay_method: string;
  amount: number;
}

export const DEMO_REVENUE: DemoRevenue[] = [
  { date: "2026-08-15", description: "Stage payment 3", client_name: "Himal Traders", pay_method: "Bank Transfer", amount: 1200000 },
  { date: "2026-08-09", description: "Advance against BOQ", client_name: "R. Maharjan", pay_method: "Cheque", amount: 450000 },
  { date: "2026-08-02", description: "Stage payment 2", client_name: "Sunrise Group", pay_method: "Bank Transfer", amount: 850000 },
  { date: "2026-07-28", description: "Final settlement", client_name: "Everest Logistics", pay_method: "Cash", amount: 320000 },
];

/* ── Monthly trend (dashboard area chart) ─────────────────── */

export const DEMO_TRENDS = [
  { month: "Mar", revenue: 1240000, expenses: 910000 },
  { month: "Apr", revenue: 1580000, expenses: 1120000 },
  { month: "May", revenue: 1410000, expenses: 1230000 },
  { month: "Jun", revenue: 1960000, expenses: 1340000 },
  { month: "Jul", revenue: 2240000, expenses: 1510000 },
  { month: "Aug", revenue: 2620000, expenses: 1720000 },
];

export const DEMO_MAIN_STATS = {
  total_revenue: 11050000,
  total_expenses: 7830000,
  profit: 3220000,
  labor_cost: 3960000,
  material_cost: 5880000,
  revenue_trend: 12.4,
  expenses_trend: 6.1,
  profit_trend: 18.9,
};

/* ── Receivables ──────────────────────────────────────────── */

export const DEMO_RECEIVABLES_SUMMARY = {
  total_budget: 16750000,
  total_received: 10440000,
  total_remaining: 6310000,
  projects_count: 14,
  clients_with_dues: 5,
};
