import { attendanceServices } from "../api/attendanceServices";
import { toast } from "@/hooks/use-toast";

export const useExportAttendance = () => {
  const handleExport = async (params: {
    start_date: string;
    end_date: string;
    export_format: "csv" | "json";
    include_stats: boolean;
    department?: string;
    status?: string;
  }) => {
    try {
      const response = await attendanceServices.exportAttendance(params);

      const blob = new Blob([response as BlobPart], {
        type: params.export_format === "csv" ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${params.start_date}_to_${params.end_date}.${params.export_format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        variant: "success",
        title: "Export Successful",
        description: "Attendance data has been exported successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Failed to export attendance data. Please try again.",
      });
    }
  };

  return { handleExport };
};
