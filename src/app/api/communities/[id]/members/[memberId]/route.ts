import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getCommunityById } from "@/lib/api/resources/communities";
import { communityMemberSelection, getCommunityMemberById } from "@/lib/api/resources/community-members";
import { updateCommunityMemberSchema } from "@/lib/api/validation/community-members";
import { db } from "@/lib/db";
import { communityMembers } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string; memberId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id: idParam, memberId: memberIdParam } = await params;
        const communityId = Number.parseInt(idParam, 10);
        const memberId = Number.parseInt(memberIdParam, 10);

        if (Number.isNaN(communityId)) {
            throw new ApiError(400, "Invalid community ID");
        }

        if (Number.isNaN(memberId)) {
            throw new ApiError(400, "Invalid member ID");
        }

        const community = await getCommunityById(communityId);

        if (!community) {
            throw new ApiError(404, "Community not found");
        }

        const existingMember = await getCommunityMemberById(memberId, communityId);

        if (!existingMember) {
            throw new ApiError(404, "Member not found");
        }

        const body = await request.json().catch(() => null);
        const parsed = updateCommunityMemberSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const payload = parsed.data;

        await db
            .update(communityMembers)
            .set({
                ...(payload.name !== undefined && { name: payload.name }),
                ...(payload.title !== undefined && { title: payload.title }),
                ...(payload.email !== undefined && { email: payload.email }),
                ...(payload.bio !== undefined && { bio: payload.bio }),
                ...(payload.avatarUrl !== undefined && { avatarUrl: payload.avatarUrl }),
                ...(payload.role !== undefined && { role: payload.role }),
                ...(payload.linkedinUrl !== undefined && { linkedinUrl: payload.linkedinUrl }),
                ...(payload.githubUrl !== undefined && { githubUrl: payload.githubUrl }),
                ...(payload.websiteUrl !== undefined && { websiteUrl: payload.websiteUrl }),
                ...(payload.displayOrder !== undefined && { displayOrder: payload.displayOrder }),
                ...(payload.isActive !== undefined && { isActive: payload.isActive }),
                ...(payload.joinedAt !== undefined && { joinedAt: payload.joinedAt ? new Date(payload.joinedAt) : null }),
                updatedAt: new Date()
            })
            .where(eq(communityMembers.id, memberId));

        const [record] = await db
            .select(communityMemberSelection)
            .from(communityMembers)
            .where(eq(communityMembers.id, memberId))
            .limit(1);

        return NextResponse.json({ data: record });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id: idParam, memberId: memberIdParam } = await params;
        const communityId = Number.parseInt(idParam, 10);
        const memberId = Number.parseInt(memberIdParam, 10);

        if (Number.isNaN(communityId)) {
            throw new ApiError(400, "Invalid community ID");
        }

        if (Number.isNaN(memberId)) {
            throw new ApiError(400, "Invalid member ID");
        }

        const community = await getCommunityById(communityId);

        if (!community) {
            throw new ApiError(404, "Community not found");
        }

        const existingMember = await getCommunityMemberById(memberId, communityId);

        if (!existingMember) {
            throw new ApiError(404, "Member not found");
        }

        await db.delete(communityMembers).where(eq(communityMembers.id, memberId));

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
