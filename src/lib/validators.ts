import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "LOCAL_PRO"]).default("CUSTOMER")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const listingSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  category: z.string().min(2),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  priceCents: z.number().int().min(100),
  currency: z.string().default("inr"),
  location: z.string().min(2),
  serviceArea: z.string().min(2).optional(),
  imageUrl: z.string().url().optional(),
  highlights: z.array(z.string().min(2)).optional(),
  requirements: z.array(z.string().min(2)).optional()
});

export const bookingSchema = z.object({
  listingId: z.string().min(5),
  startAt: z.string(),
  endAt: z.string(),
  notes: z.string().max(500).optional(),
  tipCents: z.number().int().min(0).max(50000).optional()
});

export const reviewSchema = z.object({
  bookingId: z.string().min(5),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

export const messageSchema = z.object({
  threadId: z.string().min(5),
  body: z.string().min(1).max(1000)
});
