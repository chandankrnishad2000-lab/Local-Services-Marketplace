export type ListingCard = {
  id: string;
  title: string;
  category: string;
  location: string;
  durationMinutes?: number;
  priceCents: number;
  currency: string;
  providerName: string;
  rating?: number;
  reviewCount?: number;
  href?: string;
};
