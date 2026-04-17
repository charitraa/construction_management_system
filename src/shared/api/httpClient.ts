import { type AxiosRequestConfig } from "axios";
import { axiosImageInstance, axiosInstance, handleAxiosError } from "./interceptors";

export class HttpClient<ResponseType, RequestType = unknown> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = async (
    config?: AxiosRequestConfig
  ): Promise<ResponseType[]> => {
    try {
      const response = await axiosInstance.get<ResponseType[]>(
        this.endpoint,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  get = async (
    params?: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;

    try {
      const response = await axiosInstance.get<ResponseType>(
        url,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  post = async (
    data: RequestType,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    try {
      const response = await axiosInstance.post<ResponseType>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  put = async (
    data: RequestType,
    params?: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;

    try {
      const response = await axiosInstance.put<ResponseType>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  delete = async (
    params?: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    const url = params ? `${this.endpoint}/${params}` : this.endpoint;

    try {
      const response = await axiosInstance.delete<ResponseType>(
        url,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  deleteBulk = async (
    data: RequestType,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    try {
      const response = await axiosInstance.post<ResponseType>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  postWithImage = async (
    data: RequestType,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    try {
      const response = await axiosImageInstance.post<ResponseType>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  putWithImage = async (
    data: RequestType,
    config?: AxiosRequestConfig
  ): Promise<ResponseType> => {
    try {
      const response = await axiosImageInstance.put<ResponseType>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

}