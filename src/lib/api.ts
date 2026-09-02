/**
 * Centralized API client for Vrishabhanvi Ventures.
 *
 * In local development:
 *   VITE_API_URL is empty -> requests use relative paths (e.g., "/api/auth/login")
 *   which are handled by the local Vite dev server middleware.
 *
 * In production (Cloudflare Pages):
 *   VITE_API_URL is set to the Render backend URL (e.g., "https://vrishabhanvi-api.onrender.com")
 *   so requests are sent directly to the Render backend API.
 *
 * All authenticated requests rely strictly on secure HttpOnly cookies (credentials: "include").
 * No tokens are stored in localStorage or sessionStorage.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || "";
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = apiUrl(path);

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Always transmit HttpOnly cookies across origins
  });
}
