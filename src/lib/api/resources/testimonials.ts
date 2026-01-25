import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { testimonials, users } from "@/lib/db/schema";

export const testimonialSelection = {
  id: testimonials.id,
  headline: testimonials.headline,
  quote: testimonials.body,
  author: testimonials.authorName,
  role: testimonials.authorTitle,
  company: testimonials.company,
  avatarUrl: testimonials.avatarUrl,
  isFeatured: testimonials.isFeatured,
  status: testimonials.status,
  publishedAt: testimonials.publishedAt,
  submittedById: testimonials.submittedById,
  createdAt: testimonials.createdAt,
  updatedAt: testimonials.updatedAt,
  submittedBy: {
    id: users.id,
    name: users.name,
    email: users.email,
    avatarUrl: users.avatarUrl,
    role: users.role
  }
} as const;


export async function getTestimonialById(id: number) {
  const [record] = await db
    .select(testimonialSelection)
    .from(testimonials)
    .leftJoin(users, eq(testimonials.submittedById, users.id))
    .where(eq(testimonials.id, id));

  return record ?? null;
}
