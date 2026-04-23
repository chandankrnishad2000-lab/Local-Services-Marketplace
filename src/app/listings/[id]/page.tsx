import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";
import { apiFetchServer } from "@/lib/api-server";

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await apiFetchServer(`/api/listings/${id}`);
  if (!res.ok) return notFound();
  const data = await res.json();
  const listing = data.listing;
  if (!listing) return notFound();
  const rating = listing.rating ?? null;

  return (
    <div className="container section" style={{ display: "grid", gap: 32 }}>
      <div className="card">
        <div className="detail-grid">
          <div>
            <p className="eyebrow">{listing.category}</p>
            <h1>{listing.title}</h1>
            <p className="muted">{listing.location}</p>
            {listing.serviceArea ? <p className="muted">Service area: {listing.serviceArea}</p> : null}
            <p>{listing.description}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <span className="pill">{listing.localProName ?? "Local Pro"}</span>
              <span className="muted">
                {rating ? `${rating.toFixed(1)} (${listing.reviewCount ?? 0} reviews)` : "New"}
              </span>
              <span className="muted">{listing.duration_minutes ?? listing.durationMinutes} min</span>
              <span className="price">{formatMoney(listing.price_cents ?? listing.priceCents, listing.currency)}</span>
            </div>
          </div>
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="detail-image"
            />
          ) : null}
        </div>
      </div>

      <div className="detail-columns">
        <div className="card">
          <h3>Highlights</h3>
          <ul className="detail-list">
            {listing.highlights.length ? (
              listing.highlights.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>Trusted local provider</li>
            )}
          </ul>
          <h3 style={{ marginTop: 16 }}>Requirements</h3>
          <ul className="detail-list">
            {listing.requirements.length ? (
              listing.requirements.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>No special requirements.</li>
            )}
          </ul>
        </div>
        <div className="card">
          <h2>Request a booking</h2>
          <BookingForm
            listingId={listing.id}
            priceCents={listing.price_cents ?? listing.priceCents}
            currency={listing.currency}
          />
        </div>
      </div>
    </div>
  );
}
