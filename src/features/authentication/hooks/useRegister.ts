import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { RegisterRequest, RegisterResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { toast } from "@/shared/hooks/use-toast";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation<RegisterResponse, ApiErrorResponse, RegisterRequest>({
    mutationFn: authServices.register,
    mutationKey: [AUTH_QUERY_KEYS.REGISTER],
    onSuccess: (data) => {
      // The backend logs the new account straight in (sets auth cookies and
      // returns tokens), so persist them just like login does.
      localStorage.setItem("access_token", data.data.access);
      localStorage.setItem("refresh_token", data.data.refresh);

      // Refetch the profile so the AuthContext picks up the new session.
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEYS.PROFILE] });

      toast({
        variant: "success",
        title: "Account Created",
        description: "Welcome! Your workspace is ready.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error?.message || "Could not create your account.",
      });
    },
  });
};
