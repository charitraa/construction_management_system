import React, { createContext, useContext, useState } from "react";

export interface Employee {
  id: number;
  name: string;
  role: "Mason" | "Labor";
  dailyRate: number;
  phone: string;
}

export interface AttendanceRecord {
  id: number;
  date: string;
  employeeId: number;
  status: "Present" | "Absent";
}

export interface Advance {
  id: number;
  date: string;
  employeeId: number;
  amount: number;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  location: string;
  contractValue: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface Expense {
  id: number;
  date: string;
  category: "Materials" | "Labor" | "Equipment" | "Other";
  description: string;
  amount: number;
  projectId?: string;
}

export interface Revenue {
  id: number;
  date: string;
  projectId: string;
  clientName: string;
  amount: number;
  payMethod: "Cash" | "Online" | "Check";
  status: "Received" | "Pending" | "Overdue";
}

interface DataContextType {
  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: number, employee: Omit<Employee, "id">) => void;
  deleteEmployee: (id: number) => void;

  // Attendance
  attendance: AttendanceRecord[];
  addAttendance: (record: Omit<AttendanceRecord, "id">) => void;
  updateAttendance: (id: number, record: Omit<AttendanceRecord, "id">) => void;
  getAttendanceByDate: (date: string) => AttendanceRecord[];

  // Advances
  advances: Advance[];
  addAdvance: (advance: Omit<Advance, "id">) => void;
  deleteAdvance: (id: number) => void;
  getAdvancesByEmployee: (employeeId: number) => Advance[];

  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: number, category: Omit<Category, "id">) => void;
  deleteCategory: (id: number) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: number, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: number) => void;

  // Revenue
  revenues: Revenue[];
  addRevenue: (revenue: Omit<Revenue, "id">) => void;
  updateRevenue: (id: number, revenue: Omit<Revenue, "id">) => void;
  deleteRevenue: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Raj Kumar",
    role: "Mason",
    dailyRate: 800,
    phone: "+91-9876543210",
  },
  {
    id: 2,
    name: "Amit Singh",
    role: "Labor",
    dailyRate: 500,
    phone: "+91-9876543211",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Mason",
    dailyRate: 850,
    phone: "+91-9876543212",
  },
  {
    id: 4,
    name: "Vikram Patel",
    role: "Labor",
    dailyRate: 550,
    phone: "+91-9876543213",
  },
  {
    id: 5,
    name: "Suresh Verma",
    role: "Mason",
    dailyRate: 900,
    phone: "+91-9876543214",
  },
];

const initialProjects: Project[] = [
  {
    id: "PRJ001",
    name: "Riverside Villa Complex",
    clientName: "Sharma Constructions",
    location: "Mumbai",
    contractValue: 5200000,
  },
  {
    id: "PRJ002",
    name: "Downtown Commercial Tower",
    clientName: "Metro Builders",
    location: "Bangalore",
    contractValue: 8500000,
  },
  {
    id: "PRJ003",
    name: "Residential Complex Phase 2",
    clientName: "Urban Development Co.",
    location: "Delhi",
    contractValue: 6300000,
  },
  {
    id: "PRJ004",
    name: "Highway Construction Project",
    clientName: "Government Infrastructure",
    location: "Gujrat",
    contractValue: 12500000,
  },
  {
    id: "PRJ005",
    name: "Shopping Mall Renovation",
    clientName: "Retail Ventures Ltd.",
    location: "Pune",
    contractValue: 3800000,
  },
];

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Materials",
    description: "Building materials and supplies",
    color: "blue",
  },
  {
    id: 2,
    name: "Labor",
    description: "Labor costs and wages",
    color: "purple",
  },
  {
    id: 3,
    name: "Equipment",
    description: "Equipment rental and machinery",
    color: "orange",
  },
  {
    id: 4,
    name: "Other",
    description: "Miscellaneous expenses",
    color: "gray",
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);

  const value: DataContextType = {
    // Employees
    employees,
    addEmployee: (employee) => {
      const newId = Math.max(...employees.map((e) => e.id), 0) + 1;
      setEmployees([...employees, { ...employee, id: newId }]);
    },
    updateEmployee: (id, employee) => {
      setEmployees(
        employees.map((e) => (e.id === id ? { ...employee, id } : e))
      );
    },
    deleteEmployee: (id) => {
      setEmployees(employees.filter((e) => e.id !== id));
    },

    // Attendance
    attendance,
    addAttendance: (record) => {
      const newId = Math.max(...attendance.map((a) => a.id), 0) + 1;
      setAttendance([...attendance, { ...record, id: newId }]);
    },
    updateAttendance: (id, record) => {
      setAttendance(
        attendance.map((a) => (a.id === id ? { ...record, id } : a))
      );
    },
    getAttendanceByDate: (date) => {
      return attendance.filter((a) => a.date === date);
    },

    // Advances
    advances,
    addAdvance: (advance) => {
      const newId = Math.max(...advances.map((a) => a.id), 0) + 1;
      setAdvances([...advances, { ...advance, id: newId }]);
    },
    deleteAdvance: (id) => {
      setAdvances(advances.filter((a) => a.id !== id));
    },
    getAdvancesByEmployee: (employeeId) => {
      return advances.filter((a) => a.employeeId === employeeId);
    },

    // Projects
    projects,
    addProject: (project) => {
      const newId =
        "PRJ" + String(Math.max(...projects.map((p) => parseInt(p.id.slice(3))), 0) + 1).padStart(3, "0");
      setProjects([...projects, { ...project, id: newId }]);
    },
    updateProject: (id, project) => {
      setProjects(
        projects.map((p) => (p.id === id ? { ...project, id } : p))
      );
    },
    deleteProject: (id) => {
      setProjects(projects.filter((p) => p.id !== id));
    },

    // Categories
    categories,
    addCategory: (category) => {
      const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
      setCategories([...categories, { ...category, id: newId }]);
    },
    updateCategory: (id, category) => {
      setCategories(
        categories.map((c) => (c.id === id ? { ...category, id } : c))
      );
    },
    deleteCategory: (id) => {
      setCategories(categories.filter((c) => c.id !== id));
    },

    // Expenses
    expenses,
    addExpense: (expense) => {
      const newId = Math.max(...expenses.map((e) => e.id), 0) + 1;
      setExpenses([...expenses, { ...expense, id: newId }]);
    },
    updateExpense: (id, expense) => {
      setExpenses(
        expenses.map((e) => (e.id === id ? { ...expense, id } : e))
      );
    },
    deleteExpense: (id) => {
      setExpenses(expenses.filter((e) => e.id !== id));
    },

    // Revenue
    revenues,
    addRevenue: (revenue) => {
      const newId = Math.max(...revenues.map((r) => r.id), 0) + 1;
      setRevenues([...revenues, { ...revenue, id: newId }]);
    },
    updateRevenue: (id, revenue) => {
      setRevenues(
        revenues.map((r) => (r.id === id ? { ...revenue, id } : r))
      );
    },
    deleteRevenue: (id) => {
      setRevenues(revenues.filter((r) => r.id !== id));
    },
  };

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
