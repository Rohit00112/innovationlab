/**
 * Server-side data fetching for news
 */

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { news, users } from "@/lib/db/schema";

const newsSelection = {
    id: news.id,
    title: news.title,
    slug: news.slug,
    excerpt: news.excerpt,
    content: news.content,
    coverImageUrl: news.coverImageUrl,
    status: news.status,
    publishedAt: news.publishedAt,
    authorId: news.authorId,
    createdAt: news.createdAt,
    updatedAt: news.updatedAt,
    author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
    }
} as const;

export type NewsRecord = NonNullable<Awaited<ReturnType<typeof getPublishedNews>>>[number];

/**
 * Get all published news articles
 */
export async function getPublishedNews(limit = 50) {
    const records = await db
        .select(newsSelection)
        .from(news)
        .leftJoin(users, eq(news.authorId, users.id))
        .where(eq(news.status, "published"))
        .orderBy(desc(news.publishedAt))
        .limit(limit);

    return records.map(formatNewsRecord);
}

/**
 * Get latest published news
 */
export async function getLatestNews(limit = 6) {
    return getPublishedNews(limit);
}

/**
 * Get news by slug
 */
export async function getNewsBySlug(slug: string) {
    const [record] = await db
        .select(newsSelection)
        .from(news)
        .leftJoin(users, eq(news.authorId, users.id))
        .where(and(eq(news.slug, slug), eq(news.status, "published")))
        .limit(1);

    if (!record) return null;
    return formatNewsRecord(record);
}

function formatNewsRecord(record: typeof newsSelection extends infer T ? { [K in keyof T]: unknown } : never) {
    return {
        id: record.id as number,
        title: record.title as string,
        slug: record.slug as string,
        excerpt: record.excerpt as string | null,
        content: record.content as string,
        coverImageUrl: record.coverImageUrl as string | null,
        status: record.status as string,
        publishedAt: record.publishedAt ? (record.publishedAt as Date).toISOString() : null,
        authorId: record.authorId as number | null,
        createdAt: (record.createdAt as Date).toISOString(),
        updatedAt: (record.updatedAt as Date).toISOString(),
        author: record.author ? {
            id: (record.author as { id: number }).id,
            name: (record.author as { name: string | null }).name,
            email: (record.author as { email: string }).email,
            avatarUrl: (record.author as { avatarUrl: string | null }).avatarUrl,
            role: (record.author as { role: string | null }).role,
        } : null,
    };
}
