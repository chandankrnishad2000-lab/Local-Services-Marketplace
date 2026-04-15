import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe, calculatePlatformFee } from "@/lib/stripe";
import { requireRole } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireRole("CUSTOMER");
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId." }, { status: 400 });
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        localPro: { include: { localProProfile: true } },
        payment: true
      }
    });

    if (!booking || booking.customerId !== user.id) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const destination = booking.localPro.localProProfile?.stripeAccountId;
    if (!destination) {
      return NextResponse.json({ error: "Local Pro not connected to Stripe." }, { status: 400 });
    }

    const successUrl = process.env.STRIPE_SUCCESS_URL ?? "http://localhost:3000/bookings";
    const cancelUrl = process.env.STRIPE_CANCEL_URL ?? "http://localhost:3000/listings";

    const lineItems = [
      {
        price_data: {
          currency: booking.listing.currency,
          product_data: { name: booking.listing.title },
          unit_amount: booking.totalCents
        },
        quantity: 1
      }
    ];

    if (booking.tipCents > 0) {
      lineItems.push({
        price_data: {
          currency: booking.listing.currency,
          product_data: { name: "Tip" },
          unit_amount: booking.tipCents
        },
        quantity: 1
      });
    }

    const platformFeeCents = calculatePlatformFee(booking.totalCents);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: { destination },
        metadata: { bookingId: booking.id }
      },
      metadata: { bookingId: booking.id }
    });

    if (booking.payment) {
      await db.payment.update({
        where: { id: booking.payment.id },
        data: {
          stripeCheckoutSessionId: session.id,
          platformFeeCents,
          tipCents: booking.tipCents,
          amountCents: booking.totalCents + booking.tipCents
        }
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    if (message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    return NextResponse.json({ error: "Stripe checkout failed." }, { status: 500 });
  }
}
