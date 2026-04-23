import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";

export default async function BookingsPage() {
  const res = await apiFetchServer("/api/bookings");
  const data = res.ok ? await res.json() : { bookings: [] };
  const bookings = data.bookings ?? [];

  return (
    <div className="container section">
      <div className="card">
        <h2>Your bookings</h2>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {bookings.map((booking) => (
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
          {bookings.length === 0 ? <p className="muted">No bookings yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
