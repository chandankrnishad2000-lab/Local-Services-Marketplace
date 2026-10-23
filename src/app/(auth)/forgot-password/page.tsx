"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    // Simulating API call for password reset
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 140px)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Icon + Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 24px rgba(126,179,227,0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 15h10"/>
              <path d="M12 15v2"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-heading)',
            marginBottom: '12px'
          }}>
            Forgot Password?
          </h1>
          <p style={{
            color: 'var(--color-body)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '340px',
            margin: '0 auto'
          }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: '#fff',
          padding: '32px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-soft)'
        }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <label htmlFor="email" style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--color-heading)'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: 0.35
                }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '0.95rem',
                    transition: 'var(--transition)',
                    background: 'var(--color-bg-soft)',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </form>

          {/* Success Message */}
          {success && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'var(--color-primary-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(126,179,227,0.2)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--color-heading)',
                lineHeight: 1.5,
                margin: 0
              }}>
                If an account exists for that email, you will receive reset instructions shortly.
              </p>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link href="/login" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-body)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Login
          </Link>
        </div>

        {/* Support */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
            Having trouble?{' '}
            <Link href="/contact" style={{ color: 'var(--color-primary-dark)', fontWeight: 600 }}>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
