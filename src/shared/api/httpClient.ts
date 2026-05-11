import { axiosInstance } from "./interceptors";

export const httpClient = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.post<T>(
      url,
      data,
      config,
    );
    return response.data;
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.put<T>(
      url,
      data,
      config,
    );
    return response.data;
  },
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};
