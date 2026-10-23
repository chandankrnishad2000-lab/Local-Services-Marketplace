"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/utils";

type MyListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  price_cents: number;
  currency: string;
  status: string;
  rating?: number | null;
  reviewCount: number;
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DELETED: "Deleted"
};

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch("/api/listings/me")
      .then((res) => (res.ok ? res.json() : { listings: [] }))
      .then((data) => {
        if (active) setListings(data.listings ?? []);
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function removeListing(id: string) {
    if (!window.confirm("Delete this listing permanently?")) return;
    setMessage(null);
    const res = await apiFetch(`/api/listings/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Delete failed.");
      return;
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
    setMessage("Listing deleted.");
  }

  if (loading) {
    return (
      <div className="container section">
        <p className="muted">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div className="container section" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h2>My listings</h2>
          <p className="muted">Manage the services you offer.</p>
        </div>
        <Link className="button primary" href="/providers/listings/new">+ New listing</Link>
      </div>

      {message ? <p style={{ color: message.startsWith("Delete failed") ? "#dc2626" : "#16a34a", marginBottom: 16 }}>{message}</p> : null}

      <div style={{ display: "grid", gap: 12 }}>
        {listings.length === 0 ? (
          <div className="card">
            <p className="muted">You haven't created any listings yet.</p>
            <Link className="button primary" href="/providers/listings/new" style={{ marginTop: 12, display: "inline-flex" }}>
              Create your first listing
            </Link>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ marginBottom: 4 }}>{listing.title}</h3>
                <p className="muted" style={{ marginBottom: 4 }}>
                  {listing.category} · {listing.location}
                </p>
                <p className="muted">
                  {formatMoney(listing.price_cents, listing.currency)}
                  {listing.rating ? ` · ★ ${listing.rating.toFixed(1)} (${listing.reviewCount})` : " · New"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span className={`badge ${listing.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                  {STATUS_LABELS[listing.status] ?? listing.status}
                </span>
                <Link className="button ghost" href={`/listings/${listing.id}`}>View</Link>
                <Link className="button ghost" href={`/providers/listings/${listing.id}/edit`}>Edit</Link>
                <button className="button ghost" onClick={() => removeListing(listing.id)} style={{ color: "#dc2626" }}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
