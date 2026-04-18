import { httpClient } from "@/shared/api/httpClient";
import {
  CreateAttendanceRequest,
  ListAttendanceResponse,
  CreateAttendanceResponse,
  AttendanceByDateResponse,
  AttendanceStatsResponse,
} from "../types/attendance.types";
import { ATTENDANCE_ENDPOINTS } from "../constants/attendance.constants";

export const attendanceServices = {
  listAttendance: (params?: {
    date?: string;
    start_date?: string;
    end_date?: string;
    employee_id?: string;
    status?: string;
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

  getAttendanceStats: (date: string) =>
    httpClient.get<AttendanceStatsResponse>(
      `${ATTENDANCE_ENDPOINTS.STATS}?date=${date}`,
    ),
};
