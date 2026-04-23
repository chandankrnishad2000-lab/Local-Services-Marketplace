"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function OTPLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  async function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await apiFetch("/api/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setMessage(data.message);
      setExpiresAt(new Date(data.expiresAt));
      setStep("verify");
      setLoading(false);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function handleCodeSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP code");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/listings");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-between p-6 max-w-md mx-auto w-full min-h-[calc(100vh-140px)]">
      <header className="mt-12 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {step === "email" ? "Login with OTP" : "Verify OTP"}
        </h1>
        <p className="text-gray-500 mt-2">
          {step === "email"
            ? "Enter your email to receive a one-time code"
            : "Enter the 6-digit code sent to your email"}
        </p>
      </header>

      <main className="flex-grow">
        {step === "email" ? (
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
                id="email"
                name="email"
                placeholder="name@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p style={{ color: "#dc2626" }}>{error}</p>}

            <button
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleCodeSubmit}>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="code">
                OTP Code
              </label>
              <input
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out sm:text-sm text-center text-2xl tracking-widest"
                id="code"
                name="code"
                placeholder="000000"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>

            {message && <p style={{ color: "#16a34a" }}>{message}</p>}
            {error && <p style={{ color: "#dc2626" }}>{error}</p>}

            {expiresAt && (
              <p className="text-sm text-gray-500">
                Expires at: {expiresAt.toLocaleTimeString()}
              </p>
            )}

            <div className="flex gap-3">
              <button
                className="flex-1 py-4 px-4 border border-gray-200 rounded-2xl shadow-sm text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
              >
                Back
              </button>
              <button
                className="flex-1 py-4 px-4 border border-transparent rounded-2xl shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || code.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="mt-8 mb-4">
        <p className="text-center text-sm text-gray-500">
          Prefer password login?
          <Link className="font-semibold text-blue-600 hover:text-blue-500 ml-2" href="/login">
            Log in with password
          </Link>
        </p>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?
          <Link className="font-semibold text-blue-600 hover:text-blue-500 ml-2" href="/register">
            Sign up
          </Link>
        </p>
      </footer>
    </div>
  );
}
