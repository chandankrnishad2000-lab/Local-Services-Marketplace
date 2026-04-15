'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: '✓',
      title: 'Verified Professionals',
      description: 'All local pros are vetted and rated by real users'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Pay safely with encrypted transactions'
    },
    {
      icon: '⭐',
      title: 'Real Reviews',
      description: 'See honest feedback from other customers'
    },
    {
      icon: '🕐',
      title: 'Easy Scheduling',
      description: 'Book services at times that work for you'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Manage bookings on the go'
    },
    {
      icon: '🛡️',
      title: 'Buyer Protection',
      description: 'We guarantee satisfaction or your money back'
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="h2 fw-bold mb-2">Why Choose LocalPulse?</h2>
          <p className="text-muted lead">Everything you need for hassle-free local services</p>
        </div>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center">
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h5 className="card-title fw-bold mb-2">{feature.title}</h5>
                  <p className="card-text text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
