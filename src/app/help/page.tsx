export default function HelpPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Help Center</h1>
      <p className="text-muted mb-4">Find support resources and quick guides.</p>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Getting started</h3>
              <p className="text-muted">Create an account, browse listings, and submit a booking request.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Managing bookings</h3>
              <p className="text-muted">Track status, reschedule, and review completed services.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Payments</h3>
              <p className="text-muted">Checkout is secure, and receipts appear in your booking history.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h6 fw-bold">Need help?</h3>
              <p className="text-muted">Visit Support for direct assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
