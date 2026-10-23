'use client';

import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Homeowner, Mumbai',
      text: 'Found a great plumber within minutes. Professional, punctual, and reasonably priced! The whole process was seamless.',
      rating: 5,
      service: 'Home Repair'
    },
    {
      name: 'Raj Kumar',
      role: 'Local Pro, Bangalore',
      text: 'This platform has helped me grow my cleaning business significantly. The booking system is incredibly efficient.',
      rating: 5,
      service: 'Cleaning'
    },
    {
      name: 'Anjali Patel',
      role: 'Customer, Pune',
      text: 'Great experience getting my AC serviced. The local pro was very professional and the price was completely transparent.',
      rating: 5,
      service: 'AC Service'
    }
  ];

  return (
    <section style={{
      padding: '100px 0',
      background: 'var(--color-bg-soft)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '56px',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              Testimonials
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--color-heading)',
              marginTop: '12px',
              lineHeight: 1.1
            }}>
              What Our<br/>Users Say
            </h2>
          </div>
          <p style={{
            color: 'var(--color-body)',
            maxWidth: '360px',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            Trusted by thousands of happy customers and verified professionals across India.
          </p>
        </div>

        {/* Layout: Image + Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Featured Pro Image */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '400px'
          }}>
            <Image
              src="/images/testimonial-pro.png"
              alt="A professional local service provider at work"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            {/* Info overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
            }}>
              <p style={{
                fontWeight: 700,
                color: '#fff',
                fontSize: '1rem',
                marginBottom: '4px'
              }}>
                Our Verified Professionals
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                margin: 0
              }}>
                Skilled, trusted, and ready to help
              </p>
            </div>
          </div>

          {/* Testimonials Cards */}
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: index === 0 ? 'var(--color-dark)' : '#fff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  border: index === 0 ? 'none' : '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => {
                  if (index !== 0) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== 0) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: index === 0 ? 'var(--color-primary)' : 'var(--color-primary-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: index === 0 ? '#fff' : 'var(--color-primary-dark)',
                  flexShrink: 0
                }}>
                  {testimonial.name.charAt(0)}{testimonial.name.split(' ')[1]?.charAt(0)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    gap: '12px'
                  }}>
                    <div>
                      <p style={{
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        color: index === 0 ? '#fff' : 'var(--color-heading)',
                        marginBottom: '2px'
                      }}>
                        {testimonial.name}
                      </p>
                      <p style={{
                        fontSize: '0.78rem',
                        color: index === 0 ? 'rgba(255,255,255,0.45)' : 'var(--color-muted)',
                        margin: 0
                      }}>
                        {testimonial.role}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                          <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.02l-3.52 1.83.67-3.93L1.3 5.14l3.94-.57L7 1z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: index === 0 ? 'rgba(255,255,255,0.75)' : 'var(--color-body)',
                    margin: 0
                  }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </div>

                {/* Service Badge */}
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  background: index === 0 ? 'rgba(255,255,255,0.1)' : 'var(--color-primary-bg)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: index === 0 ? 'rgba(255,255,255,0.5)' : 'var(--color-primary-dark)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}>
                  {testimonial.service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
