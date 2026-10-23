"use client";

import Image from "next/image";

export default function CitiesSection() {
  const cities = [
    { name: "Mumbai", state: "Maharashtra", services: "2,450+", icon: "🏙️" },
    { name: "Bangalore", state: "Karnataka", services: "1,890+", icon: "🌆" },
    { name: "Delhi", state: "Delhi", services: "2,180+", icon: "🏛️" },
    { name: "Pune", state: "Maharashtra", services: "1,240+", icon: "⛰️" },
    { name: "Hyderabad", state: "Telangana", services: "1,560+", icon: "🕌" },
    { name: "Chennai", state: "Tamil Nadu", services: "980+", icon: "🌊" },
    { name: "Kolkata", state: "West Bengal", services: "750+", icon: "🌉" },
    { name: "Ahmedabad", state: "Gujarat", services: "890+", icon: "🏗️" },
    { name: "Jaipur", state: "Rajasthan", services: "620+", icon: "🏰" }
  ];

  return (
    <section style={{
      padding: '80px 0',
      background: '#fff'
    }}>
      <div className="container">
        {/* Top: Image Banner + Header */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '48px',
          height: '260px'
        }}>
          <Image
            src="/images/city-skyline.png"
            alt="Indian city skyline at golden hour"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '40px 48px'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-primary-light)',
              marginBottom: '12px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-primary)'
              }}/>
              Coverage
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#fff',
              lineHeight: 1.1
            }}>
              Available in Major Cities
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              marginTop: '10px',
              maxWidth: '400px'
            }}>
              Find trusted local pros in your area across 40+ cities
            </p>
          </div>
        </div>

        {/* Cities Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          {cities.map((city, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 28px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textDecoration: 'none',
                transition: 'var(--transition)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{city.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--color-heading)',
                  marginBottom: '2px'
                }}>
                  {city.name}
                </h3>
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--color-muted)',
                  margin: 0
                }}>
                  {city.state}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-primary-dark)'
                }}>
                  {city.services}
                </span>
                <p style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-muted)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  services
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ opacity: 0.3 }}>
                <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </div>

        {/* View All Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <a href="#" className="button outline" style={{ padding: '14px 32px' }}>
            View All Cities →
          </a>
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
