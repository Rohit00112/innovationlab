import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getNewsById } from "@/lib/api/resources/news";
import { resolvePublishedAt, updateNewsSchema } from "@/lib/api/validation/news";
import { canManageContent } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { news } from "@/lib/db/schema";

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
    const record = await getNewsById(id);

    if (!record) {
      throw new ApiError(404, "News entry not found");
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
    const existing = await getNewsById(id);

    if (!existing) {
      throw new ApiError(404, "News entry not found");
    }

    if (!canManageContent(session.user, existing.authorId ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    const body = await request.json().catch(() => null);
    const parsed = updateNewsSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const updates: Partial<typeof news.$inferInsert> = {};

    if (payload.title !== undefined) {
      updates.title = payload.title.trim();
    }

    if (payload.slug !== undefined) {
      const slug = payload.slug.trim().toLowerCase();

      if (slug !== existing.slug) {
        const [existingSlug] = await db
          .select({ id: news.id })
          .from(news)
          .where(eq(news.slug, slug))
          .limit(1);

        if (existingSlug && existingSlug.id !== id) {
          throw new ApiError(409, "Slug already exists");
        }
      }

      updates.slug = slug;
    }

    if (payload.excerpt !== undefined) {
      updates.excerpt = payload.excerpt?.trim() ?? null;
    }

    if (payload.content !== undefined) {
      updates.content = payload.content;
    }

    if (payload.coverImageUrl !== undefined) {
      updates.coverImageUrl = payload.coverImageUrl?.trim() ?? null;
    }

    const status = payload.status ?? existing.status;
    updates.status = status;

    const publishedAt = resolvePublishedAt({
      incoming: payload.publishedAt,
      status,
      current: existing.publishedAt,
      mode: "update"
    });

    updates.publishedAt = publishedAt;
    updates.updatedAt = new Date();

    await db
      .update(news)
      .set(updates)
      .where(eq(news.id, id));

    const record = await getNewsById(id);

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseId(params.id);
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const existing = await getNewsById(id);

    if (!existing) {
      throw new ApiError(404, "News entry not found");
    }

    if (!canManageContent(session.user, existing.authorId ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    await db.delete(news).where(eq(news.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
