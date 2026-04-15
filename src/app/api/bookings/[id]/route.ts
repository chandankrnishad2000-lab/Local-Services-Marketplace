import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/access";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: { listing: true, payment: true, customer: true, localPro: true }
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await requireRole(["LOCAL_PRO", "ADMIN"]);
    const payload = await request.json();
    const status = payload.status;

    if (!status) {
      return NextResponse.json({ error: "Missing status." }, { status: 400 });
    }

    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    if (user.role === "LOCAL_PRO" && booking.localProId !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const updated = await db.booking.update({
      where: { id: booking.id },
      data: { status }
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
