const plans = [
  {
    name: "Customer",
    price: "Free",
    features: ["Browse listings", "Book services", "Leave reviews"]
  },
  {
    name: "Local Pro",
    price: "₹499 / month",
    features: ["Create listings", "Receive bookings", "Profile visibility boost"]
  },
  {
    name: "Business",
    price: "₹999 / month",
    features: ["Team access", "Priority support", "Advanced analytics"]
  }
];

export default function PricingPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Pricing</h1>
      <p className="text-muted mb-4">Simple plans for customers and service providers.</p>
      <div className="row g-4">
        {plans.map((plan) => (
          <div key={plan.name} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="h5 fw-bold mb-2">{plan.name}</h3>
                <p className="text-muted mb-3">{plan.price}</p>
                <ul className="mb-0">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
