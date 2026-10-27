import api from "./api";
import type { AuthResponse, User } from "../types/auth.types";

export const authService = {
  async register(email: string, password: string): Promise<User> {
    const { data } = await api.post<AuthResponse>("/auth/register", { email, password });
    return data.user;
  },
  async login(email: string, password: string): Promise<User> {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data.user;
  },
  async me(): Promise<User> {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data.user;
  },
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
