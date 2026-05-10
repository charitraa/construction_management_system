export interface PayrollEntry {
  id: string;
  name: string;
  role: string;
  days_worked_since_last_payment: number;   // was: days_worked
  last_payment_date: string | null;
  calculation_start_date: string;
  daily_rate: string;                        // API returns string
  daily_breakdown: {
    date: string;
    status: "Present" | "Absent";
    daily_wage: string;
  }[];
  total_wage_earned: string;                 // was: total_wage (also string now)
  advance: string;                           // string
  net_pay: string;                           // string (can be negative)
}

export interface PayrollSummary {
  total_wages: number;
  total_advances: number;
  total_net_pay: number;
}

export interface PayrollByMonthResponse {
  data: PayrollEntry[];
  message: string;
}

export interface PayrollSummaryResponse {
  data: PayrollSummary;
  message: string;
}