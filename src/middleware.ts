import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const PROTECTED_ROUTES: { path: string; roles?: string[] }[] = [
  { path: "/bookings", roles: ["CUSTOMER", "LOCAL_PRO"] },
  { path: "/local-pros", roles: ["LOCAL_PRO"] },
  { path: "/admin", roles: ["ADMIN"] },
  { path: "/profile" }
];

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/otp-login",
  "/listings"
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // Check if route should be protected
  const protectedRoute = PROTECTED_ROUTES.find(route => 
    pathname.startsWith(route.path)
  );

  if (!protectedRoute) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify token is valid and has required role
  try {
    const session = await db.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.expiresAt < new Date()) {
      // Delete expired session
      await db.session.delete({ where: { token } });
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role-based access
    if (protectedRoute.roles && !protectedRoute.roles.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
