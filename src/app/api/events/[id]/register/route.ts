import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { eventRegistrations, events } from "@/lib/db/schema";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const teamMemberSchema = z.object({
    name: z.string(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
});

const registrationSchema = z.object({
    registrationType: z.enum(["individual", "team"]).default("individual"),
    teamName: z.string().optional(),
    participantName: z.string().min(1, "Name is required"),
    participantEmail: z.string().email("Valid email is required"),
    participantPhone: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    teamMembers: z.array(teamMemberSchema).optional(),
    proposalLink: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
});

// POST: Register current user for the event
export async function POST(request: Request, context: RouteParams) {
    try {
        const session = await requireUser();
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        const body = await request.json();
        const parsed = registrationSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, parsed.error.issues[0]?.message ?? "Invalid input");
        }

        const data = parsed.data;

        // Validate team registration
        if (data.registrationType === "team" && !data.teamName?.trim()) {
            throw new ApiError(400, "Team name is required for team registration");
        }

        // Check event exists and is published
        const [event] = await db
            .select({
                id: events.id,
                status: events.status,
                startsAt: events.startsAt,
                enableProposalSubmission: events.enableProposalSubmission
            })
            .from(events)
            .where(eq(events.id, eventId))
            .limit(1);

        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        if (event.status !== "published") {
            throw new ApiError(400, "Event is not accepting registrations");
        }

        // Validate proposal link if enabled
        // Note: We make it optional in schema but can enforce it here if needed, 
        // strictly speaking user requirement didn't say it's mandatory, but usually implied. 
        // For now let's keep it optional in validation but save it if present.

        // Check if already registered
        const [existing] = await db
            .select({ id: eventRegistrations.id })
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.userId, session.user.id),
                    eq(eventRegistrations.eventId, eventId)
                )
            )
            .limit(1);

        if (existing) {
            throw new ApiError(409, "Already registered for this event");
        }

        // Create registration with enhanced data
        const [registration] = await db
            .insert(eventRegistrations)
            .values({
                userId: session.user.id,
                eventId,
                registrationType: data.registrationType,
                teamName: data.registrationType === "team" ? data.teamName?.trim() ?? null : null,
                participantName: data.participantName.trim(),
                participantEmail: data.participantEmail.trim(),
                participantPhone: data.participantPhone?.trim() ?? null,
                notes: data.notes?.trim() ?? null,
                proposalLink: event.enableProposalSubmission ? data.proposalLink?.trim() || null : null,
                teamMembers: data.teamMembers && data.teamMembers.length > 0
                    ? JSON.stringify(data.teamMembers.filter(m => m.name.trim() || m.email))
                    : null,
                status: "confirmed",
            })
            .returning();

        return NextResponse.json({ data: registration }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// DELETE: Cancel registration
export async function DELETE(request: Request, context: RouteParams) {
    try {
        const session = await requireUser();
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        // Find and delete registration
        const [deleted] = await db
            .delete(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.userId, session.user.id),
                    eq(eventRegistrations.eventId, eventId)
                )
            )
            .returning({ id: eventRegistrations.id });

        if (!deleted) {
            throw new ApiError(404, "Registration not found");
        }

        return NextResponse.json({ message: "Registration cancelled" });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// GET: Check registration status for current user
export async function GET(request: Request, context: RouteParams) {
    try {
        const session = await requireUser();
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        const [registration] = await db
            .select()
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.userId, session.user.id),
                    eq(eventRegistrations.eventId, eventId)
                )
            )
            .limit(1);

        return NextResponse.json({
            isRegistered: !!registration,
            registration: registration ?? null
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}
