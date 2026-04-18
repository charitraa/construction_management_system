import { axiosInstance } from "./interceptors";
import { AxiosResponse } from "axios";

export const httpClient = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.post(
      url,
      data,
      config,
    );
    return response.data;
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.put(
      url,
      data,
      config,
    );
    return response.data;
  },
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  },
};
