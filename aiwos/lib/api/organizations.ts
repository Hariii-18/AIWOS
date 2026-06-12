import { apiClient } from "./client";

export type OrgApiResponse = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export const orgApi = {
  list: (skip = 0, limit = 50) =>
    apiClient
      .get<OrgApiResponse[]>("/organizations", { params: { skip, limit } })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<OrgApiResponse>(`/organizations/${id}`).then((r) => r.data),

  create: (name: string, slug: string) =>
    apiClient
      .post<OrgApiResponse>("/organizations", { name, slug })
      .then((r) => r.data),

  update: (id: string, data: Partial<{ name: string; slug: string }>) =>
    apiClient
      .patch<OrgApiResponse>(`/organizations/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/organizations/${id}`),
};
