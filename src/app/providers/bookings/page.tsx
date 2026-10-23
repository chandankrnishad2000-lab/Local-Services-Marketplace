import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";

type ProviderBookingItem = {
  id: number;
  listingTitle: string;
  customerName?: string;
  status: string;
  total_cents: number;
  tip_cents: number;
  listingCurrency: string;
};

export default async function LocalProBookingsPage() {
  const [meRes, bookingsRes] = await Promise.all([
    apiFetchServer("/api/auth/me"),
    apiFetchServer("/api/bookings")
  ]);
  const me = meRes.ok ? (await meRes.json()).user : null;
  const data = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };
  const bookings: ProviderBookingItem[] = data.bookings ?? [];

  if (!me || me.role !== "LOCAL_PRO") {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2>Local Pro bookings</h2>
          <p className="muted">Log in with a Local Pro account to track upcoming jobs and payments.</p>
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
      <div className="card">
        <h2>Local Pro bookings</h2>
        <p className="muted">Track upcoming jobs and payment status.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {bookings.map((booking: ProviderBookingItem) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="card"
              style={{ background: "#f9fbfd" }}
            >
              <h3>{booking.listingTitle}</h3>
              <p className="muted">Customer: {booking.customerName ?? "Customer"}</p>
              <p className="muted">Status: {booking.status}</p>
              <p className="muted">
                Total: {formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}
              </p>
            </Link>
          ))}
          {bookings.length === 0 ? <p className="muted">No bookings yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
