import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { communities } from "@/lib/db/schema";

export const communitySelection = {
    id: communities.id,
    name: communities.name,
    slug: communities.slug,
    description: communities.description,
    content: communities.content,
    coverImageUrl: communities.coverImageUrl,
    status: communities.status,
    displayOrder: communities.displayOrder,
    createdAt: communities.createdAt,
    updatedAt: communities.updatedAt
} as const;

export async function getCommunityById(id: number) {
    const [record] = await db.select(communitySelection).from(communities).where(eq(communities.id, id));
    return record ?? null;
}

export async function getCommunityBySlug(slug: string) {
    const [record] = await db.select(communitySelection).from(communities).where(eq(communities.slug, slug));
    return record ?? null;
}

export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 200);
}
