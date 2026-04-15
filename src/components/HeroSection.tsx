'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-white mb-4">Find Local Services You Can Trust</h1>
            <p className="lead text-white-75 mb-4">
              Connect with verified professionals for home repairs, cleaning, tutoring, and more. Book with confidence, pay securely.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link href="/listings" className="btn btn-light btn-lg">
                Browse Services
              </Link>
              <Link href="/register" className="btn btn-outline-light btn-lg">
                Become a Local Pro
              </Link>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="display-1 mb-3">🔍</div>
                <p className="text-muted mb-0">Trusted by 3,000+ users across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
