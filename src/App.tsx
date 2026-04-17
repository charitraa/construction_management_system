import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./features/Login/pages/Login";
import SignUp from "./features/SignUp/pages/SignUp";
import Dashboard from "./features/Dashboard/pages/Dashboard";
import Employees from "./features/Employees/pages/Employees";
import Attendance from "./features/Attendance/pages/Attendance";
import Advance from "./features/Advance/pages/Advance";
import Payroll from "./features/Payroll/pages/Payroll";
import Projects from "./features/Projects/pages/Projects";
import Categories from "./features/Categories/pages/Categories";
import Expenses from "./features/Expenses/pages/Expenses";
import Revenue from "./features/Revenue/pages/Revenue";
import NotFound from "./features/NotFound/pages/NotFound";

const queryClient = new QueryClient();

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <ProtectedRoute>
                      <Employees />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <ProtectedRoute>
                      <Attendance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/advance"
                  element={
                    <ProtectedRoute>
                      <Advance />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payroll"
                  element={
                    <ProtectedRoute>
                      <Payroll />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <ProtectedRoute>
                      <Expenses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/revenue"
                  element={
                    <ProtectedRoute>
                      <Revenue />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </DataProvider>
    </AuthProvider>
  );
}
