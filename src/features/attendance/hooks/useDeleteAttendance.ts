import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceServices } from "../api/attendanceServices";
import { DeleteAttendanceResponse } from "../types/attendance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ATTENDANCE_QUERY_KEYS } from "../constants/attendance.constants";
import { toast } from "@/hooks/use-toast";

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAttendanceResponse, ApiErrorResponse, string>({
    mutationFn: (attendanceId) =>
      attendanceServices.deleteAttendance(attendanceId),
    mutationKey: [ATTENDANCE_QUERY_KEYS.DELETE],
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
        title: "Attendance Deleted",
        description: "Attendance record has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error?.message || "Failed to delete attendance",
      });
    },
  });
};
