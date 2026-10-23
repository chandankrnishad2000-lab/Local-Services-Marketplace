import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";

type BookingListItem = {
  id: number;
  listingTitle: string;
  status: string;
  paymentStatus?: string;
  total_cents: number;
  tip_cents: number;
  listingCurrency: string;
};

export default async function BookingsPage() {
  const [meRes, bookingsRes] = await Promise.all([
    apiFetchServer("/api/auth/me"),
    apiFetchServer("/api/bookings")
  ]);
  const me = meRes.ok ? (await meRes.json()).user : null;
  const data = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] };
  const bookings: BookingListItem[] = data.bookings ?? [];

  if (!me) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2>Your bookings</h2>
          <p className="muted">Log in to view and manage your bookings.</p>
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
        <h2>Your bookings</h2>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {bookings.map((booking: BookingListItem) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="card"
              style={{ background: "#f9fbfd" }}
            >
              <h3>{booking.listingTitle}</h3>
              <p className="muted">Status: {booking.status}</p>
              <p className="muted">Payment: {booking.paymentStatus ?? "Not started"}</p>
              <p className="muted">
                Total: {formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}
              </p>
            </Link>
          ))}
          {bookings.length === 0 ? <p className="muted">No bookings yet. Browse services to get started.</p> : null}
        </div>
      </div>
    </div>
  );
}
