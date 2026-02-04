/**
 * Server-side data fetching for testimonials
 */

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";

export type TestimonialRecord = NonNullable<Awaited<ReturnType<typeof getPublishedTestimonials>>>[number];

/**
 * Get all published testimonials
 */
export async function getPublishedTestimonials(limit = 50) {
    const records = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.status, "published"))
        .orderBy(desc(testimonials.isFeatured), desc(testimonials.createdAt))
        .limit(limit);

    return records.map(record => ({
        id: record.id,
        headline: record.headline,
        body: record.body,
        authorName: record.authorName,
        authorTitle: record.authorTitle,
        company: record.company,
        avatarUrl: record.avatarUrl,
        isFeatured: record.isFeatured,
        status: record.status,
        publishedAt: record.publishedAt?.toISOString() ?? null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}

/**
 * Get featured testimonials
 */
export async function getFeaturedTestimonials(limit = 6) {
    const records = await db
        .select()
        .from(testimonials)
        .where(and(
            eq(testimonials.status, "published"),
            eq(testimonials.isFeatured, true)
        ))
        .orderBy(desc(testimonials.createdAt))
        .limit(limit);

    return records.map(record => ({
        id: record.id,
        headline: record.headline,
        body: record.body,
        authorName: record.authorName,
        authorTitle: record.authorTitle,
        company: record.company,
        avatarUrl: record.avatarUrl,
        isFeatured: record.isFeatured,
        status: record.status,
        publishedAt: record.publishedAt?.toISOString() ?? null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}
