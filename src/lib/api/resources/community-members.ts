import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { communityMembers } from "@/lib/db/schema";

export const communityMemberSelection = {
    id: communityMembers.id,
    communityId: communityMembers.communityId,
    name: communityMembers.name,
    title: communityMembers.title,
    email: communityMembers.email,
    bio: communityMembers.bio,
    avatarUrl: communityMembers.avatarUrl,
    role: communityMembers.role,
    linkedinUrl: communityMembers.linkedinUrl,
    githubUrl: communityMembers.githubUrl,
    websiteUrl: communityMembers.websiteUrl,
    displayOrder: communityMembers.displayOrder,
    isActive: communityMembers.isActive,
    joinedAt: communityMembers.joinedAt,
    createdAt: communityMembers.createdAt,
    updatedAt: communityMembers.updatedAt
} as const;

export async function getCommunityMemberById(id: number, communityId?: number) {
    const filters = [eq(communityMembers.id, id)];
    if (communityId !== undefined) {
        filters.push(eq(communityMembers.communityId, communityId));
    }

    const [record] = await db
        .select(communityMemberSelection)
        .from(communityMembers)
        .where(and(...filters));

    return record ?? null;
}
