import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function getApiError(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.response?.status === 401) return "Your session has expired. Please sign in again.";
    if (!error.response) return "Cannot connect to the server. Check that the backend is running.";
  }
  return fallback;
}

export default api;
