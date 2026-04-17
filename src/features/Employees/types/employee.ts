export type EmployeeRole = "manager" | "engineer" | "supervisor" | "worker" | "accountant" | "admin";
export type EmployeeStatus = "active" | "inactive" | "on_leave" | "terminated";

export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  designation: string;
  department: string;
  hire_date: string | null;
  date_of_birth: string | null;
  salary: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  role?: EmployeeRole;
  status?: EmployeeStatus;
  designation?: string;
  department?: string;
  hire_date?: string;
  date_of_birth?: string;
  salary?: number;
  is_active?: boolean;
}

export interface EmployeeListItem {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  designation: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
}