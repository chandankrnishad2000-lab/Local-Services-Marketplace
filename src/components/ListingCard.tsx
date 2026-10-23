"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/utils";
import type { ListingCard as ListingCardType } from "@/types";

export default function ListingCard({
  id,
  title,
  category,
  location,
  durationMinutes,
  priceCents,
  currency,
  providerName,
  rating,
  reviewCount,
  href
}: ListingCardType) {
  return (
    <Link
      href={href ?? `/listings/${id}`}
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--color-border)',
        textDecoration: 'none',
        display: 'block',
        transition: 'var(--transition)',
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
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div>
          <span className="eyebrow" style={{ fontSize: '0.7rem', marginBottom: '8px', display: 'inline-flex' }}>
            {category}
          </span>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--color-heading)',
            lineHeight: 1.3,
            marginTop: '6px'
          }}>
            {title}
          </h3>
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--color-primary-dark)',
          whiteSpace: 'nowrap'
        }}>
          {formatMoney(priceCents, currency)}
        </span>
      </div>

      <p style={{
        color: 'var(--color-muted)',
        fontSize: '0.88rem',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1.5C4.5 1.5 2.5 3.5 2.5 6c0 3.5 4.5 6.5 4.5 6.5s4.5-3 4.5-6.5c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        {location}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border)'
      }}>
        <span style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--color-primary-bg)',
          color: 'var(--color-primary-dark)',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          {providerName}
        </span>
        <span style={{
          color: 'var(--color-muted)',
          fontSize: '0.82rem'
        }}>
          {durationMinutes ? `${durationMinutes} min` : "Flexible"}
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--color-heading)',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          {rating ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.02l-3.52 1.83.67-3.93L1.3 5.14l3.94-.57L7 1z"/>
              </svg>
              {rating.toFixed(1)}
              <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>({reviewCount ?? 0})</span>
            </>
          ) : "New"}
        </span>
      </div>
    </Link>
  );
}
