import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await db.serviceListing.findUnique({
    where: { id },
    include: {
      localPro: { select: { name: true } },
      reviews: true
    }
  });

  if (!listing) return notFound();

  const ratingTotal = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
  const rating = listing.reviews.length ? ratingTotal / listing.reviews.length : null;

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
              <span className="pill">{listing.localPro.name}</span>
              <span className="muted">
                {rating ? `${rating.toFixed(1)} (${listing.reviews.length} reviews)` : "New"}
              </span>
              <span className="muted">{listing.durationMinutes} min</span>
              <span className="price">{formatMoney(listing.priceCents, listing.currency)}</span>
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
            priceCents={listing.priceCents}
            currency={listing.currency}
          />
        </div>
      </div>
    </div>
  );
}
