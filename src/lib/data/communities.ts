/**
 * Server-side data fetching for communities
 */

import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { communities, communityMembers } from "@/lib/db/schema";

export type CommunityRecord = NonNullable<Awaited<ReturnType<typeof getPublishedCommunities>>>[number];

/**
 * Get all published communities with member count
 */
export async function getPublishedCommunities() {
    const records = await db
        .select({
            id: communities.id,
            name: communities.name,
            slug: communities.slug,
            description: communities.description,
            content: communities.content,
            coverImageUrl: communities.coverImageUrl,
            status: communities.status,
            displayOrder: communities.displayOrder,
            createdAt: communities.createdAt,
            updatedAt: communities.updatedAt,
            memberCount: sql<number>`(
                SELECT COUNT(*) FROM ${communityMembers}
                WHERE ${communityMembers.communityId} = ${communities.id}
                AND ${communityMembers.isActive} = true
            )`.as("member_count"),
        })
        .from(communities)
        .where(eq(communities.status, "published"))
        .orderBy(asc(communities.displayOrder));

    return records.map(record => ({
        id: record.id,
        name: record.name,
        slug: record.slug,
        description: record.description,
        content: record.content,
        coverImageUrl: record.coverImageUrl,
        status: record.status,
        displayOrder: record.displayOrder,
        memberCount: Number(record.memberCount) || 0,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}

/**
 * Get community by slug with members
 */
export async function getCommunityBySlug(slug: string) {
    const [record] = await db
        .select()
        .from(communities)
        .where(and(
            eq(communities.slug, slug),
            eq(communities.status, "published")
        ))
        .limit(1);

    if (!record) return null;

    const members = await db
        .select()
        .from(communityMembers)
        .where(and(
            eq(communityMembers.communityId, record.id),
            eq(communityMembers.isActive, true)
        ))
        .orderBy(asc(communityMembers.displayOrder));

    return {
        id: record.id,
        name: record.name,
        slug: record.slug,
        description: record.description,
        content: record.content,
        coverImageUrl: record.coverImageUrl,
        status: record.status,
        displayOrder: record.displayOrder,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
        members: members.map(m => ({
            id: m.id,
            name: m.name,
            title: m.title,
            email: m.email,
            bio: m.bio,
            avatarUrl: m.avatarUrl,
            role: m.role,
            linkedinUrl: m.linkedinUrl,
            githubUrl: m.githubUrl,
            websiteUrl: m.websiteUrl,
            displayOrder: m.displayOrder,
        })),
    };
}
