import { z } from "zod";

import { eventStatusEnum } from "@/lib/db/schema";

import { ApiError } from "../errors";

export type EventStatus = (typeof eventStatusEnum.enumValues)[number];

const isoDateTime = z.string().datetime({ offset: true });

export const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(1).max(200),
  summary: z.string().max(600).optional().nullable(),
  description: z.string().min(1).optional().nullable(),
  location: z.string().max(400).optional().nullable(),
  registrationUrl: z.string().url().max(2048).optional().nullable(),
  image: z.string().url().max(2048).optional().nullable(),
  isVirtual: z.boolean().optional(),
  hasRegistration: z.boolean().optional(),
  enableProposalSubmission: z.boolean().optional(),
  startsAt: isoDateTime,
  endsAt: isoDateTime.optional().nullable(),
  status: z.enum(eventStatusEnum.enumValues).optional(),
  publishedAt: z.union([isoDateTime, z.null()]).optional(),
  organizerId: z.number().int().positive().optional(),
  parentEventId: z.number().int().positive().optional().nullable(),
  documents: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        url: z.string().url().max(2048)
      })
    )
    .optional()
    .nullable()
});

export const updateEventSchema = createEventSchema.partial().extend({
  slug: z.string().min(1).max(200).optional()
});

export function parseEventDate(value: string, label: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, `${label} must be a valid ISO 8601 date`);
  }

  return parsed;
}

export function validateEventWindow(startsAt: Date, endsAt: Date | null | undefined) {
  if (!endsAt) {
    return;
  }

  if (endsAt.getTime() < startsAt.getTime()) {
    throw new ApiError(400, "Event end time must be after start time");
  }
}

export function resolveEventPublishedAt(options: {
  incoming: string | null | undefined;
  status: EventStatus;
  current?: Date | null;
  mode?: "create" | "update";
}) {
  const { incoming, status, current = null, mode = "create" } = options;

  if (incoming === undefined) {
    if (mode === "create") {
      return status === "published" ? new Date() : null;
    }

    return current ?? (status === "published" ? new Date() : null);
  }

  if (incoming === null) {
    return null;
  }

  const parsed = new Date(incoming);

  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid publishedAt value");
  }

  return parsed;
}
