import Link from "next/link";
import { getServiceBySlug, serviceFeatures } from "@/lib/services";
import { apiFetchServer } from "@/lib/api-server";
import { formatMoney } from "@/lib/utils";

export function generateStaticParams() {
  return serviceFeatures.map((feature) => ({ slug: feature.slug }));
}

type ServiceListing = {
  id: number;
  title: string;
  category: string;
  location: string;
  price_cents?: number;
  priceCents?: number;
  currency: string;
  localProName?: string;
  localProEmail?: string;
  localProPhone?: string;
  localProCompany?: string;
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <div className="container section">
        <h1 className="h3 fw-bold">Service not found</h1>
        <p className="text-muted">Please choose a service from the main list.</p>
        <Link className="button primary" href="/services">
          View all services
        </Link>
      </div>
    );
  }

  const query = service?.categoryQuery ? `?category=${encodeURIComponent(service.categoryQuery)}` : "";
  const res = await apiFetchServer(`/api/listings${query}`);
  const data = res.ok ? await res.json() : { listings: [] };
  const listings: ServiceListing[] = data.listings ?? [];

  return (
    <div className="container section">
      <div className="text-center mb-5">
        <div className="display-4 mb-3">{service.icon}</div>
        <h1 className="h2 fw-bold mb-2">{service.heroTitle}</h1>
        <p className="text-muted lead">{service.heroSubtitle}</p>
      </div>

      <div className="card border-0 shadow-sm mb-5">
        <div className="card-body">
          <h2 className="h5 fw-bold mb-2">Available providers</h2>
          <p className="text-muted mb-4">
            Showing providers for category: <strong>{service.categoryQuery}</strong>
          </p>
          <div className="row g-4">
            {listings.slice(0, 6).map((listing) => (
              <div key={listing.id} className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div>
                        <h3 className="h5 fw-bold mb-1">{listing.localProName ?? "Local Pro"}</h3>
                        <p className="text-muted mb-1">{listing.localProCompany ?? listing.title}</p>
                        <p className="text-muted mb-0">{listing.location}</p>
                      </div>
                      <div className="text-end">
                        <p className="mb-1 fw-semibold">
                          {formatMoney(listing.price_cents ?? listing.priceCents ?? 0, listing.currency)}
                        </p>
                        <span className="badge bg-light text-dark">{listing.category}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      {listing.localProEmail ? (
                        <p className="mb-1 text-muted">Email: {listing.localProEmail}</p>
                      ) : null}
                      {listing.localProPhone ? (
                        <p className="mb-1 text-muted">Phone: {listing.localProPhone}</p>
                      ) : null}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <Link className="button primary" href={`/listings/${listing.id}`}>
                        Book now
                      </Link>
                      {listing.localProEmail ? (
                        <a className="button ghost" href={`mailto:${listing.localProEmail}`}>
                          Contact
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {listings.length === 0 ? (
            <p className="text-muted">No providers yet. Add a listing to appear here.</p>
          ) : null}
        </div>
      </div>

      <div className="row g-4 mb-5">
        {service.highlights.map((item) => (
          <div key={item} className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold">{item}</h5>
                <p className="text-muted mb-0">
                  Learn how Local Services keeps {service.title.toLowerCase()} reliable and seamless.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 align-items-stretch mb-5">
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3">How it works</h3>
              <ol className="mb-0">
                {service.howItWorks.map((step) => (
                  <li key={step} className="mb-2 text-muted">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3">FAQs</h3>
              {service.faqs.map((faq) => (
                <div key={faq.question} className="mb-3">
                  <p className="fw-semibold mb-1">{faq.question}</p>
                  <p className="text-muted mb-0">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm bg-light">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h3 className="h5 fw-bold mb-1">Ready to book with confidence?</h3>
            <p className="text-muted mb-0">Explore services and connect with top-rated local pros.</p>
          </div>
          <div className="d-flex gap-2">
            <Link className="button primary" href="/listings">
              Browse listings
            </Link>
            <Link className="button ghost" href="/services">
              All services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
