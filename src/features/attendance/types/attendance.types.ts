export type AttendanceStatus = "Present" | "Absent";

export interface Attendance {
  id: string;
  date: string;
  employee: string;
  employee_id?: string;
  employee_name?: string;
  employee_role?: string;
  employee_email?: string;
  employee_avatar?: string;
  status: AttendanceStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceRequest {
  date: string;
  employee: string;
  status: AttendanceStatus;
}

export interface UpdateAttendanceRequest {
  date?: string;
  employee?: string;
  status?: AttendanceStatus;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

export interface EmployeeWithAttendance {
  id: string;
  name: string;
  email: string | null;
  department: string;
  avatar: string | null;
  status: AttendanceStatus | null;
  record_id: string | null;
}

export interface ListAttendanceResponse {
  data: Attendance[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
}

export interface CreateAttendanceResponse {
  data: Attendance;
  message: string;
}

export interface AttendanceByDateResponse {
  data: Attendance[];
  message: string;
}

export interface AttendanceStatsResponse {
  data: AttendanceStats;
  message: string;
}

export interface EmployeesWithAttendanceResponse {
  data: EmployeeWithAttendance[];
  message: string;
}

export interface DepartmentsResponse {
  data: string[];
  message: string;
}

export interface DateRangeSummaryResponse {
  data: {
    total_days: number;
    total_records: number;
    total_present: number;
    total_absent: number;
    average_attendance: number;
  };
  message: string;
}

export interface AttendanceDetailResponse {
  data: Attendance;
  message: string;
}

export interface UpdateAttendanceResponse {
  data: Attendance;
  message: string;
}

export interface DeleteAttendanceResponse {
  message: string;
}
