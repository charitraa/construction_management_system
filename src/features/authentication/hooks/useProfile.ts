import { useQuery } from "@tanstack/react-query";
import { authServices } from "../api/authServices";
import { ProfileResponse } from "../types/auth.types";
import { AUTH_QUERY_KEYS } from "../constants/auth.constants";

export const useProfile = () => {
  return useQuery<ProfileResponse>({
    queryKey: [AUTH_QUERY_KEYS.PROFILE],
    queryFn: authServices.getProfile,
  });
};
