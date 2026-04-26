export interface Employee {
  id: string;
  name: string;
  role: "Mason" | "Labor";
  daily_rate: string;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number | string;
  phone: string;
  address?: string;
}

export interface EmployeeStats {
  total: number;
  Mason: number;
  Labor: number;
}

export interface ListEmployeesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    data: Employee[];
    message: string;
  };
}

export interface CreateEmployeeResponse {
  data: Employee;
  message: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  role: "Mason" | "Labor";
  daily_rate: number | string;
  phone: string;
  address?: string;
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
