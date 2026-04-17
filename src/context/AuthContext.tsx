import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers: { email: string; password: string; user: User }[] = [
  {
    email: "admin@cms.com",
    password: "password123",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@cms.com",
      role: "admin",
    },
  },
  {
    email: "manager@cms.com",
    password: "password123",
    user: {
      id: "2",
      name: "Project Manager",
      email: "manager@cms.com",
      role: "manager",
    },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for saved user
    const savedUser = localStorage.getItem("cms_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      const loggedInUser = foundUser.user;
      setUser(loggedInUser);
      localStorage.setItem("cms_user", JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name,
        email,
        role: "user",
      };

      // Add to mock database
      mockUsers.push({
        email,
        password,
        user: newUser,
      });

      setUser(newUser);
      localStorage.setItem("cms_user", JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cms_user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
