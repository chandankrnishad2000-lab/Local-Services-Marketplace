import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingSchema } from "@/lib/validators";
import { requireRole } from "@/lib/access";

export async function GET() {
  try {
    const user = await requireRole(["CUSTOMER", "LOCAL_PRO", "ADMIN"]);
    const bookings = await db.booking.findMany({
      where: {
        OR: [{ customerId: user.id }, { localProId: user.id }]
      },
      include: { listing: true, payment: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole("CUSTOMER");
    const payload = await request.json();
    const parsed = bookingSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const listing = await db.serviceListing.findUnique({
      where: { id: parsed.data.listingId },
      include: { localPro: true }
    });

    if (!listing || listing.status !== "ACTIVE") {
      return NextResponse.json({ error: "Listing not available." }, { status: 404 });
    }

    const tipCents = parsed.data.tipCents ? Number(parsed.data.tipCents) : 0;

    const booking = await db.booking.create({
      data: {
        listingId: listing.id,
        customerId: user.id,
        localProId: listing.localProId,
        startAt: new Date(parsed.data.startAt),
        endAt: new Date(parsed.data.endAt),
        notes: parsed.data.notes,
        totalCents: listing.priceCents,
        tipCents
      }
    });

    await db.payment.create({
      data: {
        bookingId: booking.id,
        amountCents: booking.totalCents + tipCents,
        currency: listing.currency,
        tipCents,
        status: "REQUIRES_PAYMENT"
      }
    });

    await db.messageThread.create({
      data: { bookingId: booking.id }
    });

    return NextResponse.json({ bookingId: booking.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
