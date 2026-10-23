"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Button from "@/components/Button";
import { formatMoney } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const tipOptions = [0, 500, 1000, 2000];

export default function BookingForm({
  listingId,
  priceCents,
  currency
}: {
  listingId: string;
  priceCents: number;
  currency: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [tipCents, setTipCents] = useState(0);
  const { user, isAuthenticated } = useAuth();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!isAuthenticated) {
      setStatus("Please log in as a customer to book this service.");
      return;
    }

    if (user?.role !== "CUSTOMER") {
      setStatus("Only customers can request bookings. Switch to a customer account.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ ...payload, listingId, tipCents })
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error ?? "Booking failed. Please try again.");
      return;
    }

    const checkout = await apiFetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ bookingId: data.bookingId })
    });

    const checkoutData = await checkout.json();
    if (checkout.ok && checkoutData.url) {
      window.location.href = checkoutData.url;
      return;
    }

    setStatus("Booking created. Redirecting to your booking...");
    window.location.href = `/bookings/${data.bookingId}`;
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label className="field">
        <span>Start</span>
        <input name="startAt" type="datetime-local" required />
      </label>
      <label className="field">
        <span>End</span>
        <input name="endAt" type="datetime-local" required />
      </label>
      <label className="field">
        <span>Notes</span>
        <textarea name="notes" rows={3} />
      </label>
      <label className="field">
        <span>Add a tip</span>
        <select
          name="tipCents"
          value={tipCents}
          onChange={(event) => setTipCents(Number(event.target.value))}
        >
          {tipOptions.map((value) => (
            <option key={value} value={value}>
              {value === 0 ? "No tip" : formatMoney(value, currency)}
            </option>
          ))}
        </select>
      </label>
      <div className="card" style={{ background: "#f9fbfd" }}>
        <p className="muted">Estimated total</p>
        <h3>{formatMoney(priceCents + tipCents, currency)}</h3>
      </div>
      {status ? <p className="muted">{status}</p> : null}
      {!isAuthenticated ? (
        <a className="button ghost" href="/login">
          Log in to book
        </a>
      ) : null}
      <Button type="submit">Request booking</Button>
    </form>
  );
}
