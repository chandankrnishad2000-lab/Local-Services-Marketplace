"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (user && !prefilled) {
      setForm((current) => ({
        ...current,
        name: current.name || user.name,
        email: current.email || user.email
      }));
      setPrefilled(true);
    }
  }, [user, prefilled]);

  const update = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setNotice({ type: "error", text: "Please fill in your name, email, subject, and message." });
      return;
    }

    setSending(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setForm(EMPTY_FORM);
        setNotice({ type: "success", text: "Thanks! Your message has been saved. Our team will get back to you soon." });
      } else {
        setNotice({ type: "error", text: data.error ?? "Could not send your message. Please try again." });
      }
    } catch {
      setNotice({ type: "error", text: "Could not reach the server. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row g-4">
          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="h3 fw-bold mb-4">Get in Touch</h1>
                <p className="text-muted mb-4">Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>

                {notice ? (
                  <div
                    className={`alert ${notice.type === "success" ? "alert-success" : "alert-danger"}`}
                    role="alert"
                  >
                    {notice.text}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={update("name")}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={update("email")}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="phone"
                      placeholder="+91 XXXXXXXXXX"
                      value={form.phone}
                      onChange={update("phone")}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="subject"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={update("subject")}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows={5}
                      placeholder="Your message..."
                      value={form.message}
                      onChange={update("message")}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={sending}>
                    {sending ? "Sending..." : "Send Message"}
                  </button>
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
