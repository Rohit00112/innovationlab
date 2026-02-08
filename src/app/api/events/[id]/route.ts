import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getEventById } from "@/lib/api/resources/events";
import {
  parseEventDate,
  resolveEventPublishedAt,
  updateEventSchema,
  validateEventWindow
} from "@/lib/api/validation/events";
import { canManageContent } from "@/lib/auth/permissions";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";

function parseId(param: string) {
  const value = Number.parseInt(param, 10);

  if (Number.isNaN(value) || value <= 0) {
    throw new ApiError(400, "Invalid id parameter");
  }

  return value;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    const record = await getEventById(id);

    if (!record) {
      throw new ApiError(404, "Event not found");
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const existing = await getEventById(id);

    if (!existing) {
      throw new ApiError(404, "Event not found");
    }

    if (!canManageContent(session.user, existing.organizerId ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    const body = await request.json().catch(() => null);
    const parsed = updateEventSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const updates: Partial<typeof events.$inferInsert> = {};

    if (payload.title !== undefined) {
      updates.title = payload.title.trim();
    }

    if (payload.slug !== undefined) {
      const slug = payload.slug.trim().toLowerCase();

      if (slug !== existing.slug) {
        const [existingSlug] = await db
          .select({ id: events.id })
          .from(events)
          .where(eq(events.slug, slug))
          .limit(1);

        if (existingSlug && existingSlug.id !== id) {
          throw new ApiError(409, "Slug already exists");
        }
      }

      updates.slug = slug;
    }

    if (payload.summary !== undefined) {
      updates.summary = payload.summary?.trim() ?? null;
    }

    if (payload.description !== undefined) {
      updates.description = payload.description ?? null;
    }

    if (payload.location !== undefined) {
      updates.location = payload.location?.trim() ?? null;
    }

    if (payload.registrationUrl !== undefined) {
      updates.registrationUrl = payload.registrationUrl?.trim() ?? null;
    }

    if (payload.image !== undefined) {
      updates.image = payload.image ? payload.image.trim() : null;
    }

    if (payload.isVirtual !== undefined) {
      updates.isVirtual = payload.isVirtual;
    }

    if (payload.hasRegistration !== undefined) {
      updates.hasRegistration = payload.hasRegistration;
    }

    if (payload.enableProposalSubmission !== undefined) {
      updates.enableProposalSubmission = payload.enableProposalSubmission;
    }

    if (payload.minParticipants !== undefined) {
      updates.minParticipants = payload.minParticipants ?? null;
    }

    if (payload.maxParticipants !== undefined) {
      updates.maxParticipants = payload.maxParticipants ?? null;
    }

    if (payload.submissionFields !== undefined) {
      updates.submissionFields = payload.submissionFields ?? null;
    }

    if (payload.allowedRegistrationTypes !== undefined) {
      updates.allowedRegistrationTypes = payload.allowedRegistrationTypes;
    }

    if (payload.documents !== undefined) {
      updates.documents = payload.documents ?? null;
    }

    const nextStartsAt = payload.startsAt
      ? parseEventDate(payload.startsAt, "startsAt")
      : existing.startsAt;

    const nextEndsAt = payload.endsAt === undefined
      ? existing.endsAt
      : payload.endsAt
        ? parseEventDate(payload.endsAt, "endsAt")
        : null;

    validateEventWindow(nextStartsAt, nextEndsAt);

    if (payload.startsAt !== undefined) {
      updates.startsAt = nextStartsAt;
    }

    if (payload.endsAt !== undefined) {
      updates.endsAt = nextEndsAt;
    }

    const status = payload.status ?? existing.status;
    updates.status = status;

    const publishedAt = resolveEventPublishedAt({
      incoming: payload.publishedAt,
      status,
      current: existing.publishedAt,
      mode: "update"
    });

    updates.publishedAt = publishedAt;

    if (payload.organizerId !== undefined) {
      updates.organizerId = payload.organizerId;
    }

    updates.updatedAt = new Date();

    await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id));

    const record = await getEventById(id);

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params;
    const id = parseId(idParam);
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const existing = await getEventById(id);

    if (!existing) {
      throw new ApiError(404, "Event not found");
    }

    if (!canManageContent(session.user, existing.organizerId ?? null)) {
      throw new ApiError(403, "Insufficient permissions");
    }

    await db.delete(events).where(eq(events.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
