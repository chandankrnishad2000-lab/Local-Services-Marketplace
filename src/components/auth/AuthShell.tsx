import type { ReactNode } from "react";

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 140px)",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px"
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ marginBottom: "28px" }}>
          <span className="eyebrow" style={{ marginBottom: "12px", display: "inline-flex" }}>
            {eyebrow}
          </span>
          <h1
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "var(--color-heading)",
              marginTop: "8px",
              lineHeight: 1.1
            }}
          >
            {title}
          </h1>
          <p style={{ color: "var(--color-body)", marginTop: "12px", fontSize: "0.95rem" }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
            boxShadow: "var(--shadow-soft)"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
