"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: ReactNode;
};

export function AuthInput({ id, label, icon, style, ...props }: FieldProps) {
  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-heading)" }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.35,
              display: "flex"
            }}
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          style={{
            width: "100%",
            padding: icon ? "14px 16px 14px 44px" : "14px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--color-border)",
            fontSize: "0.95rem",
            transition: "var(--transition)",
            background: "#fff",
            outline: "none",
            ...style
          }}
          {...props}
        />
      </div>
    </div>
  );
}

export function PasswordInput({ id, label, icon, ...props }: FieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ display: "grid", gap: "8px" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-heading)" }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.35,
              display: "flex"
            }}
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          type={visible ? "text" : "password"}
          style={{
            width: "100%",
            padding: icon ? "14px 64px 14px 44px" : "14px 64px 14px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--color-border)",
            fontSize: "0.95rem",
            transition: "var(--transition)",
            background: "#fff",
            outline: "none"
          }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "var(--color-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            padding: "8px",
            cursor: "pointer"
          }}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      style={{
        color: "#EF4444",
        fontSize: "0.88rem",
        fontWeight: 500,
        textAlign: "center",
        padding: "12px",
        background: "rgba(239,68,68,0.06)",
        borderRadius: "var(--radius-sm)"
      }}
    >
      {message}
    </p>
  );
}
