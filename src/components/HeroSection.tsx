"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section style={{
      padding: '80px 0 60px',
      background: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column */}
          <div className="col-lg-6">
            <span className="eyebrow" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              Our Advantages
            </span>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: 'var(--color-heading)',
              marginTop: '20px',
              marginBottom: '24px'
            }}>
              Team For Cool,{' '}
              <span style={{ position: 'relative' }}>
                Services
                <svg style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%', height: '8px' }} viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C40 2 80 1.5 100 3s60 3 99-1" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            <p style={{
              color: 'var(--color-body)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              maxWidth: '440px',
              marginBottom: '28px'
            }}>
              Compare verified providers, see real reviews, and book services with transparent pricing — all in one place.
            </p>

            {/* Avatar Stack */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex' }}>
                {['#7EB3E3', '#F59E0B', '#EF4444', '#10B981'].map((color, i) => (
                  <div key={i} style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: color,
                    border: '3px solid #fff',
                    marginLeft: i > 0 ? '-12px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    {['PS', 'RK', 'AP', 'SM'][i]}
                  </div>
                ))}
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--color-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff',
                marginLeft: '-12px'
              }}>
                +16
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                Trusted by 2,500+ professionals
              </span>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/services" className="button primary" style={{ padding: '14px 28px' }}>
                Explore Services →
              </Link>
              <Link href="/register" className="button ghost" style={{ padding: '14px 28px' }}>
                Become a Local Pro
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="col-lg-6">
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden'
            }}>
              <Image
                src="/images/hero-service.png"
                alt="Professional technician installing AC in a modern living room"
                width={600}
                height={600}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 'var(--radius-xl)',
                  objectFit: 'cover'
                }}
              />
              {/* Floating Mini Cards */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.5)'
                }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Next available</p>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-heading)', marginBottom: '2px' }}>Home Repair</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: 0 }}>Book in 30 min • Mumbai</p>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.5)'
                }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Popular</p>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-heading)', marginBottom: '2px' }}>AC Install</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: 0 }}>From ₹599 • 4.9 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginTop: '60px',
          paddingTop: '40px',
          borderTop: '1px solid var(--color-border)'
        }}>
          {[
            { value: "1,500+", label: "Repairs completed" },
            { value: "2,500+", label: "Verified professionals" },
            { value: "40+", label: "Cities covered" },
            { value: "4.8", label: "Average rating" }
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                fontWeight: 800,
                color: 'var(--color-primary)',
                lineHeight: 1,
                marginBottom: '8px',
                letterSpacing: '-0.04em'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
