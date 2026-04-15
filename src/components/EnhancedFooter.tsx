'use client';

import Link from 'next/link';

export default function EnhancedFooter() {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <h5 className="fw-bold mb-3">LocalPulse</h5>
            <p className="text-muted small">Your trusted marketplace for local services in India.</p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">For Customers</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/listings" className="text-decoration-none text-muted hover-text-light">Browse Services</Link>
              </li>
              <li className="mb-2">
                <Link href="/bookings" className="text-decoration-none text-muted hover-text-light">My Bookings</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-decoration-none text-muted hover-text-light">How It Works</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-decoration-none text-muted hover-text-light">Safety Tips</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">For Local Pros</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/local-pros/dashboard" className="text-decoration-none text-muted hover-text-light">Dashboard</Link>
              </li>
              <li className="mb-2">
                <Link href="/local-pros/listings/new" className="text-decoration-none text-muted hover-text-light">Create Listing</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-decoration-none text-muted hover-text-light">Earnings</Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="text-decoration-none text-muted hover-text-light">Become Local Pro</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">📧 support@localpulse.com</li>
              <li className="mb-2">📞 1-800-PULSE-123</li>
              <li className="mb-2">🕐 Mon-Sun, 9AM-9PM IST</li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />
        <div className="row">
          <div className="col-md-6 small text-muted">
            © 2026 LocalPulse. All rights reserved.
          </div>
          <div className="col-md-6 text-md-end small">
            <Link href="#" className="text-decoration-none text-muted me-3">Privacy Policy</Link>
            <Link href="#" className="text-decoration-none text-muted me-3">Terms of Service</Link>
            <Link href="#" className="text-decoration-none text-muted">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
