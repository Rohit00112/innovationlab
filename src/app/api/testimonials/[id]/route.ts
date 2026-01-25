import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getTestimonialById } from "@/lib/api/resources/testimonials";
import {
  resolveTestimonialPublishedAt,
  updateTestimonialSchema
} from "@/lib/api/validation/testimonials";
import { canManageContent } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

function parseId(param: string) {
  const value = Number.parseInt(param, 10);

  if (Number.isNaN(value) || value <= 0) {
    throw new ApiError(400, "Invalid id parameter");
  }

  return value;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    const record = await getTestimonialById(id);

    if (!record) {
      throw new ApiError(404, "Testimonial not found");
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const existing = await getTestimonialById(id);

    if (!existing) {
      throw new ApiError(404, "Testimonial not found");
    }

    if (!canManageContent(session.user, existing.submittedById ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    const body = await request.json().catch(() => null);
    const parsed = updateTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const updates: Partial<typeof testimonials.$inferInsert> = {};

    if (payload.headline !== undefined) {
      updates.headline = payload.headline?.trim() ?? null;
    }

    if (payload.body !== undefined) {
      updates.body = payload.body;
    }

    if (payload.authorName !== undefined) {
      updates.authorName = payload.authorName.trim();
    }

    if (payload.authorTitle !== undefined) {
      updates.authorTitle = payload.authorTitle?.trim() ?? null;
    }

    if (payload.company !== undefined) {
      updates.company = payload.company?.trim() ?? null;
    }

    if (payload.avatarUrl !== undefined) {
      updates.avatarUrl = payload.avatarUrl?.trim() ?? null;
    }

    if (payload.isFeatured !== undefined) {
      updates.isFeatured = payload.isFeatured;
    }

    const status = payload.status ?? existing.status;
    updates.status = status;

    const publishedAt = resolveTestimonialPublishedAt({
      incoming: payload.publishedAt,
      status,
      current: existing.publishedAt,
      mode: "update"
    });

    updates.publishedAt = publishedAt;
    updates.updatedAt = new Date();

    await db
      .update(testimonials)
      .set(updates)
      .where(eq(testimonials.id, id));

    const record = await getTestimonialById(id);

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const existing = await getTestimonialById(id);

    if (!existing) {
      throw new ApiError(404, "Testimonial not found");
    }

    if (!canManageContent(session.user, existing.submittedById ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    await db.delete(testimonials).where(eq(testimonials.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
