import { apiFetch } from "./client";

export function askQuery(question: string) {
  return apiFetch<{ answer: string }>("/query", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
