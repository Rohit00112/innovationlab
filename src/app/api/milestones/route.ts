import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { toErrorResponse, ApiError } from "@/lib/api/errors";
import { milestoneSelection } from "@/lib/api/resources/milestones";
import { createMilestoneSchema } from "@/lib/api/validation/milestones";
import { db } from "@/lib/db";
import { milestones } from "@/lib/db/schema";

// GET: List milestones (public)
export async function GET() {
    try {
        const data = await db
            .select(milestoneSelection)
            .from(milestones)
            .orderBy(asc(milestones.displayOrder), asc(milestones.year));

        return NextResponse.json({ data });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// POST: Create milestone (admin only)
export async function POST(request: Request) {
    try {
        await requireUser({ roles: ["admin"] });

        const body = await request.json();
        const parsed = createMilestoneSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(
                400,
                "Validation failed",
                parsed.error.flatten().fieldErrors
            );
        }

        const { year, title, description, displayOrder } = parsed.data;

        const [newMilestone] = await db
            .insert(milestones)
            .values({
                year,
                title,
                description: description ?? null,
                displayOrder,
            })
            .returning(milestoneSelection);

        return NextResponse.json({ data: newMilestone }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
