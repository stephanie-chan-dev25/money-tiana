import api from "./api";
import type { DashboardSummary } from "../types/dashboard.types";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await api.get<{ dashboard: DashboardSummary }>("/dashboard");
    return data.dashboard;
  },
};
