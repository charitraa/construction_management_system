export interface PayrollEntry {
  id: string;
  name: string;
  role: string;
  days_worked: number;
  daily_rate: number;
  total_wage: number;
  advance: number;
  net_pay: number;
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
