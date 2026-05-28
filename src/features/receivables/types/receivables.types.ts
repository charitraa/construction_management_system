export interface Receivable {
  id: string;
  name: string;
  client_name: string;
  location: string;
  status: "ongoing" | "completed" | "delayed" | "planned";
  budget: number;
  received: number;
  remaining: number;
}

export interface ReceivablesSummary {
  total_budget: number;
  total_received: number;
  total_remaining: number;
  projects_count: number;
  clients_with_dues: number;
}

export interface ReceivablesResponse {
  data: Receivable[];
  summary: ReceivablesSummary;
  message: string;
}

export interface ReceivablesParams {
  search?: string;
  status?: string;
  outstanding_only?: boolean;
}
