import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types/auth.types";
import { authService } from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setUser(await authService.me());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => setUser(await authService.login(email, password));
  const register = async (email: string, password: string) => setUser(await authService.register(email, password));
  const logout = async () => {
    try { await authService.logout(); } finally { setUser(null); }
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
