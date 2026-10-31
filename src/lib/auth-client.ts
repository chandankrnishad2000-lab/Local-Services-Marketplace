import { API_BASE } from "@/lib/api";

export type OAuthProviders = { google: boolean; apple: boolean };

export function redirectPathForRole(role?: string | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "LOCAL_PRO") return "/providers/dashboard";
  return "/listings";
}

export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export async function readApiError(res: Response, fallback: string) {
  let text = "";
  try {
    text = await res.text();
  } catch {
    return fallback;
  }

  if (!text) return fallback;

  try {
    const data = JSON.parse(text);
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error;
    }
  } catch {
    const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (clean) return clean.slice(0, 160);
  }

  return fallback;
}

export function oauthStartUrl(provider: "google" | "apple", role?: string) {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  return `${API_BASE}/api/auth/oauth/${provider}/start${query}`;
}
