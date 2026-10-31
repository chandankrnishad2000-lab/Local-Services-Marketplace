import ListingCard from "@/components/ListingCard";
import { safeJson } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";
import {
  getFallbackListings,
  toListingCard,
  type ListingRecord
} from "@/lib/listings";
import type { ListingCard as ListingCardType } from "@/types";

const fallbackListings = getFallbackListings("/services");

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "";
  const location = typeof resolvedParams.location === "string" ? resolvedParams.location : "";
  const minPrice = parseNumber(typeof resolvedParams.minPrice === "string" ? resolvedParams.minPrice : undefined);
  const maxPrice = parseNumber(typeof resolvedParams.maxPrice === "string" ? resolvedParams.maxPrice : undefined);

  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (location) params.set("location", location);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));

  const res = await apiFetchServer(`/api/listings?${params.toString()}`);
  const data = res.ok ? await res.json() : { listings: [] };
  const listings: ListingRecord[] = data.listings ?? [];
  const hasFilters = Boolean(q || category || location || minPrice !== undefined || maxPrice !== undefined);
  const displayListings = listings.length ? listings.map(toListingCard) : hasFilters ? [] : fallbackListings;

  const categories: Array<{ category: string }> = Array.from(
    new Set<string>(
      (listings.length ? listings : fallbackListings)
        .map((item: ListingRecord | ListingCardType) => String(item.category ?? ""))
        .filter(Boolean)
    )
  ).map((cat) => ({ category: cat }));

  const cards = safeJson(displayListings);

  return (
    <div style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-primary-dark)',
            marginBottom: '12px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-primary)'
            }}/>
            Browse
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-heading)',
            marginTop: '8px',
            lineHeight: 1.1
          }}>
            Find the right service
          </h1>
          <p style={{
            color: 'var(--color-body)',
            marginTop: '12px',
            fontSize: '1rem'
          }}>
            Search by category, price, and availability.
          </p>
        </div>

        {/* Filter Bar */}
        <form method="GET" style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 0.7fr 0.7fr auto',
          gap: '14px',
          alignItems: 'center',
          background: '#fff',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <input
            name="q"
            placeholder="Search services..."
            defaultValue={q}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          />
          <input
            name="location"
            placeholder="City or zip"
            defaultValue={location}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'var(--transition)'
            }}
          />
          <select
            name="category"
            defaultValue={category}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item.category} value={item.category}>
                {item.category}
              </option>
            ))}
          </select>
          <input
            name="minPrice"
            type="number"
            placeholder="Min ₹"
            defaultValue={minPrice ?? ""}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <input
            name="maxPrice"
            type="number"
            placeholder="Max ₹"
            defaultValue={maxPrice ?? ""}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="button primary"
            style={{ padding: '12px 24px' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
              <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5"/>
              <path d="M11 11l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Filter
          </button>
        </form>

        {/* Results */}
        <div className="listing-grid">
          {cards.map((card) => (
            <ListingCard key={card.id} {...card} />
          ))}
        </div>

        {cards.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--color-muted)'
          }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: '0 auto 16px', opacity: 0.3 }}>
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
              <path d="M18 28c1.5 2 3.5 3 6 3s4.5-1 6-3M18 18h.01M30 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>No listings match your filters</p>
            <p style={{ fontSize: '0.9rem' }}>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 840px) {
          form {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
