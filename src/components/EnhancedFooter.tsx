'use client';

import Link from 'next/link';

export default function EnhancedFooter() {
  const footerLinks = {
    'For Customers': [
      { label: 'Browse Services', href: '/listings' },
      { label: 'My Bookings', href: '/bookings' },
      { label: 'How It Works', href: '#' },
      { label: 'Safety Tips', href: '#' }
    ],
    'For Local Pros': [
      { label: 'Dashboard', href: '/providers/dashboard' },
      { label: 'Create Listing', href: '/providers/listings/new' },
      { label: 'Earnings', href: '#' },
      { label: 'Become Local Pro', href: '#' }
    ],
    'Company': [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' }
    ]
  };

  return (
    <footer style={{
      padding: '80px 0 40px',
      background: 'var(--color-dark)',
      color: '#fff'
    }}>
      <div className="container">
        {/* Top Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <img src="/images/localpulse-logo.png" alt="Local Services" width={28} height={28} style={{ borderRadius: '6px' }} />
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                letterSpacing: '-0.04em'
              }}>
                Local Services
              </span>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: '280px',
              marginBottom: '24px'
            }}>
              Your trusted marketplace for local services in India. Connecting customers with verified professionals.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {['twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    fontSize: '0.8rem'
                  }}
                >
                  {social === 'twitter' && '𝕏'}
                  {social === 'instagram' && '📷'}
                  {social === 'linkedin' && 'in'}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '20px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: '12px' }}>
                    <Link
                      href={link.href}
                      style={{
                        color: 'rgba(255,255,255,0.45)',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Row */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          padding: '24px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '24px'
        }}>
          <a href="mailto:chandankrnishad2000@gmail.com" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.88rem',
            textDecoration: 'none'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4l6 4 6-4M2 4v8h12V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            chandankrnishad2000@gmail.com
          </a>
          <a href="tel:+916202770433" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.88rem',
            textDecoration: 'none'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.5 11.6v1.5a1 1 0 01-1.1 1A9.9 9.9 0 012 3.6a1 1 0 011-1.1h1.5a1 1 0 011 .7l.4 1.5a1 1 0 01-.2 1l-.7.7a8 8 0 004.4 4.4l.7-.7a1 1 0 011-.2l1.5.4a1 1 0 01.7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +91 6202770433
          </a>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.88rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Mon-Sun, 9AM-9PM IST
          </span>
        </div>

        {/* Bottom Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.82rem',
            margin: 0
          }}>
            © 2026 Local Services. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px'
          }}>
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link href="/contact" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', textDecoration: 'none' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 576px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
