import { z } from "zod";

import { communityStatusEnum } from "@/lib/db/schema";

export const createCommunitySchema = z.object({
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
    description: z.string().max(500).optional().nullable(),
    content: z.string().max(50000).optional().nullable(),
    coverImageUrl: z.string().url().max(2048).optional().nullable(),
    status: z.enum(communityStatusEnum.enumValues).optional(),
    displayOrder: z.number().int().min(0).optional()
});

export const updateCommunitySchema = z.object({
    name: z.string().min(1).max(200).optional(),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
    description: z.string().max(500).optional().nullable(),
    content: z.string().max(50000).optional().nullable(),
    coverImageUrl: z.string().url().max(2048).optional().nullable(),
    status: z.enum(communityStatusEnum.enumValues).optional(),
    displayOrder: z.number().int().min(0).optional()
});
