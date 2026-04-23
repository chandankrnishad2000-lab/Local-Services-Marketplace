import { notFound } from "next/navigation";
import { apiFetchServer } from "@/lib/api-server";

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await apiFetchServer(`/api/listings/${id}`);
  if (!res.ok) return notFound();
  const data = await res.json();
  const listing = data.listing;
  if (!listing) return notFound();

  return (
    <div className="container section">
      <div className="card">
        <h2>Edit listing</h2>
        <p className="muted">Editing is handled in the provider dashboard UI.</p>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(listing, null, 2)}</pre>
      </div>
    </div>
  );
}
