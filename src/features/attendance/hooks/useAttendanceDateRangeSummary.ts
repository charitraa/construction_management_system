import { useQuery } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { DateRangeSummaryResponse } from "../types/attendance.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";

export const useAttendanceDateRangeSummary = (params: {
  start_date: string;
  end_date: string;
  department?: string;
  status?: string;
}) => {
  return useQuery<DateRangeSummaryResponse>({
    queryKey: [ATTENDANCE_QUERY_KEYS.SUMMARY, params],
    queryFn: () => attendanceServices.getDateRangeSummary(params),
    enabled: !!params.start_date && !!params.end_date,
  });
};
