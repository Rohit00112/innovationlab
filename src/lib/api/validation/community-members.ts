import { z } from "zod";

import { communityMemberRoleEnum } from "@/lib/db/schema";

export const createCommunityMemberSchema = z.object({
    name: z.string().min(1).max(200),
    title: z.string().max(200).optional().nullable(),
    email: z.string().email().max(255).optional().nullable(),
    bio: z.string().max(2000).optional().nullable(),
    avatarUrl: z.string().url().max(2048).optional().nullable(),
    role: z.enum(communityMemberRoleEnum.enumValues).optional(),
    linkedinUrl: z.string().url().max(500).optional().nullable(),
    githubUrl: z.string().url().max(500).optional().nullable(),
    websiteUrl: z.string().url().max(500).optional().nullable(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    joinedAt: z.string().datetime().optional().nullable()
});

export const updateCommunityMemberSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    title: z.string().max(200).optional().nullable(),
    email: z.string().email().max(255).optional().nullable(),
    bio: z.string().max(2000).optional().nullable(),
    avatarUrl: z.string().url().max(2048).optional().nullable(),
    role: z.enum(communityMemberRoleEnum.enumValues).optional(),
    linkedinUrl: z.string().url().max(500).optional().nullable(),
    githubUrl: z.string().url().max(500).optional().nullable(),
    websiteUrl: z.string().url().max(500).optional().nullable(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    joinedAt: z.string().datetime().optional().nullable()
});
