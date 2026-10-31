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
  type OAuthProviders
} from "@/lib/auth-client";

type Role = "CUSTOMER" | "LOCAL_PRO";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<OAuthProviders | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>("CUSTOMER");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const role = form.get("role") === "LOCAL_PRO" ? "LOCAL_PRO" : "CUSTOMER";
    const acceptedTerms = form.get("terms") === "on";

    if (name.length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        setError(await readApiError(res, "Registration failed. Please try again."));
        return;
      }

      const data = await res.json().catch(() => ({}));
      await refreshUser();
      router.push(redirectPathForRole(data?.role ?? role));
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
      eyebrow="Get started"
      title="Create your account"
      subtitle="Join to book trusted local pros or offer your own services."
    >
      <form
        id="register-form"
        onSubmit={onSubmit}
        noValidate
        style={{ display: "grid", gap: "18px" }}
      >
        <AuthInput
          id="name"
          name="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          required
          icon={
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path
                clipRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                fillRule="evenodd"
              />
            </svg>
          }
        />

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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
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

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          minLength={8}
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

        <div style={{ display: "grid", gap: "8px" }}>
          <label
            htmlFor="role"
            style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-heading)" }}
          >
            I am signing up as
          </label>
          <div style={{ position: "relative" }}>
            <select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value as Role)}
              style={{
                width: "100%",
                padding: "14px 40px 14px 16px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--color-border)",
                fontSize: "0.95rem",
                background: "#fff",
                color: "var(--color-heading)",
                appearance: "none",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="CUSTOMER">Customer — I want to book services</option>
              <option value="LOCAL_PRO">Local Pro — I want to offer services</option>
            </select>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--color-muted)"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <input
            id="terms"
            name="terms"
            type="checkbox"
            style={{
              width: "16px",
              height: "16px",
              marginTop: "3px",
              accentColor: "var(--color-primary-dark)",
              cursor: "pointer",
              flexShrink: 0
            }}
          />
          <label
            htmlFor="terms"
            style={{ fontSize: "0.84rem", color: "var(--color-body)", lineHeight: 1.5 }}
          >
            I agree to the{" "}
            <Link href="/terms" style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
              Privacy Policy
            </Link>
            .
          </label>
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <OAuthButtons providers={providers} role={selectedRole} disabled={loading} />

      <div
        style={{
          marginTop: "28px",
          paddingTop: "24px",
          borderTop: "1px solid var(--color-border)",
          textAlign: "center"
        }}
      >
        <p style={{ fontSize: "0.9rem", color: "var(--color-body)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
            Log In
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
