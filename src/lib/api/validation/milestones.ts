import { z } from "zod";

export const createMilestoneSchema = z.object({
    year: z.string().min(1, "Year is required").max(20),
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(2000).nullish(),
    displayOrder: z.number().int().min(0).optional().default(0),
});

export const updateMilestoneSchema = z.object({
    year: z.string().min(1).max(20).optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullish(),
    displayOrder: z.number().int().min(0).optional(),
});
