import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import {
  UpdateAttendanceRequest,
  UpdateAttendanceResponse,
} from "../types/attendance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAttendanceResponse,
    ApiErrorResponse,
    { attendanceId: string; data: UpdateAttendanceRequest }
  >({
    mutationFn: ({ attendanceId, data }) =>
      attendanceServices.updateAttendance(attendanceId, data),
    mutationKey: [ATTENDANCE_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.EMPLOYEES],
      });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.BY_DATE],
      });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.STATS],
      });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.SUMMARY],
      });
      toast({
        title: "Attendance Updated",
        description: "Attendance has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update attendance",
      });
    },
  });
};
