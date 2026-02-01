import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

export const teamMemberSelection = {
    id: teamMembers.id,
    name: teamMembers.name,
    position: teamMembers.position,
    bio: teamMembers.bio,
    photoUrl: teamMembers.photoUrl,
    email: teamMembers.email,
    linkedinUrl: teamMembers.linkedinUrl,
    githubUrl: teamMembers.githubUrl,
    websiteUrl: teamMembers.websiteUrl,
    category: teamMembers.category,
    displayOrder: teamMembers.displayOrder,
    isActive: teamMembers.isActive,
    joinedAt: teamMembers.joinedAt,
    createdAt: teamMembers.createdAt,
    updatedAt: teamMembers.updatedAt
};

export async function getTeamMemberById(id: number) {
    const [member] = await db
        .select(teamMemberSelection)
        .from(teamMembers)
        .where(eq(teamMembers.id, id))
        .limit(1);

    return member ?? null;
}
