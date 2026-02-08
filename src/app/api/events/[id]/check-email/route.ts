import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"

import { ApiError, toErrorResponse } from "@/lib/api/errors"
import { db } from "@/lib/db"
import { eventRegistrations } from "@/lib/db/schema"

interface RouteParams {
    params: Promise<{ id: string }>
}

// GET: Check if an email is already registered for this event
// Query params: ?email=someone@iic.edu.np
export async function GET(request: NextRequest, context: RouteParams) {
    try {
        const params = await context.params
        const eventId = Number.parseInt(params.id, 10)

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID")
        }

        const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase()

        if (!email) {
            return NextResponse.json({ exists: false })
        }

        // Check in main registrations (leader's email)
        const [directMatch] = await db
            .select({
                id: eventRegistrations.id,
            })
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.eventId, eventId),
                    eq(eventRegistrations.participantEmail, email),
                    eq(eventRegistrations.status, "confirmed")
                )
            )
            .limit(1)

        if (directMatch) {
            return NextResponse.json({
                exists: true,
                message: "This email is already registered for this event",
            })
        }

        // Check in team members (stored as JSON string in teamMembers column)
        const teamRegistrations = await db
            .select({
                id: eventRegistrations.id,
                teamMembers: eventRegistrations.teamMembers,
            })
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.eventId, eventId),
                    eq(eventRegistrations.status, "confirmed")
                )
            )

        for (const reg of teamRegistrations) {
            if (!reg.teamMembers) continue
            try {
                const members = JSON.parse(reg.teamMembers) as Array<{ email?: string }>
                if (members.some(m => m.email?.trim().toLowerCase() === email)) {
                    return NextResponse.json({
                        exists: true,
                        message: "This email is already registered as a team member for this event",
                    })
                }
            } catch {
                // skip malformed JSON
            }
        }

        return NextResponse.json({ exists: false })
    } catch (error) {
        return toErrorResponse(error)
    }
}
