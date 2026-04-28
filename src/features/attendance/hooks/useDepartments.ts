import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { DepartmentsResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useDepartments = () => {
  return useQuery<DepartmentsResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.DEPARTMENTS],
    queryFn: () => attendanceServices.getDepartments(),
  });
};
