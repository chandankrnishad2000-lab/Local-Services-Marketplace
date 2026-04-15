import { getCurrentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/utils";

export default async function LocalProBookingsPage() {
  const user = await getCurrentUser();

  const bookings = user
    ? await db.booking.findMany({
        where: { localProId: user.id },
        include: { listing: true, customer: true },
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <div className="container section">
      <div className="card">
        <h2>Local Pro bookings</h2>
        <p className="muted">Track upcoming jobs and payment status.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="card" style={{ background: "#f9fbfd" }}>
              <h3>{booking.listing.title}</h3>
              <p className="muted">Customer: {booking.customer.name}</p>
              <p className="muted">Status: {booking.status}</p>
              <p className="muted">
                Total: {formatMoney(booking.totalCents + booking.tipCents, booking.listing.currency)}
              </p>
            </div>
          ))}
          {bookings.length === 0 ? <p className="muted">No bookings yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
