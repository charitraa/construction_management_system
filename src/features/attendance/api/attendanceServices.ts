import { httpClient } from "@/shared/api/httpClient";
import {
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  ListAttendanceResponse,
  CreateAttendanceResponse,
  AttendanceByDateResponse,
  AttendanceStatsResponse,
  EmployeesWithAttendanceResponse,
  DepartmentsResponse,
  DateRangeSummaryResponse,
  AttendanceDetailResponse,
  UpdateAttendanceResponse,
  DeleteAttendanceResponse,
} from "../types/attendance.types";
import { ATTENDANCE_ENDPOINTS } from "../constants/attendance.constants";

export const attendanceServices = {
  listAttendance: (params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    employee_id?: string;
    status?: string;
    department?: string;
    page?: number;
    page_size?: number;
  }) =>
    httpClient.get<ListAttendanceResponse>(ATTENDANCE_ENDPOINTS.LIST, {
      params,
    }),

  createAttendance: (data: CreateAttendanceRequest) =>
    httpClient.post<CreateAttendanceResponse>(
      ATTENDANCE_ENDPOINTS.CREATE,
      data,
    ),

  getAttendanceByDate: (date: string) =>
    httpClient.get<AttendanceByDateResponse>(
      `${ATTENDANCE_ENDPOINTS.BY_DATE}?date=${date}`,
    ),

  getAttendanceStats: (date?: string) =>
    httpClient.get<AttendanceStatsResponse>(
      ATTENDANCE_ENDPOINTS.STATS,
      { params: date ? { date } : undefined }
    ),

  getEmployeesWithAttendance: (params?: {
    date?: string;
    search?: string;
    department?: string;
    status?: string;
  }) =>
    httpClient.get<EmployeesWithAttendanceResponse>(
      ATTENDANCE_ENDPOINTS.EMPLOYEES,
      { params }
    ),

  getDepartments: () =>
    httpClient.get<DepartmentsResponse>(
      ATTENDANCE_ENDPOINTS.DEPARTMENTS
    ),

  getDateRangeSummary: (params: {
    start_date: string;
    end_date: string;
    department?: string;
    status?: string;
  }) =>
    httpClient.get<DateRangeSummaryResponse>(
      ATTENDANCE_ENDPOINTS.SUMMARY,
      { params }
    ),

  getAttendanceDetail: (attendanceId: string) =>
    httpClient.get<AttendanceDetailResponse>(
      `${ATTENDANCE_ENDPOINTS.DETAIL}${attendanceId}/`
    ),

  updateAttendance: (attendanceId: string, data: UpdateAttendanceRequest) =>
    httpClient.put<UpdateAttendanceResponse>(
      `${ATTENDANCE_ENDPOINTS.UPDATE}${attendanceId}/`,
      data
    ),

  deleteAttendance: (attendanceId: string) =>
    httpClient.delete<DeleteAttendanceResponse>(
      `${ATTENDANCE_ENDPOINTS.DELETE}${attendanceId}/`
    ),

  exportAttendance: (params: {
    start_date: string;
    end_date: string;
    format?: "csv" | "json";
    include_stats?: boolean;
    department?: string;
    status?: string;
  }) => {
    const format = params.format || "csv";
    const include_stats = params.include_stats !== false;

    return httpClient.get(
      ATTENDANCE_ENDPOINTS.EXPORT,
      {
        params: {
          ...params,
          format,
          include_stats,
        },
        responseType: format === "csv" ? "blob" : "json",
      }
    );
  },
};
