import Link from 'next/link';

export default function ContactPage() {
  return (
    <div>
      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="h3 fw-bold mb-4">Get in Touch</h1>
                <p className="text-muted mb-4">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                    <input type="text" className="form-control form-control-lg" id="name" placeholder="Your name" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                    <input type="email" className="form-control form-control-lg" id="email" placeholder="your.email@example.com" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                    <input type="tel" className="form-control form-control-lg" id="phone" placeholder="+91 XXXXXXXXXX" />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                    <input type="text" className="form-control form-control-lg" id="subject" placeholder="How can we help?" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">Message</label>
                    <textarea className="form-control" id="message" rows={5} placeholder="Your message..."></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100">Send Message</button>
                </form>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">📧 Email</h5>
                <p className="text-muted mb-2">For general inquiries:</p>
                <a href="mailto:chandankrnishad2000@gmail.com" className="text-decoration-none text-primary fw-semibold">
                  chandankrnishad2000@gmail.com
                </a>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">📞 Phone</h5>
                <p className="text-muted mb-2">Call us anytime:</p>
                <a href="tel:+916202770433" className="text-decoration-none text-primary fw-semibold">
                  +91 6202770433
                </a>
                <p className="text-muted small mt-2">Mon-Sun, 9AM-9PM IST</p>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">💡 Quick Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link href="/listings" className="text-decoration-none text-primary">Browse Services</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/login" className="text-decoration-none text-primary">Login</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/register" className="text-decoration-none text-primary">Sign Up</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/" className="text-decoration-none text-primary">Back to Home</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">Response Times</h3>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <h6 className="fw-semibold">Email Support</h6>
                    <p className="text-muted">Response within 24 hours</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="fw-semibold">Phone Support</h6>
                    <p className="text-muted">Available 9AM - 9PM IST</p>
                  </div>
                  <div>
                    <h6 className="fw-semibold">Emergency Issues</h6>
                    <p className="text-muted">Priority response for urgent matters</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">Why Contact Us?</h3>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <ul className="list-unstyled">
                    <li className="mb-3">
                      <strong>✓ Account Issues:</strong> Help with login, verification, or account settings
                    </li>
                    <li className="mb-3">
                      <strong>✓ Booking Problems:</strong> Issues with services, cancellations, or refunds
                    </li>
                    <li className="mb-3">
                      <strong>✓ Local Pro Support:</strong> Listing management and earnings questions
                    </li>
                    <li>
                      <strong>✓ Business Inquiries:</strong> Partnerships and collaboration opportunities
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="lead mb-4">Join thousands of customers and local pros on Local Services</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/register" className="btn btn-light btn-lg">
              Sign Up Now
            </Link>
            <Link href="/listings" className="btn btn-outline-light btn-lg">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
