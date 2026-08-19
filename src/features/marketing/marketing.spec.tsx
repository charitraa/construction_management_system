import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/shared/context/AuthContext";
import Landing from "@/features/marketing/pages/Landing";
import Login from "@/features/authentication/pages/Login";
import Register from "@/features/authentication/pages/Register";

const wrap = (node: React.ReactNode) =>
  renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <MemoryRouter>{node}</MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>,
  );

describe("marketing surface", () => {
  it("landing renders and claims only real features", () => {
    const html = wrap(<Landing />);
    expect(html).toContain("all in one place");
    for (const banned of [
      "Kanban",
      "Milestone",
      "Procurement",
      "procurement",
      "Inventory",
      "testimonial",
      "customers trust",
    ]) {
      expect(html.includes(banned), `found "${banned}"`).toBe(false);
    }
    expect(html).toContain("does not track individual construction milestones");
    expect(html).toContain('href="/login"');
    expect(html).toContain("Sample data");
    // Every real module is represented.
    for (const m of [
      "Projects",
      "Employees",
      "Attendance",
      "Advance",
      "Payroll",
      "Expenses",
      "Revenue",
      "Receivables",
      "Dashboard",
    ]) {
      expect(html.includes(m), `missing module "${m}"`).toBe(true);
    }
  });

  it("login renders with labelled, autocompleting fields", () => {
    const html = wrap(<Login />);
    expect(html).toContain("Welcome back");
    expect(html).toContain('for="email"');
    expect(html).toContain('for="password"');
    expect(html).toContain('autoComplete="current-password"');
    expect(html).toContain('type="submit"');
    expect(html).toContain('href="/register"');
  });

  it("register keeps all four fields", () => {
    const html = wrap(<Register />);
    for (const id of ["full_name", "email", "password", "confirm_password"]) {
      expect(html.includes(`for="${id}"`), `missing field "${id}"`).toBe(true);
    }
    expect(html).toContain('href="/login"');
  });
});
