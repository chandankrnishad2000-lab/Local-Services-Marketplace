'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CTASection() {
  return (
    <section style={{
      padding: '0',
      background: 'var(--color-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          alignItems: 'center',
          minHeight: '480px'
        }}>
          {/* Left: Content */}
          <div style={{ padding: '60px 40px 60px 0' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '20px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#fff'
              }}/>
              Get Started Today
            </span>

            <h2 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: '20px'
            }}>
              Ready to Get<br/>Your Service Done?
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '420px'
            }}>
              Join thousands of satisfied customers finding trusted local services across India. Your comfort is just one booking away.
            </p>

            <div style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <Link href="/listings" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: 'var(--radius-pill)',
                background: '#fff',
                color: 'var(--color-heading)',
                fontWeight: 700,
                fontSize: '0.95rem',
                transition: 'var(--transition)',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                Browse Services
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/register" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1.5px solid rgba(255,255,255,0.3)',
                transition: 'var(--transition)',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)'
              }}>
                Sign Up Now
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div style={{
            position: 'relative',
            height: '100%',
            minHeight: '480px',
            borderRadius: '0 0 0 var(--radius-xl)',
            overflow: 'hidden'
          }}>
            <Image
              src="/images/cta-family.png"
              alt="Happy family enjoying comfort in their home"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            {/* Gradient overlay for blend */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--color-primary) 0%, transparent 40%)',
              pointerEvents: 'none'
            }}/>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          section > div > div {
            grid-template-columns: 1fr !important;
          }
          section > div > div > div:last-child {
            min-height: 300px !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
