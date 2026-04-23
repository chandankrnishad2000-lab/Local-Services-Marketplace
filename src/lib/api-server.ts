import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";

export async function apiFetchServer(path: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  return fetch(`${API_BASE}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(options.headers ?? {}),
      cookie: cookieHeader
    }
  });
}
