import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getSession, setSession } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession());

  useEffect(() => {
    const onChange = () => setSessionState(getSession());
    window.addEventListener("storage", onChange);
    window.addEventListener("jssa_auth_changed", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("jssa_auth_changed", onChange);
    };
  }, []);

  const value = useMemo(() => {
    return {
      session,
      isAuthenticated: Boolean(session && session.token),
      role: session?.role,
      identifier: session?.identifier,
      token: session?.token,
      login: ({ identifier, role, token }) => setSession({ identifier, role, token }),
      logout: () => clearSession(),
    };
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}
