/**
 * Server-side data fetching for site content (CMS)
 */

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";

/**
 * Get site content by page and section key
 */
export async function getSiteContent<T = unknown>(pageKey: string, sectionKey: string): Promise<T | null> {
    const [record] = await db
        .select()
        .from(siteContent)
        .where(and(
            eq(siteContent.pageKey, pageKey),
            eq(siteContent.sectionKey, sectionKey)
        ))
        .limit(1);

    if (!record) return null;
    return record.content as T;
}

/**
 * Get all content for a page
 */
export async function getPageContent(pageKey: string) {
    const records = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.pageKey, pageKey));

    const contentMap: Record<string, unknown> = {};
    for (const record of records) {
        contentMap[record.sectionKey] = record.content;
    }
    return contentMap;
}
