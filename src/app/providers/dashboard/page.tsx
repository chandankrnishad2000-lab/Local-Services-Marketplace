import Link from "next/link";
import { apiFetchServer } from "@/lib/api-server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default async function LocalProDashboard() {
  const res = await apiFetchServer("/api/auth/me");
  const data = res.ok ? await res.json() : { user: null };
  const user = data.user;

  return (
    <div className="container section">
      <div className="card" style={{ display: "grid", gap: 16 }}>
        <h2>Local Pro dashboard</h2>
        <p className="muted">
          {user
            ? `Welcome back, ${user.name}. Manage your listings and payouts.`
            : "Log in to manage your listings and payouts."}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/local-pros/listings/new" className="button primary">
            Create new listing
          </Link>
          <Link href="/local-pros/bookings" className="button outline">
            View bookings
          </Link>
          <form action={`${API_BASE}/api/stripe/connect`} method="POST">
            <button className="button ghost" type="submit">
              Connect Stripe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
