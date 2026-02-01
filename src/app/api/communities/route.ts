import { NextResponse } from "next/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { communitySelection, generateSlug, getCommunityBySlug } from "@/lib/api/resources/communities";
import { createCommunitySchema } from "@/lib/api/validation/communities";
import { db } from "@/lib/db";
import { communities, communityStatusEnum } from "@/lib/db/schema";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const statusParam = url.searchParams.get("status");
        const limitParam = url.searchParams.get("limit");
        const offsetParam = url.searchParams.get("offset");
        const includeCount = url.searchParams.get("includeCount") === "true";

        // Check if user is admin for seeing all communities
        let isAdmin = false;
        try {
            await requireUser({ roles: ["admin"] });
            isAdmin = true;
        } catch {
            // Not admin, only show published
        }

        let statusFilter: (typeof communityStatusEnum.enumValues)[number] | undefined;

        if (statusParam) {
            if (!communityStatusEnum.enumValues.includes(statusParam as (typeof communityStatusEnum.enumValues)[number])) {
                throw new ApiError(400, "Invalid status filter");
            }
            statusFilter = statusParam as (typeof communityStatusEnum.enumValues)[number];
        }

        // Non-admins can only see published communities
        if (!isAdmin) {
            statusFilter = "published";
        }

        const limit = limitParam ? Math.min(100, Math.max(1, Number.parseInt(limitParam, 10))) : 50;
        const offset = offsetParam ? Math.max(0, Number.parseInt(offsetParam, 10) || 0) : 0;

        const filters: Array<ReturnType<typeof eq>> = [];

        if (statusFilter) {
            filters.push(eq(communities.status, statusFilter));
        }

        if (includeCount) {
            // Query with member count
            const baseQuery = db
                .select({
                    ...communitySelection,
                    memberCount: sql<number>`(SELECT COUNT(*) FROM community_members WHERE community_id = ${communities.id})`.as("member_count")
                })
                .from(communities);

            const filteredQuery = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery;

            const items = await filteredQuery
                .orderBy(asc(communities.displayOrder), desc(communities.createdAt))
                .limit(limit)
                .offset(offset);

            return NextResponse.json({ data: items });
        }

        const baseQuery = db.select(communitySelection).from(communities);
        const filteredQuery = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery;

        const items = await filteredQuery
            .orderBy(asc(communities.displayOrder), desc(communities.createdAt))
            .limit(limit)
            .offset(offset);

        return NextResponse.json({ data: items });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        await requireUser({ roles: ["admin"] });
        const body = await request.json().catch(() => null);

        const parsed = createCommunitySchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const payload = parsed.data;

        // Generate slug if not provided
        let slug = payload.slug ?? generateSlug(payload.name);

        // Check if slug already exists
        const existing = await getCommunityBySlug(slug);
        if (existing) {
            // Append a random suffix
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        const [created] = await db
            .insert(communities)
            .values({
                name: payload.name,
                slug,
                description: payload.description ?? null,
                content: payload.content ?? null,
                coverImageUrl: payload.coverImageUrl ?? null,
                status: payload.status ?? "draft",
                displayOrder: payload.displayOrder ?? 0
            })
            .returning({ id: communities.id });

        const [record] = await db
            .select(communitySelection)
            .from(communities)
            .where(eq(communities.id, created.id))
            .limit(1);

        return NextResponse.json({ data: record }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
