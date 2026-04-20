import { createContext, useContext, ReactNode } from "react";
import { useProfile } from "../features/authentication/hooks/useProfile";
import {
  User,
  ProfileResponse,
} from "../features/authentication/types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError, error, refetch } = useProfile();
  const user = data?.data?.user || null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isError, error, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
