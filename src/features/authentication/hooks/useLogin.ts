import { useMutation } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { LoginRequest, LoginResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { toast } from "@/hooks/use-toast";

export const useLogin = () => {
  return useMutation<LoginResponse, ApiErrorResponse, LoginRequest>({
    mutationFn: authServices.login,
    mutationKey: [AUTH_QUERY_KEYS.LOGIN],
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error?.message || "Invalid credentials",
      });
    },
  });
};
