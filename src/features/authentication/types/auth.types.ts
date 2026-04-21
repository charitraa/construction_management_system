export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  data: AuthTokens & {
    user: User;
  };
  message: string;
}

export interface RegisterResponse {
  data: User;
  message: string;
}

export interface ProfileResponse {
  data: User;
  message: string;
}

export interface RefreshTokenResponse {
  data: AuthTokens;
  message: string;
}

export interface LogoutResponse {
  message: string;
}
