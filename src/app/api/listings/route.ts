import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listingSchema } from "@/lib/validators";
import { requireRole } from "@/lib/access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const listings = await db.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      ...(category ? { category } : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(minPrice || maxPrice
        ? {
            priceCents: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {})
            }
          }
        : {})
    },
    include: {
      localPro: { select: { name: true } },
      reviews: true
    }
  });

  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  try {
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

    const parsed = listingSchema.safeParse({
      ...payload,
      priceCents: Number(payload.priceCents),
      durationMinutes: payload.durationMinutes ? Number(payload.durationMinutes) : undefined,
      highlights,
      requirements
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const listing = await db.serviceListing.create({
      data: {
        ...parsed.data,
        highlights: parsed.data.highlights ?? [],
        requirements: parsed.data.requirements ?? [],
        localProId: user.id,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ id: listing.id });
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
