export default function TermsPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Terms & Conditions</h1>
      <p className="text-muted mb-4">
        These terms outline the rules for using Local Services. By using the platform, you agree to these terms.
      </p>
      <div className="card">
        <div className="card-body">
          <h3 className="h6 fw-bold">Use of platform</h3>
          <p className="text-muted">Users must provide accurate information and comply with applicable laws.</p>
          <h3 className="h6 fw-bold mt-3">Bookings & payments</h3>
          <p className="text-muted">Bookings are subject to provider availability. Payment details are recorded with each booking.</p>
          <h3 className="h6 fw-bold mt-3">Content & reviews</h3>
          <p className="text-muted">Reviews should be honest and respectful. We may moderate abusive content.</p>
          <h3 className="h6 fw-bold mt-3">Account responsibility</h3>
          <p className="text-muted">You are responsible for maintaining the security of your account.</p>
        </div>
      </div>
    </div>
  );
}
