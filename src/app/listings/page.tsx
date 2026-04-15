import ListingCard from "@/components/ListingCard";
import Section from "@/components/Section";
import { db } from "@/lib/db";
import { safeJson } from "@/lib/utils";

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

  const listings = await db.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      ...(category ? { category } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            priceCents: {
              ...(minPrice ? { gte: minPrice } : {}),
              ...(maxPrice ? { lte: maxPrice } : {})
            }
          }
        : {})
    },
    include: {
      localPro: { select: { name: true } },
      reviews: true
    },
    orderBy: { createdAt: "desc" },
    take: 24
  });

  const categories = await db.serviceListing.findMany({
    where: { status: "ACTIVE" },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" }
  });

  const cards = safeJson(
    listings.map((listing) => {
      const ratingTotal = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
      const rating = listing.reviews.length ? ratingTotal / listing.reviews.length : undefined;

      return {
        id: listing.id,
        title: listing.title,
        category: listing.category,
        location: listing.location,
        durationMinutes: listing.durationMinutes,
        priceCents: listing.priceCents,
        currency: listing.currency,
        providerName: listing.localPro.name,
        rating,
        reviewCount: listing.reviews.length
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
