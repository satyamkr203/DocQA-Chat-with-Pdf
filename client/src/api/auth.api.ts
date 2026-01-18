import { apiFetch } from "./client";

type AuthResponse = {
  token: string;
};

export function loginApi(email: string, password: string) {
  return apiFetch<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    null 
  );
}

export function registerApi(email: string, password: string) {
  return apiFetch<AuthResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    null
  );
}
