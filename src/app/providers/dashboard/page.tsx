import Link from "next/link";
import { apiFetchServer } from "@/lib/api-server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default async function LocalProDashboard() {
  const [meRes, listingsRes, bookingsRes] = await Promise.all([
    apiFetchServer("/api/auth/me"),
    apiFetchServer("/api/listings/me"),
    apiFetchServer("/api/bookings")
  ]);

  const me = meRes.ok ? (await meRes.json()).user : null;
  const listings = listingsRes.ok ? (await listingsRes.json()).listings ?? [] : [];
  const bookings = bookingsRes.ok ? (await bookingsRes.json()).bookings ?? [] : [];

  const activeListings = listings.filter((l: { status: string }) => l.status === "ACTIVE").length;
  const pendingBookings = bookings.filter((b: { status: string }) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b: { status: string }) => b.status === "CONFIRMED").length;

  if (!me) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2>Local Pro dashboard</h2>
          <p className="muted">Log in with a Local Pro account to manage your listings and payouts.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <Link className="button primary" href="/login">Log in</Link>
            <Link className="button ghost" href="/register">Sign up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Welcome back, {me.name}</h2>
          <p className="muted">Manage your listings, bookings, and payouts.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/providers/listings/new" className="button primary">+ New listing</Link>
          <Link href="/providers/listings" className="button outline">My listings</Link>
          <Link href="/providers/bookings" className="button outline">Bookings</Link>
          <form action={`${API_BASE}/api/stripe/connect`} method="POST">
            <button className="button ghost" type="submit">Connect Stripe</button>
          </form>
        </div>
      </div>

      <div className="row g-3 mt-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Total listings", value: listings.length },
          { label: "Active listings", value: activeListings },
          { label: "Pending bookings", value: pendingBookings },
          { label: "Confirmed bookings", value: confirmedBookings }
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: "center" }}>
            <p className="muted">{stat.label}</p>
            <h3 style={{ fontSize: "2rem" }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Quick actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="button primary" href="/providers/listings/new">Create a new listing</Link>
          <Link className="button ghost" href="/providers/listings">Edit existing listings</Link>
          <Link className="button ghost" href="/providers/bookings">Review booking requests</Link>
        </div>
      </div>
    </div>
  );
}
