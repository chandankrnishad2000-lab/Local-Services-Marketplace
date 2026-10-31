import { cookies } from "next/headers";
import { API_BASE } from "@/lib/api";

export async function apiFetchServer(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...options,
      cache: "no-store",
      headers: {
        ...(options.headers ?? {}),
        cookie: cookieHeader
      }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Backend unavailable." }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
}
