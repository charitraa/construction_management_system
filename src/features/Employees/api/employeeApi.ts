import { Employee, EmployeeFormData } from "../types/employee";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "API request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => {
    const result = await fetchWithAuth("/employee/list/");
    return result.data;
  },

  getById: async (employeeId: string): Promise<Employee> => {
    const result = await fetchWithAuth(`/employee/details/${employeeId}/`);
    return result.data;
  },

  create: async (data: EmployeeFormData): Promise<Employee> => {
    const result = await fetchWithAuth("/employee/create/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.data;
  },

  update: async (employeeId: string, data: Partial<EmployeeFormData>): Promise<Employee> => {
    const result = await fetchWithAuth(`/employee/update/${employeeId}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result.data;
  },

  delete: async (employeeId: string): Promise<void> => {
    await fetchWithAuth(`/employee/delete/${employeeId}/`, {
      method: "DELETE",
    });
  },

  search: async (query: string): Promise<Employee[]> => {
    const result = await fetchWithAuth(`/employee/search/?q=${encodeURIComponent(query)}`);
    return result.data;
  },

  getStats: async (): Promise<{ total: number; active: number }> => {
    const result = await fetchWithAuth("/employee/stats/");
    return result.data;
  },
};