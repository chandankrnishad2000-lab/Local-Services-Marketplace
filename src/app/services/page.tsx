import Link from "next/link";
import ListingCard from "@/components/ListingCard";
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
    href: "/listings?category=Home%20Care"
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
    href: "/listings?category=Education"
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
    href: "/listings?category=Auto"
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
    href: "/listings?category=Wellness"
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
    href: "/listings?category=Wellness"
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
    href: "/listings?category=Tech"
  },
  {
    id: "demo-7",
    title: "Event Planning & Coordination",
    category: "Events",
    location: "Chennai, TN",
    durationMinutes: 480,
    priceCents: 200000,
    currency: "inr",
    providerName: "Elite Events Co.",
    rating: 4.7,
    reviewCount: 67,
    href: "/listings?category=Events"
  },
  {
    id: "demo-8",
    title: "AC Installation & Repair",
    category: "Home Care",
    location: "Kolkata, WB",
    durationMinutes: 120,
    priceCents: 59999,
    currency: "inr",
    providerName: "Cool Comfort Services",
    rating: 4.6,
    reviewCount: 98,
    href: "/listings?category=Home%20Care"
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
    providerName: listing.localProName ?? "Local Pro",
    rating: listing.rating ?? undefined,
    reviewCount: listing.reviewCount ?? 0
  };
}

export default async function ServicesPage() {
  const res = await apiFetchServer("/api/listings");
  const data = res.ok ? await res.json() : { listings: [] };
  const listings: ListingCardType[] = (data.listings ?? []).map(toListingCard);
  const displayListings = listings.length > 0 ? listings : fallbackListings;

  return (
    <div className="container section">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-5">
        <div>
          <h1 className="h2 fw-bold mb-2">Explore high-demand services</h1>
          <p className="text-muted mb-0">These are trending in your area based on booking velocity.</p>
        </div>
        <Link className="button ghost" href="/listings">
          View all →
        </Link>
      </div>

      <div className="row g-4">
        {displayListings.map((listing) => (
          <div key={listing.id} className="col-md-6 col-lg-4">
            <ListingCard {...listing} />
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm bg-light mt-5">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h2 className="h5 fw-bold mb-1">Add your service to be discovered</h2>
            <p className="text-muted mb-0">Local pros can publish listings to appear on service pages.</p>
          </div>
          <Link className="button primary" href="/providers/listings/new">
            Add a listing
          </Link>
        </div>
      </div>
    </div>
  );
}
