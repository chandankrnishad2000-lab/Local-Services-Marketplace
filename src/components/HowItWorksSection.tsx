'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Search & Browse',
      description: 'Find services by category and location in your area'
    },
    {
      number: 2,
      title: 'Compare & Read Reviews',
      description: 'Check ratings, reviews, and pricing from multiple local pros'
    },
    {
      number: 3,
      title: 'Book Your Service',
      description: 'Choose your preferred time slot and confirm booking'
    },
    {
      number: 4,
      title: 'Get It Done',
      description: 'Professional arrives and completes the service'
    },
    {
      number: 5,
      title: 'Pay Securely',
      description: 'Complete payment through our secure platform'
    },
    {
      number: 6,
      title: 'Leave Feedback',
      description: 'Rate your experience and help others decide'
    }
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="h2 fw-bold mb-2">How It Works</h2>
          <p className="text-muted lead">Simple 6-step process to get your services done</p>
        </div>
        <div className="row g-4">
          {steps.map((step) => (
            <div key={step.number} className="col-md-6 col-lg-4">
              <div className="d-flex gap-3">
                <div className="flex-shrink-0">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold" style={{ width: '50px', height: '50px', fontSize: '24px' }}>
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-2">{step.title}</h5>
                  <p className="text-muted mb-0 small">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
