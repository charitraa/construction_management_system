import { useQuery } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import { ListEmployeesResponse } from "../types/employee.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";

export const useListEmployees = (params?: {
  role?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<ListEmployeesResponse>({
    queryKey: [EMPLOYEE_QUERY_KEYS.LIST, params],
    queryFn: () => employeeServices.listEmployees(params),
  });
};
