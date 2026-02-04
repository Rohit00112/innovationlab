/**
 * Server-side data fetching for team members
 */

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export type TeamMemberRecord = NonNullable<Awaited<ReturnType<typeof getActiveTeamMembers>>>[number];

/**
 * Get all active team members
 */
export async function getActiveTeamMembers() {
    const records = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.isActive, true))
        .orderBy(asc(teamMembers.displayOrder));

    return records.map(record => ({
        id: record.id,
        name: record.name,
        position: record.position,
        bio: record.bio,
        photoUrl: record.photoUrl,
        email: record.email,
        linkedinUrl: record.linkedinUrl,
        githubUrl: record.githubUrl,
        websiteUrl: record.websiteUrl,
        category: record.category,
        displayOrder: record.displayOrder,
        isActive: record.isActive,
        joinedAt: record.joinedAt?.toISOString() ?? null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}

/**
 * Get team members by category
 */
export async function getTeamMembersByCategory(category: "head" | "core" | "mentor") {
    const records = await db
        .select()
        .from(teamMembers)
        .where(and(
            eq(teamMembers.isActive, true),
            eq(teamMembers.category, category)
        ))
        .orderBy(asc(teamMembers.displayOrder));

    return records.map(record => ({
        id: record.id,
        name: record.name,
        position: record.position,
        bio: record.bio,
        photoUrl: record.photoUrl,
        email: record.email,
        linkedinUrl: record.linkedinUrl,
        githubUrl: record.githubUrl,
        websiteUrl: record.websiteUrl,
        category: record.category,
        displayOrder: record.displayOrder,
        isActive: record.isActive,
        joinedAt: record.joinedAt?.toISOString() ?? null,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    }));
}
