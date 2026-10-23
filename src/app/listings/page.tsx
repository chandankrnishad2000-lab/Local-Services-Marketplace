import ListingCard from "@/components/ListingCard";
import { safeJson } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";
import type { ListingCard as ListingCardType } from "@/types";

type ListingRecord = {
  id: number | string;
  title: string;
  category: string;
  location: string;
  duration_minutes?: number;
  durationMinutes?: number;
  price_cents?: number;
  priceCents?: number;
  currency?: string;
  localProName?: string;
  localPro?: { name?: string };
  rating?: number | null;
  reviewCount?: number;
};

const fallbackListings: ListingCardType[] = [
  {
    id: "demo-1",
    title: "Premium Home Cleaning",
    category: "Home Care",
    location: "Mumbai, MH",
    durationMinutes: 180,
    priceCents: 49999,
    currency: "inr",
    providerName: "Sparkle Co.",
    rating: 4.9,
    reviewCount: 118,
    href: "/services"
  },
  {
    id: "demo-2",
    title: "Private Math Tutoring",
    category: "Education",
    location: "Bangalore, KA",
    durationMinutes: 60,
    priceCents: 39999,
    currency: "inr",
    providerName: "Elevate Tutors",
    rating: 4.8,
    reviewCount: 76,
    href: "/services"
  },
  {
    id: "demo-3",
    title: "Mobile Auto Detailing",
    category: "Auto",
    location: "Delhi, DL",
    durationMinutes: 120,
    priceCents: 75000,
    currency: "inr",
    providerName: "SeaBreeze Auto",
    rating: 4.7,
    reviewCount: 52,
    href: "/services"
  },
  {
    id: "demo-4",
    title: "Professional Hair Styling",
    category: "Wellness",
    location: "Pune, MH",
    durationMinutes: 90,
    priceCents: 29999,
    currency: "inr",
    providerName: "Salon Bliss",
    rating: 4.9,
    reviewCount: 203,
    href: "/services"
  },
  {
    id: "demo-5",
    title: "Yoga & Fitness Training",
    category: "Wellness",
    location: "Bangalore, KA",
    durationMinutes: 60,
    priceCents: 24999,
    currency: "inr",
    providerName: "FitLife Academy",
    rating: 4.8,
    reviewCount: 145,
    href: "/services"
  },
  {
    id: "demo-6",
    title: "Web Development & Design",
    category: "Tech",
    location: "Hyderabad, TG",
    durationMinutes: 240,
    priceCents: 150000,
    currency: "inr",
    providerName: "CodeCraft Studio",
    rating: 4.9,
    reviewCount: 89,
    href: "/services"
  }
];

function toListingCard(listing: ListingRecord): ListingCardType {
  return {
    id: String(listing.id),
    title: listing.title,
    category: listing.category,
    location: listing.location,
    durationMinutes: listing.duration_minutes ?? listing.durationMinutes,
    priceCents: listing.price_cents ?? listing.priceCents ?? 0,
    currency: listing.currency ?? "inr",
    providerName: listing.localProName ?? listing.localPro?.name ?? "Local Pro",
    rating: listing.rating ?? undefined,
    reviewCount: listing.reviewCount ?? 0
  };
}

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
