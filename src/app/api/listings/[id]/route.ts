import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listingSchema } from "@/lib/validators";
import { requireRole } from "@/lib/access";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const listing = await db.serviceListing.findUnique({
    where: { id },
    include: { localPro: { select: { name: true } }, reviews: true }
  });

  if (!listing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await requireRole("LOCAL_PRO");
    const payload = await request.json();
    const highlights =
      typeof payload.highlights === "string"
        ? payload.highlights
            .split(/[\n,]/)
            .map((item: string) => item.trim())
            .filter(Boolean)
        : payload.highlights;
    const requirements =
      typeof payload.requirements === "string"
        ? payload.requirements
            .split(/[\n,]/)
            .map((item: string) => item.trim())
            .filter(Boolean)
        : payload.requirements;

    const parsed = listingSchema
      .partial()
      .safeParse({ ...payload, highlights, requirements });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const listing = await db.serviceListing.findUnique({ where: { id } });
    if (!listing || listing.localProId !== user.id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const updated = await db.serviceListing.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json({ listing: updated });
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

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await requireRole("LOCAL_PRO");
    const listing = await db.serviceListing.findUnique({ where: { id } });
    if (!listing || listing.localProId !== user.id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await db.serviceListing.update({
      where: { id },
      data: { status: "PAUSED" }
    });

    return NextResponse.json({ ok: true });
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
