import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { AttendanceStatsResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useAttendanceStats = (date: string) => {
  return useQuery<AttendanceStatsResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.STATS, date],
    queryFn: () => attendanceServices.getAttendanceStats(date),
    enabled: !!date,
  });
};
