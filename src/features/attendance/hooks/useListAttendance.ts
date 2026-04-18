import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { ListAttendanceResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useListAttendance = (params?: {
  date?: string;
  start_date?: string;
  end_date?: string;
  employee_id?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<ListAttendanceResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.LIST, params],
    queryFn: () => attendanceServices.listAttendance(params),
  });
};
