import { apiFetchServer } from "@/lib/api-server";
import type { ListingCard as ListingCardType } from "@/types";

export type ListingRecord = {
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

const fallbackSeed: Array<Omit<ListingCardType, "href">> = [
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
    reviewCount: 118
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
    reviewCount: 76
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
    reviewCount: 52
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
    reviewCount: 203
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
    reviewCount: 145
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
    reviewCount: 89
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
    reviewCount: 67
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
    reviewCount: 98
  }
];

export function getFallbackListings(href = "/listings"): ListingCardType[] {
  return fallbackSeed.map((listing) => ({ ...listing, href }));
}

export function toListingCard(listing: ListingRecord): ListingCardType {
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

export async function fetchListingCards(path = "/api/listings"): Promise<ListingCardType[]> {
  const res = await apiFetchServer(path);
  if (!res.ok) return [];

  const data = await res.json().catch(() => null);
  const rows: ListingRecord[] = Array.isArray(data?.listings) ? data.listings : [];
  return rows.map(toListingCard);
}
