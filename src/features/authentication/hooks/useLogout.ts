import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { LogoutResponse } from "../types/auth.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";
import { toast } from "@/shared/hooks/use-toast";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, ApiErrorResponse>({
    mutationFn: authServices.logout,
    mutationKey: [AUTH_QUERY_KEYS.LOGOUT],
    // Runs whether the request succeeded or failed: the user asked to be
    // signed out, so the local session must not survive either way.
    onSettled: () => {
      // useLogin stores these; nothing else ever removed them, which left the
      // browser looking signed in after a logout.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Drop every cached response, so no previous user's projects, payroll or
      // profile can be read out of the cache by the next person to sign in.
      queryClient.removeQueries();
    },
    onSuccess: () => {
      toast({
        variant: "success",
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
