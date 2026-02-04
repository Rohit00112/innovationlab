/**
 * Server-side data fetching for FAQs
 */

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema";

export type FaqRecord = NonNullable<Awaited<ReturnType<typeof getActiveFaqs>>>[number];

/**
 * Get all active FAQs
 */
export async function getActiveFaqs() {
    const records = await db
        .select()
        .from(faqs)
        .where(eq(faqs.isActive, true))
        .orderBy(asc(faqs.displayOrder));

    return records.map(record => ({
        id: record.id,
        question: record.question,
        answer: record.answer,
        category: record.category,
        displayOrder: record.displayOrder,
        isActive: record.isActive,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}

/**
 * Get FAQs by category
 */
export async function getFaqsByCategory(category: "general" | "membership" | "events" | "support") {
    const records = await db
        .select()
        .from(faqs)
        .where(and(
            eq(faqs.isActive, true),
            eq(faqs.category, category)
        ))
        .orderBy(asc(faqs.displayOrder));

    return records.map(record => ({
        id: record.id,
        question: record.question,
        answer: record.answer,
        category: record.category,
        displayOrder: record.displayOrder,
        isActive: record.isActive,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}
