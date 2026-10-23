"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "@/lib/api";

type Listing = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  price_cents: number;
  currency: string;
  location: string;
  serviceArea?: string | null;
  highlights: string[];
  requirements: string[];
  imageUrl?: string | null;
};

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch(`/api/listings/${params.id}`)
      .then((res) => (res.ok ? res.json() : { listing: null }))
      .then((data) => {
        if (active && data.listing) setForm(data.listing);
      })
      .catch(() => null)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      serviceArea: form.serviceArea || null,
      durationMinutes: form.duration_minutes,
      priceCents: form.price_cents,
      highlights: form.highlights,
      requirements: form.requirements,
      imageUrl: form.imageUrl || null
    };

    const res = await apiFetch(`/api/listings/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed.");
      setSaving(false);
      return;
    }
    setMessage("Listing saved.");
    setSaving(false);
    setTimeout(() => router.push("/providers/listings"), 800);
  }

  if (loading) {
    return (
      <div className="container section">
        <p className="muted">Loading listing...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container section">
        <h2>Listing not found</h2>
        <p className="muted">This listing does not exist or you don't have access to it.</p>
        <Link className="button primary" href="/providers/listings">Back to my listings</Link>
      </div>
    );
  }

  const set = (patch: Partial<Listing>) => setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  return (
    <div className="container section" style={{ maxWidth: 720, margin: "0 auto" }}>
      <Link href="/providers/listings" className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Back to my listings
      </Link>
      <h2 style={{ marginBottom: 4 }}>Edit listing</h2>
      <p className="muted" style={{ marginBottom: 24 }}>Update your service details.</p>

      <form className="card form-grid" onSubmit={onSubmit}>
        <label className="field">
          <span>Title</span>
          <input value={form.title} onChange={(e) => set({ title: e.target.value })} required />
        </label>
        <label className="field">
          <span>Category</span>
          <input value={form.category} onChange={(e) => set({ category: e.target.value })} required />
        </label>
        <label className="field">
          <span>Location</span>
          <input value={form.location} onChange={(e) => set({ location: e.target.value })} required />
        </label>
        <label className="field">
          <span>Service area</span>
          <input value={form.serviceArea ?? ""} onChange={(e) => set({ serviceArea: e.target.value })} />
        </label>
        <label className="field">
          <span>Price (cents)</span>
          <input type="number" min={100} value={form.price_cents} onChange={(e) => set({ price_cents: Number(e.target.value) })} required />
        </label>
        <label className="field">
          <span>Duration (minutes)</span>
          <input type="number" min={15} max={480} value={form.duration_minutes} onChange={(e) => set({ duration_minutes: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea rows={4} value={form.description} onChange={(e) => set({ description: e.target.value })} required />
        </label>
        <label className="field">
          <span>Highlights (one per line)</span>
          <textarea rows={3} value={form.highlights.join("\n")} onChange={(e) => set({ highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        </label>
        <label className="field">
          <span>Requirements (one per line)</span>
          <textarea rows={3} value={form.requirements.join("\n")} onChange={(e) => set({ requirements: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
        </label>
        <label className="field">
          <span>Hero image URL</span>
          <input type="url" value={form.imageUrl ?? ""} onChange={(e) => set({ imageUrl: e.target.value })} placeholder="https://" />
        </label>

        {error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}
        {message ? <p style={{ color: "#16a34a" }}>{message}</p> : null}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="button primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
          <Link className="button ghost" href="/providers/listings">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
