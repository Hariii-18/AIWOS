import { apiClient } from "./client";

export type LoginResponse = { access_token: string; token_type: string };

export type UserApiResponse = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export const authApi = {
  login: (email: string, password: string) =>
    apiClient
      .post<LoginResponse>("/auth/login", { email, password })
      .then((r) => r.data),

  register: (email: string, password: string, full_name: string) =>
    apiClient
      .post<UserApiResponse>("/auth/register", { email, password, full_name })
      .then((r) => r.data),

  me: () => apiClient.get<UserApiResponse>("/auth/me").then((r) => r.data),
};
