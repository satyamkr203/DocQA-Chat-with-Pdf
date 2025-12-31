import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi } from "../../api/auth.api";

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_STORAGE_KEY = "auth_token";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() => {

    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  useEffect(() => {

    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setToken(res.token);
  };

  const setTokenDirect = (token: string) => {
    setToken(token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, setToken: setTokenDirect, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
