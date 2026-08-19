import "./global.css";

import { Suspense, lazy } from "react";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/context/AuthContext";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { RootRoute } from "@/shared/components/RootRoute";
import { PageSkeleton } from "@/shared/components/PageSkeleton";
import { Login, Register } from "@/features/authentication";
import Landing from "@/features/marketing/pages/Landing";

/**
 * The authenticated application is code-split so a first-time visitor landing
 * on "/" does not download the module pages and their charting dependencies.
 */
const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const Employees = lazy(() => import("@/features/employees/pages/Employees"));
const Attendance = lazy(() => import("@/features/attendance/pages/Attendance"));
const Advance = lazy(() => import("@/features/advances/pages/Advance"));
const Payroll = lazy(() => import("@/features/payroll/pages/Payroll"));
const Projects = lazy(() => import("@/features/projects/pages/Projects"));
const ProjectDetails = lazy(
  () => import("@/features/projects/pages/ProjectDetails"),
);
const Expenses = lazy(() => import("@/features/expenses/pages/Expenses"));
const Revenue = lazy(() => import("@/features/revenue/pages/Revenue"));
const Receivables = lazy(
  () => import("@/features/receivables/pages/Receivables"),
);
const NotFound = lazy(() => import("@/features/not-found/pages/NotFound"));

const queryClient = new QueryClient();

/** Wraps a lazily loaded protected page with its auth guard and fallback. */
const guarded = (element: React.ReactNode) => (
  <ProtectedRoute>
    <Suspense fallback={<PageSkeleton />}>{element}</Suspense>
  </ProtectedRoute>
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/*
                Landing page for visitors, dashboard for signed-in users —
                "/" keeps working exactly as before once authenticated.
              */}
              <Route
                path="/"
                element={
                  <RootRoute
                    landing={<Landing />}
                    app={guarded(<Dashboard />)}
                  />
                }
              />

              {/* Protected Routes */}
              <Route path="/dashboard" element={guarded(<Dashboard />)} />
              <Route path="/employees" element={guarded(<Employees />)} />
              <Route path="/attendance" element={guarded(<Attendance />)} />
              <Route path="/advance" element={guarded(<Advance />)} />
              <Route path="/payroll" element={guarded(<Payroll />)} />
              <Route path="/projects" element={guarded(<Projects />)} />
              <Route path="/projects/:id" element={guarded(<ProjectDetails />)} />
              <Route path="/expenses" element={guarded(<Expenses />)} />
              <Route path="/revenue" element={guarded(<Revenue />)} />
              <Route path="/receivables" element={guarded(<Receivables />)} />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
