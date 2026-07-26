"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { LoginDto, RegisterDto } from "@/lib/api/schemas/auth";
import type { SessionUser } from "@/lib/api/token";

type AuthContextValue = {
  user: SessionUser | undefined;
  login: (dto: LoginDto) => Promise<SessionUser>;
  register: (dto: RegisterDto) => Promise<SessionUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(Array.isArray(data.message) ? data.message.join(", ") : data.message);
  }
  return data;
}

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | undefined;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<SessionUser | undefined>(initialUser);

  const login = useCallback(async (dto: LoginDto) => {
    const { user: loggedInUser } = await postJson("/api/auth/login", dto);
    setUser(loggedInUser);
    return loggedInUser as SessionUser;
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const { user: registeredUser } = await postJson("/api/auth/register", dto);
    setUser(registeredUser);
    return registeredUser as SessionUser;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(undefined);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
