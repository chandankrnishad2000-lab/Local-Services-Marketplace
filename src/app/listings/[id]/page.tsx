import { notFound } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";
import { apiFetchServer } from "@/lib/api-server";

type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  customerName: string;
  created_at: string;
};

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

  const reviewsRes = await apiFetchServer(`/api/reviews?listingId=${encodeURIComponent(id)}`);
  const reviewsData = reviewsRes.ok ? await reviewsRes.json() : { reviews: [] };
  const reviews: Review[] = reviewsData.reviews ?? [];

  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container" style={{ display: 'grid', gap: '32px' }}>
        {/* Main Card */}
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-xl)',
          padding: '36px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <div className="detail-grid">
            <div>
              <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
                {listing.category}
              </span>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: 'var(--color-heading)',
                marginTop: '8px',
                lineHeight: 1.15,
                marginBottom: '12px'
              }}>
                {listing.title}
              </h1>
              <p style={{
                color: 'var(--color-muted)',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px'
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                {listing.location}
              </p>
              {listing.serviceArea ? (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                  Service area: {listing.serviceArea}
                </p>
              ) : null}
              <p style={{
                color: 'var(--color-body)',
                lineHeight: 1.7,
                marginBottom: '20px',
                fontSize: '0.95rem'
              }}>
                {listing.description}
              </p>
              {listing.localProEmail ? (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginBottom: '6px' }}>
                  📧 {listing.localProEmail}
                </p>
              ) : null}
              {listing.localProPhone ? (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                  📞 {listing.localProPhone}
                </p>
              ) : null}
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
                alignItems: 'center'
              }}>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-primary-bg)',
                  color: 'var(--color-primary-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  {listing.localProName ?? "Local Pro"}
                </span>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--color-heading)',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}>
                  {rating ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                        <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.02l-3.52 1.83.67-3.93L1.3 5.14l3.94-.57L7 1z"/>
                      </svg>
                      {rating.toFixed(1)} ({listing.reviewCount ?? 0})
                    </>
                  ) : "New"}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>
                  {listing.duration_minutes ?? listing.durationMinutes} min
                </span>
                <span style={{
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'var(--color-primary-dark)',
                  marginLeft: 'auto'
                }}>
                  {formatMoney(listing.price_cents ?? listing.priceCents, listing.currency)}
                </span>
              </div>
            </div>
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  minHeight: '220px',
                  border: '1px solid var(--color-border)'
                }}
              />
            ) : null}
          </div>
        </div>

        {/* Details Grid */}
        <div className="detail-columns">
          {/* Highlights & Requirements */}
          <div style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              marginBottom: '16px'
            }}>
              Highlights
            </h3>
            <ul style={{
              display: 'grid',
              gap: '10px',
              paddingLeft: '0',
              listStyle: 'none'
            }}>
              {(listing.highlights?.length ? listing.highlights : ["Trusted local provider"]).map((item: string) => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--color-body)',
                  fontSize: '0.9rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="var(--color-primary)" strokeWidth="1.5"/>
                    <path d="M5.5 8l2 2 3.5-3.5" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              marginTop: '28px',
              marginBottom: '16px'
            }}>
              Requirements
            </h3>
            <ul style={{
              display: 'grid',
              gap: '10px',
              paddingLeft: '0',
              listStyle: 'none'
            }}>
              {(listing.requirements?.length ? listing.requirements : ["No special requirements."]).map((item: string) => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--color-body)',
                  fontSize: '0.9rem'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="var(--color-muted)" strokeWidth="1.2"/>
                    <path d="M5.5 8h5" stroke="var(--color-muted)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Form */}
          <div style={{
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            border: '1px solid var(--color-border)'
          }}>
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              marginBottom: '24px'
            }}>
              Request a booking
            </h2>
            <BookingForm
              listingId={listing.id}
              priceCents={listing.price_cents ?? listing.priceCents}
              currency={listing.currency}
            />
          </div>
        </div>

        {/* Reviews */}
        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          border: '1px solid var(--color-border)'
        }}>
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            marginBottom: '24px'
          }}>
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
              No reviews yet. Be the first to book and share your experience.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {reviews.map((review) => (
                <div key={review.id} style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-soft)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontWeight: 600,
                      color: 'var(--color-heading)',
                      fontSize: '0.92rem'
                    }}>
                      {review.customerName}
                    </span>
                    <span style={{
                      color: '#F59E0B',
                      fontSize: '0.9rem',
                      letterSpacing: '2px'
                    }}>
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  {review.comment ? (
                    <p style={{ color: 'var(--color-body)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '6px' }}>
                      {review.comment}
                    </p>
                  ) : null}
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
