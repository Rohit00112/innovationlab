import { z } from "zod";

import { newsStatusEnum } from "@/lib/db/schema";

import { ApiError } from "../errors";

export type NewsStatus = (typeof newsStatusEnum.enumValues)[number];

export const createNewsSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(1).max(200),
  excerpt: z.string().max(600).optional().nullable(),
  content: z.string().min(1),
  coverImageUrl: z.string().trim().max(2048).optional().nullable(),
  status: z.enum(newsStatusEnum.enumValues).optional(),
  publishedAt: z.union([z.string().datetime({ offset: true }), z.null()]).optional()
});

export const updateNewsSchema = createNewsSchema.partial().extend({
  slug: z.string().min(1).max(200).optional()
});

export function resolvePublishedAt(options: {
  incoming: string | null | undefined;
  status: NewsStatus;
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
