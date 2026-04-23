import Link from "next/link";
import { apiFetchServer } from "@/lib/api-server";

const links = [
  { href: "/listings", label: "Explore" },
  { href: "/interfaces", label: "Interfaces" },
  { href: "/local-pros/dashboard", label: "Local Pro" },
  { href: "/bookings", label: "Bookings" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" }
];

export default async function Header() {
  const res = await apiFetchServer("/api/auth/me");
  const data = res.ok ? await res.json() : { user: null };
  const user = data.user;

  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          LocalPulse
        </Link>
        <nav className="nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ color: "#666" }}>
                Welcome, {user.name}
              </span>
              <Link href="/profile" className="button ghost">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="button ghost">
                Log in
              </Link>
              <Link href="/register" className="button primary">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
