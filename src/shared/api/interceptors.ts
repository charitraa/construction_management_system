import axios from "axios";
import { BASE_URL } from "../constants/constants";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
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
    const axiosError = error as axios.AxiosError<{
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
