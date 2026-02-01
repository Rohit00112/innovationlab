import { NextResponse } from "next/server";
import { and, asc, desc, eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getCommunityById } from "@/lib/api/resources/communities";
import { communityMemberSelection } from "@/lib/api/resources/community-members";
import { createCommunityMemberSchema } from "@/lib/api/validation/community-members";
import { db } from "@/lib/db";
import { communityMembers, communityMemberRoleEnum } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id: idParam } = await params;
        const communityId = Number.parseInt(idParam, 10);

        if (Number.isNaN(communityId)) {
            throw new ApiError(400, "Invalid community ID");
        }

        const community = await getCommunityById(communityId);

        if (!community) {
            throw new ApiError(404, "Community not found");
        }

        // Check if user is admin for seeing non-published communities
        let isAdmin = false;
        try {
            await requireUser({ roles: ["admin"] });
            isAdmin = true;
        } catch {
            // Not admin
        }

        if (!isAdmin && community.status !== "published") {
            throw new ApiError(404, "Community not found");
        }

        const url = new URL(request.url);
        const roleParam = url.searchParams.get("role");
        const activeOnly = url.searchParams.get("activeOnly") !== "false"; // Default true for public

        const filters: Array<ReturnType<typeof eq>> = [eq(communityMembers.communityId, communityId)];

        if (roleParam) {
            if (!communityMemberRoleEnum.enumValues.includes(roleParam as (typeof communityMemberRoleEnum.enumValues)[number])) {
                throw new ApiError(400, "Invalid role filter");
            }
            filters.push(eq(communityMembers.role, roleParam as (typeof communityMemberRoleEnum.enumValues)[number]));
        }

        // Only show active members to non-admins
        if (!isAdmin || activeOnly) {
            filters.push(eq(communityMembers.isActive, true));
        }

        const items = await db
            .select(communityMemberSelection)
            .from(communityMembers)
            .where(and(...filters))
            .orderBy(asc(communityMembers.displayOrder), desc(communityMembers.createdAt));

        return NextResponse.json({ data: items });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function POST(request: Request, { params }: RouteParams) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id: idParam } = await params;
        const communityId = Number.parseInt(idParam, 10);

        if (Number.isNaN(communityId)) {
            throw new ApiError(400, "Invalid community ID");
        }

        const community = await getCommunityById(communityId);

        if (!community) {
            throw new ApiError(404, "Community not found");
        }

        const body = await request.json().catch(() => null);
        const parsed = createCommunityMemberSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const payload = parsed.data;

        const [created] = await db
            .insert(communityMembers)
            .values({
                communityId,
                name: payload.name,
                title: payload.title ?? null,
                email: payload.email ?? null,
                bio: payload.bio ?? null,
                avatarUrl: payload.avatarUrl ?? null,
                role: payload.role ?? "member",
                linkedinUrl: payload.linkedinUrl ?? null,
                githubUrl: payload.githubUrl ?? null,
                websiteUrl: payload.websiteUrl ?? null,
                displayOrder: payload.displayOrder ?? 0,
                isActive: payload.isActive ?? true,
                joinedAt: payload.joinedAt ? new Date(payload.joinedAt) : null
            })
            .returning({ id: communityMembers.id });

        const [record] = await db
            .select(communityMemberSelection)
            .from(communityMembers)
            .where(eq(communityMembers.id, created.id))
            .limit(1);

        return NextResponse.json({ data: record }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
