const roles = [
  "Customer Success Associate",
  "Community Manager",
  "Full-Stack Developer",
  "Local Pro Partnerships"
];

export default function CareersPage() {
  return (
    <div className="container section">
      <h1 className="h2 fw-bold mb-3">Careers</h1>
      <p className="text-muted mb-4">Join us in building the future of local services.</p>
      <div className="card">
        <div className="card-body">
          <h3 className="h6 fw-bold mb-2">Open roles</h3>
          <ul className="mb-0">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <p className="text-muted mt-3 mb-0">Email your resume to careers@localservices.example</p>
        </div>
      </div>
    </div>
  );
}
