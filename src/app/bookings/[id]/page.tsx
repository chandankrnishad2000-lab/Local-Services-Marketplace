import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await apiFetchServer(`/api/bookings/${id}`);
  if (!res.ok) return notFound();
  const data = await res.json();
  const booking = data.booking;
  if (!booking) return notFound();

  return (
    <div className="container section">
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <h2>{booking.listingTitle}</h2>
        <p className="muted">Customer: {booking.customerName}</p>
        <p className="muted">Local Pro: {booking.localProName}</p>
        <p>Status: {booking.status}</p>
        <p>Service: {formatMoney(booking.total_cents, booking.listingCurrency)}</p>
        <p>Tip: {formatMoney(booking.tip_cents, booking.listingCurrency)}</p>
        <p>Total: {formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}</p>
        <p>Payment: {booking.paymentStatus ?? "Not started"}</p>
      </div>
    </div>
  );
}
