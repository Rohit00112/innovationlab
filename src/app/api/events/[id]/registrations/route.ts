import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSessionUser } from "@/lib/auth/service"
import { db } from "@/lib/db"
import { eventRegistrations, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies()
        const session = await getSessionUser(cookieStore)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const eventId = parseInt(params.id)
        if (isNaN(eventId)) {
            return NextResponse.json({ error: "Invalid event ID" }, { status: 400 })
        }

        // Fetch all registrations for this event with user details
        const registrations = await db
            .select({
                id: eventRegistrations.id,
                userId: eventRegistrations.userId,
                eventId: eventRegistrations.eventId,
                registrationType: eventRegistrations.registrationType,
                teamName: eventRegistrations.teamName,
                participantName: eventRegistrations.participantName,
                participantEmail: eventRegistrations.participantEmail,
                participantPhone: eventRegistrations.participantPhone,
                notes: eventRegistrations.notes,
                teamMembers: eventRegistrations.teamMembers,
                proposalLink: eventRegistrations.proposalLink,
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
            .orderBy(eventRegistrations.createdAt)

        return NextResponse.json({
            data: registrations,
            total: registrations.length,
        })
    } catch (error) {
        console.error("Error fetching event registrations:", error)
        return NextResponse.json(
            { error: "Failed to fetch registrations" },
            { status: 500 }
        )
    }
}
