"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import AuthShell from "@/components/auth/AuthShell";
import { AuthInput, FormError, PasswordInput } from "@/components/auth/fields";
import OAuthButtons from "@/components/auth/OAuthButtons";
import {
  readApiError,
  redirectPathForRole,
  safeNextPath,
  type OAuthProviders
} from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<OAuthProviders | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        setError(await readApiError(res, "Invalid email or password."));
        return;
      }

      const data = await res.json().catch(() => ({}));
      await refreshUser();

      const next = safeNextPath(new URLSearchParams(window.location.search).get("next"));
      router.push(next ?? redirectPathForRole(data?.role));
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    apiFetch("/api/auth/oauth/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.providers) return;
        setProviders(data.providers);
      })
      .catch(() => null);

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back"
      subtitle="Sign in to continue to your account"
    >
      <form
        id="login-form"
        onSubmit={onSubmit}
        noValidate
        style={{ display: "grid", gap: "18px" }}
      >
        <AuthInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          icon={
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          }
        />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          icon={
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path
                clipRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                fillRule="evenodd"
              />
            </svg>
          }
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px" }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-primary-dark)" }}
          >
            Forgot Password?
          </Link>
        </div>

        <FormError message={error} />

        <button
          type="submit"
          disabled={loading}
          className="button primary"
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "1rem",
            borderRadius: "var(--radius-sm)",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <OAuthButtons providers={providers} disabled={loading} />

      <div
        style={{
          marginTop: "28px",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-border)",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "var(--color-body)", marginBottom: "10px" }}>
          Try OTP instead?{" "}
          <Link href="/otp-login" style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
            Login with OTP
          </Link>
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--color-body)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
