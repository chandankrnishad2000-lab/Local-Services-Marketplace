"use client";

import Link from "next/link";
import { serviceFeatures } from "@/lib/services";

export default function FeaturesSection() {
  return (
    <section style={{
      padding: '80px 0',
      background: 'var(--color-bg-soft)'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '56px'
        }}>
          <span className="eyebrow" style={{
            marginBottom: '16px',
            display: 'inline-flex',
            justifyContent: 'center'
          }}>
            Why Choose Us
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-heading)',
            marginTop: '12px',
            lineHeight: 1.1
          }}>
            Why Choose Local Services?
          </h2>
          <p style={{
            color: 'var(--color-body)',
            fontSize: '1.05rem',
            marginTop: '16px',
            maxWidth: '520px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Everything you need for hassle-free local services
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {serviceFeatures.map((feature, idx) => (
            <div
              key={feature.slug}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                border: '1px solid var(--color-border)',
                transition: 'var(--transition)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                background: idx === 0 ? 'var(--color-primary)' : 'var(--color-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '20px'
              }}>
                {feature.icon}
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--color-heading)',
                marginBottom: '10px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--color-body)',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}>
                {feature.description}
              </p>
              <Link
                href={`/services/${feature.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-dark)',
                  textDecoration: 'none'
                }}
              >
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .container > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 576px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
