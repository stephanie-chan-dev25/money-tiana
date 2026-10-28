import api from "./api";

export interface Goal {
  id: number;
  name: string;
  target_amount: string | number;
}

export interface CreateGoalInput {
  name: string;
  target_amount: number;
}

interface GoalsResponse { goals: Goal[] }
interface GoalResponse { goal: Goal }

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const response = await api.get<GoalsResponse>("/goals");
    return response.data.goals;
  },
  async create(input: CreateGoalInput): Promise<Goal> {
    const response = await api.post<GoalResponse>("/goals", input);
    return response.data.goal;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};