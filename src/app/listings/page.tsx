import ListingCard from "@/components/ListingCard";
import Section from "@/components/Section";
import { safeJson } from "@/lib/utils";
import { apiFetchServer } from "@/lib/api-server";

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
  const listings = data.listings ?? [];

  const categories = Array.from(
    new Set(listings.map((item: { category: string }) => item.category))
  ).map((cat) => ({ category: cat }));

  const cards = safeJson(
    listings.map((listing: any) => {
      return {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        location: listing.location,
        durationMinutes: listing.duration_minutes ?? listing.durationMinutes,
        priceCents: listing.price_cents ?? listing.priceCents,
        currency: listing.currency,
        providerName: listing.localProName ?? listing.localPro?.name,
        rating: listing.rating ?? null,
        reviewCount: listing.reviewCount ?? 0
      };
    })
  );

  return (
    <div className="container section">
      <Section
        eyebrow="Browse"
        title="Find the right service"
        subtitle="Search by category, price, and availability."
      />

      <form className="filter-bar" method="GET">
        <input name="q" placeholder="Search services" defaultValue={q} />
        <input name="location" placeholder="City or zip" defaultValue={location} />
        <select name="category" defaultValue={category}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.category} value={item.category}>
              {item.category}
            </option>
          ))}
        </select>
        <input name="minPrice" type="number" placeholder="Min $" defaultValue={minPrice ?? ""} />
        <input name="maxPrice" type="number" placeholder="Max $" defaultValue={maxPrice ?? ""} />
        <button className="button outline" type="submit">
          Filter
        </button>
      </form>

      <div className="listing-grid">
        {cards.map((card) => (
          <ListingCard key={card.id} {...card} />
        ))}
      </div>

      {cards.length === 0 ? <p className="muted">No listings match your filters.</p> : null}
    </div>
  );
}
