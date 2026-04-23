"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  async function handleLogout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      setError("Failed to logout");
    }
  }

  if (loading) return <div className="container section"><p>Loading...</p></div>;

  return (
    <div className="container section">
      <div className="card">
        <h1>Your Profile</h1>
        
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}
        
        {user && (
          <div style={{ marginTop: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                Logout
              </button>
              <Link href="/listings" style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                textDecoration: "none",
                display: "inline-block"
              }}>
                Back to Listings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
