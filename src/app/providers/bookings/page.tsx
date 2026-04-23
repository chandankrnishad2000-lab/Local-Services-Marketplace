import { formatMoney } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";

export default async function LocalProBookingsPage() {
  const res = await apiFetchServer("/api/bookings");
  const data = res.ok ? await res.json() : { bookings: [] };
  const bookings = data.bookings ?? [];

  return (
    <div className="container section">
      <div className="card">
        <h2>Local Pro bookings</h2>
        <p className="muted">Track upcoming jobs and payment status.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="card" style={{ background: "#f9fbfd" }}>
              <h3>{booking.listingTitle}</h3>
              <p className="muted">Customer: {booking.customerName ?? "Customer"}</p>
              <p className="muted">Status: {booking.status}</p>
              <p className="muted">
                Total: {formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}
              </p>
            </div>
          ))}
          {bookings.length === 0 ? <p className="muted">No bookings yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
