import { API_BASE_URL } from "../config/env";

export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("auth_token");

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }

  return res.json();
}
