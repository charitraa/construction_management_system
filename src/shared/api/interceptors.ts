import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants/constants";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Auth token interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export const axiosImageInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
// Error handler
export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      status_code?: number;
    }>;

    if (!axiosError.response) {
      throw new Error("Network error. Please check your internet connection.");
    }

    const { status, data } = axiosError.response;
    const message = data?.message || "An unexpected error occurred";

    throw new Error(`Error ${status}: ${message}`);
  }

  throw error;
};
