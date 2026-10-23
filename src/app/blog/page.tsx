const posts = [
  {
    title: "How to choose the right local professional",
    date: "May 2026",
    excerpt: "Quick tips for evaluating profiles, reviews, and pricing."
  },
  {
    title: "Making bookings stress-free",
    date: "April 2026",
    excerpt: "Plan your service timeline with clear communication."
  },
  {
    title: "Building trust in local marketplaces",
    date: "March 2026",
    excerpt: "Why verified reviews and transparent profiles matter."
  }
];

export default function BlogPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Blog</h1>
      <p className="text-muted mb-4">Insights and updates from Local Services.</p>
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.title} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <p className="text-muted mb-1">{post.date}</p>
                <h3 className="h6 fw-bold mb-2">{post.title}</h3>
                <p className="text-muted mb-0">{post.excerpt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
