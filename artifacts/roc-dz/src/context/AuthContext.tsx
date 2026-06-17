import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "admin" | "super_admin";
export interface AuthUser { username: string; role: Role; displayName: string; token: string; }

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "roc-dz-auth";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        fetch(`${BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${parsed.token}` } })
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(data => setUser({ ...data, token: parsed.token }))
          .catch(() => { localStorage.removeItem(STORAGE_KEY); setUser(null); })
          .finally(() => setLoading(false));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    const u: AuthUser = { username: data.username, role: data.role, displayName: data.displayName, token: data.token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AuthUser = JSON.parse(stored);
        fetch(`${BASE}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${parsed.token}` } });
      } catch { /* ignore */ }
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
