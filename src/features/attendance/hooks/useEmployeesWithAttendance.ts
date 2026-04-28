import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { EmployeesWithAttendanceResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useEmployeesWithAttendance = (params?: {
  date?: string;
  search?: string;
  department?: string;
  status?: string;
}) => {
  return useQuery<EmployeesWithAttendanceResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.EMPLOYEES, params],
    queryFn: () => attendanceServices.getEmployeesWithAttendance(params),
  });
};
