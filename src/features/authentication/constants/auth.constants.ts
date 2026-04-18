export const AUTH_QUERY_KEYS = {
  LOGIN: "auth-login",
  REGISTER: "auth-register",
  PROFILE: "auth-profile",
  REFRESH_TOKEN: "auth-refresh-token",
  LOGOUT: "auth-logout",
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/users/login/",
  REGISTER: "/users/register/",
  PROFILE: "/users/profile/",
  REFRESH_TOKEN: "/users/refresh/",
  LOGOUT: "/users/logout/",
} as const;
