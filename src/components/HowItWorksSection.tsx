'use client';

import Image from 'next/image';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Search & Browse',
      description: 'Find services by category and location. Compare verified providers side by side.'
    },
    {
      number: '02',
      title: 'Compare & Reviews',
      description: 'Check ratings, reviews, and transparent pricing from multiple local pros.'
    },
    {
      number: '03',
      title: 'Book Your Service',
      description: 'Choose your preferred time slot and confirm your booking in seconds.'
    },
    {
      number: '04',
      title: 'Get It Done',
      description: 'A professional arrives at your location and completes the service.'
    },
    {
      number: '05',
      title: 'Pay Securely',
      description: 'Complete payment through our secure, encrypted payment platform.'
    }
  ];

  return (
    <section style={{
      padding: '100px 0',
      background: 'var(--color-dark)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 30%, rgba(126,179,227,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(126,179,227,0.04) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}/>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Row with Image */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '64px'
        }}>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '16px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-primary)'
              }}/>
              How It Works
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.04em',
              lineHeight: 1.1
            }}>
              Getting your service<br/>done is easier than<br/>you think
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              marginTop: '16px',
              maxWidth: '400px',
              lineHeight: 1.6,
              fontSize: '0.95rem'
            }}>
              Just five simple steps and comfort returns.
            </p>
          </div>

          {/* Tools Image */}
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            position: 'relative',
            height: '280px'
          }}>
            <Image
              src="/images/services-tools.png"
              alt="Professional service tools arranged neatly"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 'var(--radius-lg)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(13,13,13,0.3) 0%, transparent 60%)',
              borderRadius: 'var(--radius-lg)',
              pointerEvents: 'none'
            }}/>
          </div>
        </div>

        {/* Steps */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}>
          {steps.map((step, idx) => (
            <div
              key={step.number}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '24px',
                alignItems: 'center',
                padding: '28px 0',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.paddingLeft = '16px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.paddingLeft = '0';
              }}
            >
              <span style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-sans)'
              }}>
                {step.number}
              </span>
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '4px'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                  fontSize: '0.88rem',
                  lineHeight: 1.5
                }}>
                  {step.description}
                </p>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M8 4l4 4-4 4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
          .container > div:first-child > div:last-child {
            height: 200px !important;
          }
        }
      `}</style>
    </section>
  );
}
