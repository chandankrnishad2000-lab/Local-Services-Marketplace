'use client';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Homeowner',
      text: 'Found a great plumber within minutes. Professional, punctual, and reasonably priced!',
      rating: 5
    },
    {
      name: 'Raj Kumar',
      role: 'Local Pro',
      text: 'This platform has helped me grow my cleaning business. The booking system is seamless.',
      rating: 5
    },
    {
      name: 'Anjali Patel',
      role: 'Customer',
      text: 'Great experience getting my AC serviced. The local pro was very professional and the price was transparent.',
      rating: 5
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="h2 fw-bold mb-2">What Our Users Say</h2>
          <p className="text-muted lead">Trusted by thousands of happy customers</p>
        </div>
        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-warning">★</span>
                      ))}
                  </div>
                  <p className="card-text mb-4">"{testimonial.text}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="fw-bold mb-0">{testimonial.name}</p>
                      <p className="text-muted mb-0 small">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
