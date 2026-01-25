import { z } from "zod";

import { testimonialStatusEnum } from "@/lib/db/schema";

import { ApiError } from "../errors";

export type TestimonialStatus = (typeof testimonialStatusEnum.enumValues)[number];

const isoDateTime = z.string().datetime({ offset: true });

export const createTestimonialSchema = z.object({
  headline: z.string().max(200).optional().nullable(),
  body: z.string().min(1),
  authorName: z.string().min(1).max(200),
  authorTitle: z.string().max(200).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  avatarUrl: z.string().url().max(2048).optional().nullable(),
  isFeatured: z.boolean().optional(),
  status: z.enum(testimonialStatusEnum.enumValues).optional(),
  publishedAt: z.union([isoDateTime, z.null()]).optional()
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export function resolveTestimonialPublishedAt(options: {
  incoming: string | null | undefined;
  status: TestimonialStatus;
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
