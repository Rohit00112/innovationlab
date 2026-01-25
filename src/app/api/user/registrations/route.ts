import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { eventRegistrations, events } from "@/lib/db/schema";

// GET: List current user's event registrations
export async function GET() {
    try {
        const session = await requireUser();

        const registrations = await db
            .select({
                id: eventRegistrations.id,
                status: eventRegistrations.status,
                createdAt: eventRegistrations.createdAt,
                event: {
                    id: events.id,
                    title: events.title,
                    slug: events.slug,
                    image: events.image,
                    startsAt: events.startsAt,
                    endsAt: events.endsAt,
                    location: events.location,
                    isVirtual: events.isVirtual,
                    status: events.status,
                },
            })
            .from(eventRegistrations)
            .leftJoin(events, eq(eventRegistrations.eventId, events.id))
            .where(eq(eventRegistrations.userId, session.user.id))
            .orderBy(desc(events.startsAt));

        return NextResponse.json({ data: registrations });
    } catch (error) {
        return toErrorResponse(error);
    }
}
