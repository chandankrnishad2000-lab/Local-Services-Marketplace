export default function AboutPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">About Local Services</h1>
      <p className="text-muted lead mb-4">
        Local Services connects customers with trusted local professionals for everyday services.
        Our mission is to make booking, paying, and reviewing services simple and transparent.
      </p>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-2">What we do</h3>
              <ul className="mb-0">
                <li>Verified local professionals across multiple categories.</li>
                <li>Clear pricing and easy booking flows.</li>
                <li>Secure payments and real customer reviews.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-2">Why it matters</h3>
              <p className="text-muted mb-0">
                We help customers find reliable services quickly while enabling local pros to grow their businesses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
