import { apiClient } from "./client";

export type AgentApiResponse = {
  id: string;
  organization_id: string;
  department_id: string | null;
  name: string;
  role: string;
  goal: string;
  instructions: string;
  memory_config: unknown;
  tools: unknown[];
  permissions: unknown;
  status: string;
  is_manager: boolean;
  created_at: string;
  updated_at: string;
};

export const agentApi = {
  list: (organization_id: string, skip = 0, limit = 100) =>
    apiClient
      .get<AgentApiResponse[]>("/agents", {
        params: { organization_id, skip, limit },
      })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<AgentApiResponse>(`/agents/${id}`).then((r) => r.data),

  create: (data: {
    organization_id: string;
    name: string;
    role: string;
    goal: string;
    instructions: string;
    department_id?: string;
    status?: string;
    is_manager?: boolean;
    tools?: unknown[];
  }) =>
    apiClient.post<AgentApiResponse>("/agents", data).then((r) => r.data),

  update: (
    id: string,
    data: Partial<{
      name: string;
      role: string;
      goal: string;
      instructions: string;
      status: string;
      is_manager: boolean;
    }>
  ) =>
    apiClient
      .patch<AgentApiResponse>(`/agents/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/agents/${id}`),
};
