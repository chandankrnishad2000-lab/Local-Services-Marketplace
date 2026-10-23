const testimonials = [
  {
    name: "Aarav",
    quote: "Booked a cleaner in minutes. The experience was smooth and professional."
  },
  {
    name: "Meera",
    quote: "I found a trusted tutor through Local Services and the reviews were accurate."
  },
  {
    name: "Kabir",
    quote: "Great support and transparent pricing. Highly recommended!"
  }
];

export default function TestimonialsPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Testimonials</h1>
      <p className="text-muted mb-4">Hear from customers who use Local Services.</p>
      <div className="row g-4">
        {testimonials.map((item) => (
          <div key={item.name} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <p className="text-muted mb-3">“{item.quote}”</p>
                <p className="fw-semibold mb-0">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
