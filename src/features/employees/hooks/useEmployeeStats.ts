import { useQuery } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import { EmployeeStatsResponse } from "../types/employee.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";

export const useEmployeeStats = () => {
  return useQuery<EmployeeStatsResponse>({
    queryKey: [EMPLOYEE_QUERY_KEYS.STATS],
    queryFn: employeeServices.getEmployeeStats,
  });
};
