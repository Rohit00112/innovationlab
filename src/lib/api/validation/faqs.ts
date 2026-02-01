import { z } from "zod";
import { faqCategoryEnum } from "@/lib/db/schema";

export const createFaqSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters long"),
    answer: z.string().min(10, "Answer must be at least 10 characters long"),
    category: z.enum(faqCategoryEnum.enumValues).default("general"),
    displayOrder: z.coerce.number().int().default(0),
    isActive: z.boolean().default(true),
});

export const updateFaqSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters long").optional(),
    answer: z.string().min(10, "Answer must be at least 10 characters long").optional(),
    category: z.enum(faqCategoryEnum.enumValues).optional(),
    displayOrder: z.coerce.number().int().optional(),
    isActive: z.boolean().optional(),
});

export type CreateFaqInput = z.infer<typeof createFaqSchema>;
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>;
