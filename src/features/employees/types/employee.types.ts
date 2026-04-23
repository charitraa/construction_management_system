export interface Employee {
  id: string;
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number;
  phone: string;
}

export interface EmployeeStats {
  total: number;
  Mason: number;
  Labor: number;
}

export interface ListEmployeesResponse {
  data: Employee[];
  message: string;
}

export interface CreateEmployeeResponse {
  data: Employee;
  message: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number;
  phone: string;
}

export interface UpdateEmployeeResponse {
  data: Employee;
  message: string;
}

export interface EmployeeDetailsResponse {
  data: Employee;
  message: string;
}

export interface EmployeeStatsResponse {
  data: EmployeeStats;
  message: string;
}

export interface ExportEmployeesResponse {
  data: string; // Assuming CSV or similar
  message: string;
}
