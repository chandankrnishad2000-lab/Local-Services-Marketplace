"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import { formatMoney } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type BookingDetail = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCurrency: string;
  customerName: string;
  localProName: string;
  status: string;
  total_cents: number;
  tip_cents: number;
  notes?: string | null;
  start_at?: string;
  end_at?: string;
  created_at?: string;
  paymentStatus?: string | null;
};

type Review = {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  customerName: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  return <BookingDetailInner id={params.id} />;
}

function BookingDetailInner({ id }: { id: string }) {
  const { user, isLoading: authLoading } = useAuth();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await apiFetch(`/api/bookings/${id}`);
        if (res.status === 404) {
          if (active) setNotFound(true);
          return;
        }
        const data = res.ok ? await res.json() : { booking: null };
        const b = data.booking;
        if (active) setBooking(b);
        if (b) {
          const reviewRes = await apiFetch(`/api/reviews?listingId=${b.listingId}`);
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            const mine = (reviewData.reviews ?? []).find((r: Review) => r.bookingId === b.id);
            if (mine) setMyReview(mine);
          }
        }
      } catch {
        if (active) setError("Failed to load booking.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  async function updateStatus(status: string) {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiFetch(`/api/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Update failed.");
      } else {
        setMessage(`Booking ${STATUS_LABELS[status]?.toLowerCase() ?? status.toLowerCase()}.`);
        setBooking((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch {
      setError("Update failed. Backend not reachable.");
    } finally {
      setActionLoading(false);
    }
  }

  async function payNow() {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiFetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ bookingId: id })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (res.ok) {
        setMessage("Payment received.");
        setBooking((prev) => (prev ? { ...prev, paymentStatus: "PAID" } : prev));
      } else {
        setError(data.error ?? "Checkout failed.");
      }
    } catch {
      setError("Checkout failed. Backend not reachable.");
    } finally {
      setActionLoading(false);
    }
  }

  async function submitReview(e: FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ bookingId: id, rating, comment })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Review failed.");
      } else {
        setMessage("Thanks! Your review has been posted.");
        setMyReview({ id: "temp", bookingId: id, rating, comment, customerName: "You", created_at: "" });
      }
    } catch {
      setError("Review failed. Backend not reachable.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container section">
        <p className="muted">Loading booking...</p>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="container section">
        <h2>Booking not found</h2>
        <p className="muted">This booking does not exist or you don't have access to it.</p>
        <Link className="button primary" href="/bookings">Back to bookings</Link>
      </div>
    );
  }

  const isCustomer = user?.role === "CUSTOMER";
  const isProvider = user?.role === "LOCAL_PRO";
  const isAdmin = user?.role === "ADMIN";

  const canAct = isCustomer || isProvider || isAdmin;
  const showCancel = canAct && (booking.status === "PENDING" || booking.status === "CONFIRMED");
  const showConfirm = (isProvider || isAdmin) && booking.status === "PENDING";
  const showComplete = (isProvider || isAdmin) && booking.status === "CONFIRMED";
  const showReviewForm = isCustomer && booking.status === "COMPLETED" && !myReview;
  const showPay = isCustomer && booking.paymentStatus !== "PAID" && (booking.status === "PENDING" || booking.status === "CONFIRMED");

  return (
    <div className="container section" style={{ maxWidth: 860, margin: "0 auto" }}>
      <Link href="/bookings" className="muted" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        ← Back to bookings
      </Link>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2>{booking.listingTitle}</h2>
            <p className="muted">
              {isProvider || isAdmin ? `Customer: ${booking.customerName}` : `Local Pro: ${booking.localProName}`}
            </p>
          </div>
          <span className={`badge ${booking.status === "CANCELLED" ? "bg-danger" : booking.status === "COMPLETED" ? "bg-success" : booking.status === "CONFIRMED" ? "bg-primary" : "bg-warning text-dark"}`}>
            {STATUS_LABELS[booking.status] ?? booking.status}
          </span>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <p className="muted">Service: {formatMoney(booking.total_cents, booking.listingCurrency)}</p>
          <p className="muted">Tip: {formatMoney(booking.tip_cents, booking.listingCurrency)}</p>
          <p>Total: {formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}</p>
          <p className="muted">Payment: {booking.paymentStatus ?? "Not started"}</p>
          {booking.start_at ? <p className="muted">Starts: {new Date(booking.start_at).toLocaleString()}</p> : null}
          {booking.end_at ? <p className="muted">Ends: {new Date(booking.end_at).toLocaleString()}</p> : null}
          {booking.notes ? <p className="muted">Notes: {booking.notes}</p> : null}
        </div>

        {message ? (
          <p style={{ color: "#16a34a", marginTop: 16 }}>{message}</p>
        ) : null}
        {error ? (
          <p style={{ color: "#dc2626", marginTop: 16 }}>{error}</p>
        ) : null}

        {(showCancel || showConfirm || showComplete || showPay) && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            {showPay && (
              <button className="button primary" disabled={actionLoading} onClick={payNow}>
                {actionLoading ? "Processing..." : `Pay now · ${formatMoney(booking.total_cents + booking.tip_cents, booking.listingCurrency)}`}
              </button>
            )}
            {showConfirm && (
              <button className="button primary" disabled={actionLoading} onClick={() => updateStatus("CONFIRMED")}>
                Confirm booking
              </button>
            )}
            {showComplete && (
              <button className="button primary" disabled={actionLoading} onClick={() => updateStatus("COMPLETED")}>
                Mark completed
              </button>
            )}
            {showCancel && (
              <button
                className="button ghost"
                disabled={actionLoading}
                onClick={() => updateStatus("CANCELLED")}
                style={{ color: "#dc2626" }}
              >
                Cancel booking
              </button>
            )}
          </div>
        )}
      </div>

      {myReview && booking.status === "COMPLETED" && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>Your review</h3>
          <p>{"★".repeat(myReview.rating)}{"☆".repeat(5 - myReview.rating)}</p>
          {myReview.comment ? <p className="muted">{myReview.comment}</p> : null}
        </div>
      )}

      {showReviewForm && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>Leave a review</h3>
          <form onSubmit={submitReview} className="form-grid">
            <label className="field">
              <span>Rating</span>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{"★".repeat(r)}{"☆".repeat(5 - r)}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Comment (optional)</span>
              <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
            </label>
            <button className="button primary" type="submit" disabled={actionLoading}>
              {actionLoading ? "Submitting..." : "Submit review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
