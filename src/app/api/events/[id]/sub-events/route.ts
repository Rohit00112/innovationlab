import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { events, users } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: List sub-events for a parent event
export async function GET(request: Request, context: RouteParams) {
    try {
        const params = await context.params;
        const parentId = Number.parseInt(params.id, 10);

        if (Number.isNaN(parentId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        // Check parent event exists
        const [parentEvent] = await db
            .select({ id: events.id, title: events.title })
            .from(events)
            .where(eq(events.id, parentId))
            .limit(1);

        if (!parentEvent) {
            throw new ApiError(404, "Parent event not found");
        }

        // Get sub-events
        const subEvents = await db
            .select({
                id: events.id,
                title: events.title,
                slug: events.slug,
                summary: events.summary,
                image: events.image,
                location: events.location,
                isVirtual: events.isVirtual,
                startsAt: events.startsAt,
                endsAt: events.endsAt,
                status: events.status,
                createdAt: events.createdAt,
                organizer: {
                    id: users.id,
                    name: users.name,
                    email: users.email,
                },
            })
            .from(events)
            .leftJoin(users, eq(events.organizerId, users.id))
            .where(eq(events.parentEventId, parentId))
            .orderBy(desc(events.startsAt));

        return NextResponse.json({
            data: subEvents,
            parentEvent: { id: parentEvent.id, title: parentEvent.title },
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}
