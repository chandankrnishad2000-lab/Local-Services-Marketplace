import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import { fetchListingCards, getFallbackListings } from "@/lib/listings";

export default async function ServicesPage() {
  const listings = await fetchListingCards("/api/listings");
  const displayListings = listings.length > 0 ? listings : getFallbackListings("/listings");

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
