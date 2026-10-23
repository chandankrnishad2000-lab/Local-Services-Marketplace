"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Stats = {
  totalUsers: number;
  totalPros: number;
  totalListings: number;
  pendingListings: number;
  activeListings: number;
  openReports: number;
  totalBookings: number;
};

type AdminListing = {
  id: string;
  title: string;
  category: string;
  location: string;
  price_cents: number;
  currency: string;
  status: string;
  created_at: string;
  localProName: string;
  localProEmail: string;
  reviewCount: number;
};

type Report = {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterName: string;
  reason: string;
  status: string;
  created_at: string;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  listingCount: number;
};

type StatusFilter = "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED" | "ALL";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending review",
  ACTIVE: "Active",
  INACTIVE: "Paused",
  REJECTED: "Rejected",
  ALL: "All"
};

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Customer",
  LOCAL_PRO: "Local Pro",
  ADMIN: "Admin"
};

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingListings, setPendingListings] = useState<AdminListing[]>([]);
  const [activeListings, setActiveListings] = useState<AdminListing[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<StatusFilter>("PENDING");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    const [statsRes, pendingRes, activeRes, reportsRes, usersRes] = await Promise.all([
      apiFetch("/api/admin/stats"),
      apiFetch("/api/listings/admin?status=PENDING"),
      apiFetch("/api/listings/admin?status=ACTIVE"),
      apiFetch("/api/reports"),
      apiFetch("/api/admin/users")
    ]);
    setStats(statsRes.ok ? (await statsRes.json()).stats : null);
    setPendingListings(pendingRes.ok ? (await pendingRes.json()).listings ?? [] : []);
    setActiveListings(activeRes.ok ? (await activeRes.json()).listings ?? [] : []);
    setReports(reportsRes.ok ? (await reportsRes.json()).reports ?? [] : []);
    setUsers(usersRes.ok ? (await usersRes.json()).users ?? [] : []);
  }, []);

  useEffect(() => {
    let active = true;
    if (!user || user.role !== "ADMIN") {
      if (active) setLoading(false);
      return;
    }
    loadAll()
      .then(() => { if (active) setLoading(false); })
      .catch(() => { if (active) { setError("Failed to load admin data."); setLoading(false); } });
    return () => { active = false; };
  }, [user, loadAll]);

  const setListingStatus = async (id: string, status: string) => {
    setBusy(`${id}:${status}`);
    setNotice(null);
    const res = await apiFetch(`/api/listings/admin/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    setBusy(null);
    if (res.ok) {
      setNotice(`Listing ${status === "ACTIVE" ? "approved" : status === "INACTIVE" ? "paused" : "rejected"}.`);
      await loadAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setNotice(`Action failed: ${data.error ?? "Server error."}`);
    }
  };

  const setReportStatus = async (id: string, action: string) => {
    setBusy(`report:${id}`);
    setNotice(null);
    const res = await apiFetch(`/api/reports/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    setBusy(null);
    if (res.ok) {
      setNotice(`Report ${action.toLowerCase()}.`);
      await loadAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setNotice(`Action failed: ${data.error ?? "Server error."}`);
    }
  };

  const setUserRole = async (id: string, role: string) => {
    setBusy(`user:${id}`);
    setNotice(null);
    const res = await apiFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ role })
    });
    setBusy(null);
    if (res.ok) {
      setNotice("User role updated.");
      await loadAll();
    } else {
      const data = await res.json().catch(() => ({}));
      setNotice(`Action failed: ${data.error ?? "Server error."}`);
    }
  };

  const allListings: AdminListing[] = tab === "PENDING" ? pendingListings : activeListings;

  if (authLoading || (user && user.role === "ADMIN" && loading)) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <p className="muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2>Admin access required</h2>
          <p className="muted">Log in with an admin account to manage the marketplace.</p>
          <a className="button primary" href="/login" style={{ marginTop: 12, display: "inline-flex" }}>
            Admin Login
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <p className="muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <h2 style={{ marginBottom: 4 }}>Admin moderation</h2>
      <p className="muted" style={{ marginBottom: 24 }}>Approve listings, resolve reports, and manage users.</p>

      {notice ? (
        <div style={{
          padding: "12px 16px",
          borderRadius: "var(--radius-sm)",
          background: "#ECFDF5",
          border: "1px solid #A7F3D0",
          color: "#065F46",
          marginBottom: 20,
          fontSize: "0.9rem"
        }}>
          {notice}
        </div>
      ) : null}

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 14,
        marginBottom: 28
      }}>
        {[
          { label: "Pending listings", value: stats?.pendingListings ?? 0, accent: "#F59E0B" },
          { label: "Active listings", value: stats?.activeListings ?? 0, accent: "#10B981" },
          { label: "Open reports", value: stats?.openReports ?? 0, accent: "#EF4444" },
          { label: "Total bookings", value: stats?.totalBookings ?? 0, accent: "#3B82F6" },
          { label: "Local Pros", value: stats?.totalPros ?? 0, accent: "#8B5CF6" },
          { label: "Total users", value: stats?.totalUsers ?? 0, accent: "#6B7280" }
        ].map((item) => (
          <div key={item.label} style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "18px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: item.accent }}>{item.value}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 600 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginBottom: 20
      }}>
        {(["PENDING", "ACTIVE", "ALL"] as StatusFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "9px 18px",
              borderRadius: "999px",
              border: tab === t ? "none" : "1.5px solid var(--color-border)",
              background: tab === t ? "var(--color-primary)" : "#fff",
              color: tab === t ? "#fff" : "var(--color-body)",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            {STATUS_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Listings */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 4 }}>{STATUS_LABELS[tab]} listings</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          {tab === "PENDING" ? "New listings from Local Pros await approval before going live." : tab === "ACTIVE" ? "Live listings on the public marketplace." : "Every listing across all statuses."}
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {allListings.map((listing) => (
            <div key={listing.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              padding: "16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#f9fbfd"
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: "var(--color-heading)" }}>{listing.title}</div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {listing.category} · {listing.location} · ₹{(listing.price_cents / 100).toLocaleString()}
                </div>
                <div className="muted" style={{ fontSize: "0.8rem" }}>
                  {listing.localProName} ({listing.localProEmail}) · {listing.reviewCount} review(s) · {new Date(listing.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: listing.status === "ACTIVE" ? "#D1FAE5" : listing.status === "PENDING" ? "#FEF3C7" : "#FEE2E2",
                  color: listing.status === "ACTIVE" ? "#065F46" : listing.status === "PENDING" ? "#92400E" : "#991B1B"
                }}>
                  {listing.status}
                </span>
                {listing.status === "PENDING" ? (
                  <>
                    <button className="button primary" disabled={busy !== null} onClick={() => setListingStatus(listing.id, "ACTIVE")}
                      style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                      Approve
                    </button>
                    <button className="button ghost" disabled={busy !== null} onClick={() => setListingStatus(listing.id, "REJECTED")}
                      style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                      Reject
                    </button>
                  </>
                ) : listing.status === "ACTIVE" ? (
                  <button className="button ghost" disabled={busy !== null} onClick={() => setListingStatus(listing.id, "INACTIVE")}
                    style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                    Pause
                  </button>
                ) : listing.status === "INACTIVE" ? (
                  <button className="button primary" disabled={busy !== null} onClick={() => setListingStatus(listing.id, "ACTIVE")}
                    style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                    Reactivate
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {allListings.length === 0 ? (
            <p className="muted">{tab === "PENDING" ? "No listings awaiting review." : "No listings."}</p>
          ) : null}
        </div>
      </div>

      {/* Reports */}
      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Reports ({reports.length})</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {reports.map((report) => (
            <div key={report.id} style={{
              padding: "16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#f9fbfd"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, color: "var(--color-heading)" }}>{report.listingTitle}</div>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: report.status === "OPEN" ? "#FEF3C7" : "#E5E7EB",
                  color: report.status === "OPEN" ? "#92400E" : "#374151"
                }}>
                  {report.status}
                </span>
              </div>
              <p className="muted" style={{ fontSize: "0.9rem", margin: "8px 0" }}>
                <strong>{report.reporterName}</strong>: {report.reason}
              </p>
              {report.status === "OPEN" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="button primary" disabled={busy !== null} onClick={() => setReportStatus(report.id, "RESOLVED")}
                    style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                    Resolve
                  </button>
                  <button className="button ghost" disabled={busy !== null} onClick={() => setReportStatus(report.id, "DISMISSED")}
                    style={{ padding: "7px 14px", fontSize: "0.8rem" }}>
                    Dismiss
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {reports.length === 0 ? <p className="muted">No reports.</p> : null}
        </div>
      </div>

      {/* Users */}
      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Users ({users.length})</h3>
        <div style={{ display: "grid", gap: 12 }}>
          {users.map((u) => (
            <div key={u.id} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              padding: "14px 16px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              background: "#f9fbfd"
            }}>
              <div>
                <div style={{ fontWeight: 600, color: "var(--color-heading)" }}>{u.name}</div>
                <div className="muted" style={{ fontSize: "0.85rem" }}>
                  {u.email} · {u.listingCount} listing(s) · joined {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "#EFF6FF",
                  color: "#1D4ED8"
                }}>
                  {ROLE_LABELS[u.role] ?? u.role}
                </span>
                {u.role === "CUSTOMER" ? (
                  <button className="button ghost" disabled={busy !== null} onClick={() => setUserRole(u.id, "LOCAL_PRO")}
                    style={{ padding: "6px 12px", fontSize: "0.78rem" }}>
                    Make Local Pro
                  </button>
                ) : u.role === "LOCAL_PRO" ? (
                  <button className="button ghost" disabled={busy !== null} onClick={() => setUserRole(u.id, "CUSTOMER")}
                    style={{ padding: "6px 12px", fontSize: "0.78rem" }}>
                    Make Customer
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {users.length === 0 ? <p className="muted">No users.</p> : null}
        </div>
      </div>
    </div>
  );
}
