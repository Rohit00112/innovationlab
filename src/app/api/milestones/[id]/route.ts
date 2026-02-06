import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getMilestoneById, milestoneSelection } from "@/lib/api/resources/milestones";
import { updateMilestoneSchema } from "@/lib/api/validation/milestones";
import { db } from "@/lib/db";
import { milestones } from "@/lib/db/schema";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Get single milestone
export async function GET(_request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const milestoneId = Number.parseInt(id, 10);

        if (Number.isNaN(milestoneId)) {
            throw new ApiError(400, "Invalid milestone ID");
        }

        const milestone = await getMilestoneById(milestoneId);

        if (!milestone) {
            throw new ApiError(404, "Milestone not found");
        }

        return NextResponse.json({ data: milestone });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// PATCH: Update milestone (admin only)
export async function PATCH(request: Request, context: RouteContext) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id } = await context.params;
        const milestoneId = Number.parseInt(id, 10);

        if (Number.isNaN(milestoneId)) {
            throw new ApiError(400, "Invalid milestone ID");
        }

        const existing = await getMilestoneById(milestoneId);

        if (!existing) {
            throw new ApiError(404, "Milestone not found");
        }

        const body = await request.json();
        const parsed = updateMilestoneSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(
                400,
                "Validation failed",
                parsed.error.flatten().fieldErrors
            );
        }

        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (parsed.data.year !== undefined) updateData.year = parsed.data.year;
        if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
        if (parsed.data.description !== undefined) updateData.description = parsed.data.description ?? null;
        if (parsed.data.displayOrder !== undefined) updateData.displayOrder = parsed.data.displayOrder;

        const [updated] = await db
            .update(milestones)
            .set(updateData)
            .where(eq(milestones.id, milestoneId))
            .returning(milestoneSelection);

        return NextResponse.json({ data: updated });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// PUT: Update milestone (admin only) — alias for PATCH
export async function PUT(request: Request, context: RouteContext) {
    return PATCH(request, context);
}

// DELETE: Delete milestone (admin only)
export async function DELETE(_request: Request, context: RouteContext) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id } = await context.params;
        const milestoneId = Number.parseInt(id, 10);

        if (Number.isNaN(milestoneId)) {
            throw new ApiError(400, "Invalid milestone ID");
        }

        const existing = await getMilestoneById(milestoneId);

        if (!existing) {
            throw new ApiError(404, "Milestone not found");
        }

        await db.delete(milestones).where(eq(milestones.id, milestoneId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return toErrorResponse(error);
    }
}
