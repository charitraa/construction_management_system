export interface Attendance {
  id: string;
  date: string;
  employee: string;
  employee_name?: string;
  status: "Present" | "Absent";
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceRequest {
  date: string;
  employee: string;
  status: "Present" | "Absent";
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
}

export interface ListAttendanceResponse {
  data: Attendance[];
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
