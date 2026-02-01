import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { communitySelection, generateSlug, getCommunityById, getCommunityBySlug } from "@/lib/api/resources/communities";
import { updateCommunitySchema } from "@/lib/api/validation/communities";
import { db } from "@/lib/db";
import { communities } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id: idParam } = await params;
        const id = Number.parseInt(idParam, 10);

        if (Number.isNaN(id)) {
            throw new ApiError(400, "Invalid community ID");
        }

        const community = await getCommunityById(id);

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

        return NextResponse.json({ data: community });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id: idParam } = await params;
        const id = Number.parseInt(idParam, 10);

        if (Number.isNaN(id)) {
            throw new ApiError(400, "Invalid community ID");
        }

        const existing = await getCommunityById(id);

        if (!existing) {
            throw new ApiError(404, "Community not found");
        }

        const body = await request.json().catch(() => null);
        const parsed = updateCommunitySchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const payload = parsed.data;

        // Handle slug update
        let newSlug = payload.slug;
        if (newSlug && newSlug !== existing.slug) {
            const slugExists = await getCommunityBySlug(newSlug);
            if (slugExists && slugExists.id !== id) {
                throw new ApiError(409, "Slug already in use");
            }
        }

        // Auto-update slug if name changes and slug wasn't explicitly provided
        if (payload.name && !payload.slug && payload.name !== existing.name) {
            newSlug = generateSlug(payload.name);
            const slugExists = await getCommunityBySlug(newSlug);
            if (slugExists && slugExists.id !== id) {
                newSlug = `${newSlug}-${Date.now().toString(36)}`;
            }
        }

        await db
            .update(communities)
            .set({
                ...(payload.name !== undefined && { name: payload.name }),
                ...(newSlug !== undefined && { slug: newSlug }),
                ...(payload.description !== undefined && { description: payload.description }),
                ...(payload.content !== undefined && { content: payload.content }),
                ...(payload.coverImageUrl !== undefined && { coverImageUrl: payload.coverImageUrl }),
                ...(payload.status !== undefined && { status: payload.status }),
                ...(payload.displayOrder !== undefined && { displayOrder: payload.displayOrder }),
                updatedAt: new Date()
            })
            .where(eq(communities.id, id));

        const [record] = await db
            .select(communitySelection)
            .from(communities)
            .where(eq(communities.id, id))
            .limit(1);

        return NextResponse.json({ data: record });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id: idParam } = await params;
        const id = Number.parseInt(idParam, 10);

        if (Number.isNaN(id)) {
            throw new ApiError(400, "Invalid community ID");
        }

        const existing = await getCommunityById(id);

        if (!existing) {
            throw new ApiError(404, "Community not found");
        }

        await db.delete(communities).where(eq(communities.id, id));

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
