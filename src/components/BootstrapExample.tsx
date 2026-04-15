'use client';

import { useMemo, useState } from "react";

type InterfaceType = "CUSTOMER" | "LOCAL_PRO" | "ADMIN";

const interfaceConfig: Record<
  InterfaceType,
  {
    title: string;
    subtitle: string;
    metrics: Array<{ label: string; value: string }>;
    features: Array<{ title: string; description: string; status: "New" | "Live" | "Beta" }>;
  }
> = {
  CUSTOMER: {
    title: "Customer Interface",
    subtitle: "Book trusted local services quickly.",
    metrics: [
      { label: "Bookings", value: "24" },
      { label: "Saved Local Pros", value: "8" },
      { label: "Avg. Rating", value: "4.8" }
    ],
    features: [
      { title: "Smart Search", description: "Find local pros by category and location.", status: "Live" },
      { title: "Instant Booking", description: "Schedule services with one-click slots.", status: "Live" },
      { title: "Offer Alerts", description: "Get notified on seasonal discounts.", status: "New" }
    ]
  },
  LOCAL_PRO: {
    title: "Local Pro Interface",
    subtitle: "Manage services, bookings, and earnings.",
    metrics: [
      { label: "Active Listings", value: "12" },
      { label: "Pending Jobs", value: "5" },
      { label: "Monthly Revenue", value: "₹92,400" }
    ],
    features: [
      { title: "Service Dashboard", description: "Track listing performance in real time.", status: "Live" },
      { title: "Calendar Sync", description: "Keep availability aligned automatically.", status: "Beta" },
      { title: "Payout Summary", description: "See earnings and fee split clearly.", status: "Live" }
    ]
  },
  ADMIN: {
    title: "Admin Interface",
    subtitle: "Monitor platform quality and activity.",
    metrics: [
      { label: "Total Users", value: "3,240" },
      { label: "Open Reports", value: "14" },
      { label: "Verified Local Pros", value: "1,105" }
    ],
    features: [
      { title: "Moderation Queue", description: "Review listings and reports faster.", status: "Live" },
      { title: "Fraud Signals", description: "Flag unusual payment behavior.", status: "New" },
      { title: "Role Controls", description: "Manage user permissions safely.", status: "Live" }
    ]
  }
};

export default function BootstrapExample() {
  const [activeInterface, setActiveInterface] = useState<InterfaceType>("CUSTOMER");
  const [showOnlyLive, setShowOnlyLive] = useState(false);

  const current = interfaceConfig[activeInterface];
  const visibleFeatures = useMemo(() => {
    if (!showOnlyLive) {
      return current.features;
    }
    return current.features.filter((feature) => feature.status === "Live");
  }, [current.features, showOnlyLive]);

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h4 mb-1">Multi-Interface Experience</h2>
              <p className="text-muted mb-3">Switch between interfaces and preview dedicated feature sets.</p>

              <div className="btn-group" role="group" aria-label="Interface selector">
                {(["CUSTOMER", "LOCAL_PRO", "ADMIN"] as InterfaceType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`btn ${activeInterface === type ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setActiveInterface(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h5 mb-1">{current.title}</h3>
              <p className="text-muted mb-4">{current.subtitle}</p>

              <div className="row g-3 mb-4">
                {current.metrics.map((metric) => (
                  <div className="col-12 col-sm-4" key={metric.label}>
                    <div className="p-3 rounded border bg-light h-100">
                      <p className="small text-muted mb-1">{metric.label}</p>
                      <p className="h5 mb-0">{metric.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="show-live"
                  checked={showOnlyLive}
                  onChange={(event) => setShowOnlyLive(event.target.checked)}
                />
                <label className="form-check-label" htmlFor="show-live">
                  Show only live features
                </label>
              </div>

              <div className="list-group">
                {visibleFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="list-group-item d-flex justify-content-between align-items-start gap-3"
                  >
                    <div>
                      <p className="fw-semibold mb-1">{feature.title}</p>
                      <p className="text-muted mb-0 small">{feature.description}</p>
                    </div>
                    <span className={`badge ${feature.status === "Live" ? "bg-success" : feature.status === "Beta" ? "bg-warning text-dark" : "bg-info text-dark"}`}>
                      {feature.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h3 className="h6">Quick Actions</h3>
              <div className="d-grid gap-2 mt-3">
                <button type="button" className="btn btn-primary">Open Dashboard</button>
                <button type="button" className="btn btn-outline-secondary">View Analytics</button>
                <button type="button" className="btn btn-outline-dark">Manage Settings</button>
              </div>

              <hr className="my-4" />
              <div className="alert alert-success mb-0" role="alert">
                Active interface: <strong>{activeInterface}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separate Admin Section */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="card border-danger border-3 shadow-lg h-100" style={{ borderRadius: "0.5rem" }}>
            <div className="card-header bg-danger text-white">
              <h2 className="h5 mb-0">🛡️ Admin Control Panel</h2>
            </div>
            <div className="card-body">
              <p className="text-muted mb-4">Comprehensive platform administration and monitoring tools.</p>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded border border-danger bg-light h-100">
                    <p className="small text-muted mb-1">Total Users</p>
                    <p className="h5 mb-0 text-danger fw-bold">3,240</p>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded border border-warning bg-light h-100">
                    <p className="small text-muted mb-1">Open Reports</p>
                    <p className="h5 mb-0 text-warning fw-bold">14</p>
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="p-3 rounded border border-info bg-light h-100">
                    <p className="small text-muted mb-1">Verified Local Pros</p>
                    <p className="h5 mb-0 text-info fw-bold">1,105</p>
                  </div>
                </div>
              </div>

              <h5 className="h6 mb-3">Admin Features</h5>
              <div className="list-group">
                <div className="list-group-item d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <p className="fw-semibold mb-1">📋 Moderation Queue</p>
                    <p className="text-muted mb-0 small">Review listings and reports faster.</p>
                  </div>
                  <span className="badge bg-success">Live</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <p className="fw-semibold mb-1">🚨 Fraud Signals</p>
                    <p className="text-muted mb-0 small">Flag unusual payment behavior.</p>
                  </div>
                  <span className="badge bg-info text-dark">New</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <p className="fw-semibold mb-1">👥 Role Controls</p>
                    <p className="text-muted mb-0 small">Manage user permissions safely.</p>
                  </div>
                  <span className="badge bg-success">Live</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <p className="fw-semibold mb-1">📊 Analytics Dashboard</p>
                    <p className="text-muted mb-0 small">View platform metrics and trends.</p>
                  </div>
                  <span className="badge bg-warning text-dark">Beta</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <h5 className="h6 mb-3">Admin Actions</h5>
                <div className="d-grid gap-2 d-md-flex">
                  <button type="button" className="btn btn-danger flex-fill">🔒 Ban User</button>
                  <button type="button" className="btn btn-warning text-dark flex-fill">⚠️ Flag Content</button>
                  <button type="button" className="btn btn-info text-white flex-fill">✅ Verify Local Pro</button>
                </div>
              </div>

              <div className="alert alert-warning mt-4 mb-0" role="alert">
                <strong>⚠️ Security Notice:</strong> All admin actions are logged and audited for compliance.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
