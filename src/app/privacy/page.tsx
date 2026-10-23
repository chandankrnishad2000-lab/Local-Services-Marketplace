export default function PrivacyPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Privacy Policy</h1>
      <p className="text-muted mb-4">
        We respect your privacy. This page explains what data we collect and how we use it.
      </p>
      <div className="card">
        <div className="card-body">
          <h3 className="h6 fw-bold">Data we collect</h3>
          <p className="text-muted">Basic account details, booking information, and service reviews.</p>
          <h3 className="h6 fw-bold mt-3">How we use data</h3>
          <p className="text-muted">To provide bookings, communications, and improve the platform experience.</p>
          <h3 className="h6 fw-bold mt-3">Your choices</h3>
          <p className="text-muted">You can update your profile or request account removal at any time.</p>
        </div>
      </div>
    </div>
  );
}
