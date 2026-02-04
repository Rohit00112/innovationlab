import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { CreateFaqInput, UpdateFaqInput } from "@/lib/api/validation/faqs";
import { eq, desc, asc } from "drizzle-orm";

export const getFaqs = async (isActiveOnly = true) => {
    let query = db.select().from(faqs);

    if (isActiveOnly) {
        // @ts-expect-error - simple where condition
        query = query.where(eq(faqs.isActive, true));
    }

    // Sort by display order first, then created date
    return await query.orderBy(asc(faqs.displayOrder), desc(faqs.createdAt));
};

export const getFaqById = async (id: number) => {
    const result = await db.select().from(faqs).where(eq(faqs.id, id));
    return result[0] || null;
};

export const createFaq = async (data: CreateFaqInput) => {
    const result = await db.insert(faqs).values(data).returning();
    return result[0];
};

export const updateFaq = async (id: number, data: UpdateFaqInput) => {
    const result = await db
        .update(faqs)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(faqs.id, id))
        .returning();
    return result[0];
};

export const deleteFaq = async (id: number) => {
    const result = await db.delete(faqs).where(eq(faqs.id, id)).returning();
    return result[0];
};

export const getFaqsByCategory = async (category: string) => {
    return await db
        .select()
        .from(faqs)
        // @ts-expect-error - interacting with enum column
        .where(eq(faqs.category, category))
        .orderBy(asc(faqs.displayOrder));
};
