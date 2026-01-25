import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { eventRegistrations, events, users } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET: List all registrations for an event (admin/editor only)
export async function GET(request: Request, context: RouteParams) {
    try {
        const session = await requireUser({ roles: ["admin", "editor"] });
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        // Check event exists
        const [event] = await db
            .select({ id: events.id, title: events.title })
            .from(events)
            .where(eq(events.id, eventId))
            .limit(1);

        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        // Get all registrations with user info and enhanced fields
        const registrations = await db
            .select({
                id: eventRegistrations.id,
                registrationType: eventRegistrations.registrationType,
                teamName: eventRegistrations.teamName,
                participantName: eventRegistrations.participantName,
                participantEmail: eventRegistrations.participantEmail,
                participantPhone: eventRegistrations.participantPhone,
                notes: eventRegistrations.notes,
                teamMembers: eventRegistrations.teamMembers,
                status: eventRegistrations.status,
                createdAt: eventRegistrations.createdAt,
                user: {
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    avatarUrl: users.avatarUrl,
                },
            })
            .from(eventRegistrations)
            .leftJoin(users, eq(eventRegistrations.userId, users.id))
            .where(eq(eventRegistrations.eventId, eventId))
            .orderBy(desc(eventRegistrations.createdAt));

        return NextResponse.json({
            data: registrations,
            event: { id: event.id, title: event.title },
            total: registrations.length
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}
