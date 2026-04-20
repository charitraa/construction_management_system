import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { LoginRequest, LoginResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { toast } from "@/hooks/use-toast";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiErrorResponse, LoginRequest>({
    mutationFn: authServices.login,
    mutationKey: [AUTH_QUERY_KEYS.LOGIN],
    onSuccess: (data) => {
      // Save tokens to localStorage
      localStorage.setItem("access_token", data.data.access);
      localStorage.setItem("refresh_token", data.data.refresh);

      // Invalidate profile query to trigger refetch
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.PROFILE] });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error?.message || "Invalid credentials",
      });
    },
  });
};
