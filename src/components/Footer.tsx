import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      padding: '40px 0',
      borderTop: '1px solid var(--color-border)',
      background: 'var(--color-bg)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/localpulse-logo.png" alt="Local Services" width={24} height={24} style={{ borderRadius: '4px' }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--color-heading)',
              letterSpacing: '-0.04em'
            }}>
              Local Services
            </span>
        </div>
        <div style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { href: "/about", label: "About" },
            { href: "/pricing", label: "Pricing" },
            { href: "/testimonials", label: "Testimonials" },
            { href: "/blog", label: "Blog" },
            { href: "/faq", label: "FAQ" },
            { href: "/help", label: "Help" },
            { href: "/support", label: "Support" },
            { href: "/careers", label: "Careers" },
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--color-muted)',
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
