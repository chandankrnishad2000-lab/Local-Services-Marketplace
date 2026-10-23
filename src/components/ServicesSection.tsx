"use client";

import Link from "next/link";

export default function ServicesSection() {
  const services = [
    { icon: "🏠", name: "Home Care", description: "Cleaning, repairs & maintenance", count: "450+" },
    { icon: "💪", name: "Wellness", description: "Fitness, yoga & health", count: "320+" },
    { icon: "📚", name: "Education", description: "Tutoring & coaching classes", count: "280+" },
    { icon: "🎉", name: "Events", description: "Planning & photography services", count: "190+" },
    { icon: "🚗", name: "Auto", description: "Detailing & maintenance", count: "240+" },
    { icon: "💻", name: "Tech", description: "Web design & development", count: "180+" },
    { icon: "💇", name: "Beauty", description: "Hair, makeup & wellness", count: "350+" },
    { icon: "🍳", name: "Food & Catering", description: "Cooking & event catering", count: "160+" }
  ];

  return (
    <section style={{
      padding: '80px 0',
      background: 'var(--color-bg)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              Our Services
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--color-heading)',
              marginTop: '12px',
              lineHeight: 1.1
            }}>
              Everything Your<br/>Home Could Ever Need
            </h2>
            <p style={{
              color: 'var(--color-body)',
              fontSize: '1rem',
              marginTop: '16px',
              maxWidth: '460px',
              lineHeight: 1.6
            }}>
              From sudden breakdowns to seasonal checkups — we handle it all.
              Explore our expert services designed to get your comfort back.
            </p>
          </div>
          <Link href="/services" className="button primary" style={{
            padding: '14px 28px'
          }}>
            View all services →
          </Link>
        </div>

        {/* Services Grid - Bento Style */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {services.map((service, idx) => (
            <Link
              key={idx}
              href={`/listings?category=${encodeURIComponent(service.name)}`}
              style={{
                background: idx === 0 ? 'var(--color-primary)' : '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '28px',
                border: idx === 0 ? 'none' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '200px',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (idx !== 0) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (idx !== 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div>
                <span style={{
                  fontSize: '2.2rem',
                  display: 'block',
                  marginBottom: '16px'
                }}>
                  {service.icon}
                </span>
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: idx === 0 ? '#fff' : 'var(--color-heading)',
                  marginBottom: '6px'
                }}>
                  {service.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: idx === 0 ? 'rgba(255,255,255,0.7)' : 'var(--color-muted)',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {service.description}
                </p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px'
              }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: idx === 0 ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  {service.count} pros
                </span>
                <span style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: idx === 0 ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke={idx === 0 ? '#fff' : 'var(--color-heading)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom Request Banner */}
        <div style={{
          marginTop: '32px',
          background: 'var(--color-dark)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px'
            }}>
              Don&apos;t see your service?
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              margin: 0,
              fontSize: '0.95rem'
            }}>
              Post a custom request and get quotes from local pros instantly
            </p>
          </div>
          <Link href="/listings" className="button" style={{
            background: '#fff',
            color: 'var(--color-heading)',
            padding: '14px 28px',
            fontWeight: 700
          }}>
            Post a Custom Request
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .container > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
