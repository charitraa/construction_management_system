import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import {
  CreateAttendanceRequest,
  CreateAttendanceResponse,
} from "../types/attendance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAttendanceResponse,
    ApiErrorResponse,
    CreateAttendanceRequest
  >({
    mutationFn: attendanceServices.createAttendance,
    mutationKey: [ATTENDANCE_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.BY_DATE],
      });
      queryClient.invalidateQueries({
        queryKey: [ATTENDANCE_QUERY_KEYS.STATS],
      });
      toast({
        title: "Attendance Recorded",
        description: "Attendance has been successfully recorded",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: error?.message || "Failed to record attendance",
      });
    },
  });
};
