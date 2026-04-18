import { useMutation } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { RefreshTokenRequest, RefreshTokenResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";

export const useRefreshToken = () => {
  return useMutation<
    RefreshTokenResponse,
    ApiErrorResponse,
    RefreshTokenRequest
  >({
    mutationFn: authServices.refreshToken,
    mutationKey: [AUTH_QUERY_KEYS.REFRESH_TOKEN],
  });
};
