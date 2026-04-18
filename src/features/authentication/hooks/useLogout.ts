import { useMutation } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { LogoutResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { toast } from "@/hooks/use-toast";

export const useLogout = () => {
  return useMutation<LogoutResponse, ApiErrorResponse>({
    mutationFn: authServices.logout,
    mutationKey: [AUTH_QUERY_KEYS.LOGOUT],
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error?.message || "Failed to logout",
      });
    },
  });
};
