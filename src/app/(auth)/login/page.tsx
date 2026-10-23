"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch, API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<{ google: boolean; apple: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }

      await refreshUser();
      setLoading(false);
      router.push("/listings");
    } catch (err) {
      setError(
        "Login failed: backend not reachable. Start the API with: `cd backend && npm start` (and open the site as http://localhost:3000)."
      );
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/oauth/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.providers) return;
        setOauthStatus(data.providers);
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      minHeight: 'calc(100vh - 140px)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px', display: 'inline-flex' }}>
            Account
          </span>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--color-heading)',
            marginTop: '8px',
            lineHeight: 1.1
          }}>
            Welcome back
          </h1>
          <p style={{
            color: 'var(--color-body)',
            marginTop: '12px',
            fontSize: '0.95rem'
          }}>
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <form id="login-form" onSubmit={onSubmit} style={{ display: 'grid', gap: '24px' }}>
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
              }} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
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
                  background: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <label htmlFor="password" style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--color-heading)'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <svg style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0.35
              }} width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path clipRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" fillRule="evenodd"/>
              </svg>
              <input
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
                minLength={8}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '0.95rem',
                  transition: 'var(--transition)',
                  background: '#fff',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link href="/forgot-password" style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--color-primary-dark)'
            }}>
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p style={{
              color: '#EF4444',
              fontSize: '0.88rem',
              fontWeight: 500,
              textAlign: 'center',
              padding: '12px',
              background: 'rgba(239,68,68,0.06)',
              borderRadius: 'var(--radius-sm)'
            }}>
              {error}
            </p>
          )}

          {oauthStatus && (!oauthStatus.google || !oauthStatus.apple) && (
            <p style={{
              color: 'var(--color-muted)',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginTop: '12px'
            }}>
              OAuth setup pending for {oauthStatus.google ? "Apple" : oauthStatus.apple ? "Google" : "Google & Apple"}.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1rem',
              borderRadius: 'var(--radius-sm)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '32px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}/>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-muted)', fontWeight: 500 }}>
            Or continue with
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}/>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <button
            type="button"
            data-purpose="google-login"
            onClick={() => {
              window.location.href = `${API_BASE}/api/auth/oauth/google/start`;
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-heading)',
              transition: 'var(--transition)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button
            type="button"
            data-purpose="apple-login"
            onClick={() => {
              window.location.href = `${API_BASE}/api/auth/oauth/apple/start`;
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--color-border)',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-heading)',
              transition: 'var(--transition)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
            Apple
          </button>
        </div>

        {/* Links */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: '12px' }}>
            Try OTP instead?{' '}
            <Link href="/otp-login" style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              Login with OTP
            </Link>
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-body)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
