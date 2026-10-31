"use client";

import { oauthStartUrl, type OAuthProviders } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 384 512" aria-hidden="true">
      <path
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function OAuthButtons({
  providers,
  role,
  disabled
}: {
  providers: OAuthProviders | null;
  role?: string;
  disabled?: boolean;
}) {
  if (!providers) return null;

  const enabled = [
    providers.google ? "google" : null,
    providers.apple ? "apple" : null
  ].filter(Boolean) as Array<"google" | "apple">;

  if (enabled.length === 0) return null;

  return (
    <div style={{ marginTop: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        <span style={{ fontSize: "0.82rem", color: "var(--color-muted)", fontWeight: 500 }}>
          Or continue with
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: enabled.length === 2 ? "1fr 1fr" : "1fr",
          gap: "12px"
        }}
      >
        {enabled.map((provider) => (
          <button
            key={provider}
            type="button"
            disabled={disabled}
            onClick={() => {
              window.location.href = oauthStartUrl(provider, role);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px",
              borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--color-border)",
              background: "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--color-heading)",
              transition: "var(--transition)"
            }}
          >
            {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
            {provider === "google" ? "Google" : "Apple"}
          </button>
        ))}
      </div>
    </div>
  );
}
