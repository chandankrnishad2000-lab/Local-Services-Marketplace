"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { apiFetch } from "@/lib/api";

export default function NewListingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      category: form.get("category"),
      location: form.get("location"),
      serviceArea: form.get("serviceArea"),
      durationMinutes: form.get("durationMinutes"),
      priceCents: Number(form.get("priceCents")),
      highlights: form.get("highlights"),
      requirements: form.get("requirements"),
      imageUrl: form.get("imageUrl")
    };

    const res = await apiFetch("/api/listings", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to create listing.");
      return;
    }

    router.push(`/listings/${data.id}`);
  }

  return (
    <div className="container section">
      <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2>Create a listing</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label className="field">
            <span>Title</span>
            <input name="title" required />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea name="description" rows={4} required />
          </label>
          <label className="field">
            <span>Category</span>
            <input name="category" required />
          </label>
          <label className="field">
            <span>Location</span>
            <input name="location" required />
          </label>
          <label className="field">
            <span>Service area</span>
            <input name="serviceArea" placeholder="City + nearby suburbs" />
          </label>
          <label className="field">
            <span>Estimated duration (minutes)</span>
            <input name="durationMinutes" type="number" min={15} max={480} defaultValue={60} />
          </label>
          <label className="field">
            <span>Price (cents)</span>
            <input name="priceCents" type="number" min={100} required />
          </label>
          <label className="field">
            <span>Highlights (comma or new line separated)</span>
            <textarea name="highlights" rows={3} placeholder="Eco-friendly products, Same-day booking" />
          </label>
          <label className="field">
            <span>Requirements (comma or new line separated)</span>
            <textarea name="requirements" rows={3} placeholder="Access to water, Pets secured" />
          </label>
          <label className="field">
            <span>Hero image URL</span>
            <input name="imageUrl" type="url" placeholder="https://" />
          </label>
          {error ? <p style={{ color: "#7a2f1b" }}>{error}</p> : null}
          <Button type="submit">Create listing</Button>
        </form>
      </div>
    </div>
  );
}
