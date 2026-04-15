import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/utils";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: { listing: true, payment: true, customer: true, localPro: true }
  });

  if (!booking) return notFound();

  return (
    <div className="container section">
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <h2>{booking.listing.title}</h2>
        <p className="muted">Customer: {booking.customer.name}</p>
        <p className="muted">Local Pro: {booking.localPro.name}</p>
        <p>Status: {booking.status}</p>
        <p>Service: {formatMoney(booking.totalCents, booking.listing.currency)}</p>
        <p>Tip: {formatMoney(booking.tipCents, booking.listing.currency)}</p>
        <p>Total: {formatMoney(booking.totalCents + booking.tipCents, booking.listing.currency)}</p>
        <p>Payment: {booking.payment?.status ?? "Not started"}</p>
      </div>
    </div>
  );
}
