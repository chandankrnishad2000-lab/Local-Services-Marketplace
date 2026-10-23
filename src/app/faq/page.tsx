const faqs = [
  {
    q: "How do I book a service?",
    a: "Browse listings, open a service, choose your time, and submit a booking request."
  },
  {
    q: "How are providers verified?",
    a: "Providers submit their profiles and are reviewed. Ongoing ratings keep quality high."
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes. You can update bookings from your dashboard based on provider availability."
  },
  {
    q: "Is payment secure?",
    a: "Payments are handled securely and confirmations are stored with your booking."
  },
  {
    q: "How do reviews work?",
    a: "Only customers with completed bookings can leave reviews."
  }
];

export default function FaqPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Frequently Asked Questions</h1>
      <p className="text-muted mb-4">Quick answers to common questions.</p>
      <div className="card">
        <div className="card-body">
          {faqs.map((item) => (
            <div key={item.q} className="mb-4">
              <h3 className="h6 fw-bold mb-1">{item.q}</h3>
              <p className="text-muted mb-0">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
