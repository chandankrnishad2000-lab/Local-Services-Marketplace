import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const { name, email, password, role } = parsed.data;
    
    try {
      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered." }, { status: 409 });
      }

      const user = await db.user.create({
        data: {
          name,
          email,
          passwordHash: await hashPassword(password),
          role
        }
      });

      if (role === "LOCAL_PRO") {
        await db.localProProfile.create({
          data: {
            userId: user.id,
            displayName: name
          }
        });
      }

      const session = await createSession(user.id);
      (await cookies()).set("session", session.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: session.expiresAt
      });

      return NextResponse.json({ id: user.id, role: user.role });
    } catch (dbError) {
      console.error("Database error during registration:", dbError);
      return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
