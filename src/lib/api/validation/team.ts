import { z } from "zod";

export const createTeamMemberSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    position: z.string().min(1, "Position is required").max(200),
    bio: z.string().max(2000).nullish(),
    photoUrl: z.string().url().max(2048).nullish(),
    email: z.string().email().max(255).nullish(),
    linkedinUrl: z.string().url().max(500).nullish(),
    githubUrl: z.string().url().max(500).nullish(),
    websiteUrl: z.string().url().max(500).nullish(),
    category: z.enum(["head", "core", "mentor"]).optional().default("core"),
    displayOrder: z.number().int().min(0).optional().default(0),
    isActive: z.boolean().optional().default(true),
    joinedAt: z.string().datetime().nullish()
});

export const updateTeamMemberSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    position: z.string().min(1).max(200).optional(),
    bio: z.string().max(2000).nullish(),
    photoUrl: z.string().url().max(2048).nullish(),
    email: z.string().email().max(255).nullish(),
    linkedinUrl: z.string().url().max(500).nullish(),
    githubUrl: z.string().url().max(500).nullish(),
    websiteUrl: z.string().url().max(500).nullish(),
    category: z.enum(["head", "core", "mentor"]).optional(),
    displayOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    joinedAt: z.string().datetime().nullish()
});
