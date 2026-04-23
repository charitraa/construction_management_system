import { httpClient } from "@/shared/api/httpClient";
import {
  CreateEmployeeRequest,
  ListEmployeesResponse,
  CreateEmployeeResponse,
  EmployeeStatsResponse,
  ExportEmployeesResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  EmployeeDetailsResponse,
} from "../types/employee.types";
import { EMPLOYEE_ENDPOINTS } from "../constants/employee.constants";

export const employeeServices = {
  listEmployees: (params?: {
    role?: string;
    page?: number;
    page_size?: number;
  }) =>
    httpClient.get<ListEmployeesResponse>(EMPLOYEE_ENDPOINTS.LIST, { params }),

  createEmployee: (data: CreateEmployeeRequest) =>
    httpClient.post<CreateEmployeeResponse>(EMPLOYEE_ENDPOINTS.CREATE, data),

  getEmployee: (id: string) =>
    httpClient.get<EmployeeDetailsResponse>(
      `${EMPLOYEE_ENDPOINTS.DETAILS}${id}/`,
    ),

  updateEmployee: (id: string, data: UpdateEmployeeRequest) =>
    httpClient.put<UpdateEmployeeResponse>(
      `${EMPLOYEE_ENDPOINTS.UPDATE}${id}/`,
      data,
    ),

  deleteEmployee: (id: string) =>
    httpClient.delete<void>(`${EMPLOYEE_ENDPOINTS.DELETE}${id}/`),

  getEmployeeStats: () =>
    httpClient.get<EmployeeStatsResponse>(EMPLOYEE_ENDPOINTS.STATS),

  exportEmployees: () =>
    httpClient.get<ExportEmployeesResponse>(EMPLOYEE_ENDPOINTS.EXPORT),
};
