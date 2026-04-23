import { apiFetchServer } from "@/lib/api-server";

export default async function AdminPage() {
  const res = await apiFetchServer("/api/reports");
  const data = res.ok ? await res.json() : { reports: [] };
  const reports = data.reports ?? [];

  return (
    <div className="container section">
      <div className="card">
        <h2>Admin moderation</h2>
        <p className="muted">Review flagged listings and resolve disputes.</p>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {reports.map((report) => (
            <div key={report.id} className="card" style={{ background: "#f9fbfd" }}>
              <h3>{report.listingTitle}</h3>
              <p className="muted">Reason: {report.reason}</p>
              <p className="muted">Status: {report.status}</p>
            </div>
          ))}
          {reports.length === 0 ? <p className="muted">No open reports.</p> : null}
        </div>
      </div>
    </div>
  );
}
