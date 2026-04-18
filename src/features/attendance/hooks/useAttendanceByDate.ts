import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { AttendanceByDateResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useAttendanceByDate = (date: string) => {
  return useQuery<AttendanceByDateResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.BY_DATE, date],
    queryFn: () => attendanceServices.getAttendanceByDate(date),
    enabled: !!date,
  });
};
