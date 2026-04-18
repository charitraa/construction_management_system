import { httpClient } from "@/shared/api/httpClient";
import {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from "../types/auth.types";
import { AUTH_ENDPOINTS } from "../constants/auth.constants";

export const authServices = {
  login: (data: LoginRequest) =>
    httpClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, data),

  register: (data: RegisterRequest) =>
    httpClient.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, data),

  getProfile: () => httpClient.get<ProfileResponse>(AUTH_ENDPOINTS.PROFILE),

  refreshToken: (data: RefreshTokenRequest) =>
    httpClient.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, data),

  logout: () => httpClient.post<LogoutResponse>(AUTH_ENDPOINTS.LOGOUT),
};
