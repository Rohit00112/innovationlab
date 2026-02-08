import { NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";

import { optionalUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { eventRegistrations, events } from "@/lib/db/schema";
import { sendEmail, buildRegistrationConfirmationEmail } from "@/lib/email/service";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const teamMemberSchema = z.object({
    name: z.string(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    londonmetId: z.string().optional().or(z.literal("")),
});

const submissionValueSchema = z.object({
    fieldId: z.string().min(1),
    value: z.string().min(1, "Submission value is required"),
});

const registrationSchema = z.object({
    registrationType: z.enum(["individual", "team"]).default("individual"),
    teamName: z.string().optional(),
    participantName: z.string().min(1, "Name is required"),
    participantEmail: z.string().email("Valid email is required"),
    participantPhone: z.string().optional().nullable(),
    londonmetId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    teamMembers: z.array(teamMemberSchema).optional(),
    proposalLink: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")), // deprecated
    submissions: z.array(submissionValueSchema).optional().nullable(),
});

// POST: Register for the event (no authentication required)
export async function POST(request: Request, context: RouteParams) {
    try {
        const session = await optionalUser();
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
                title: events.title,
                status: events.status,
                startsAt: events.startsAt,
                maxParticipants: events.maxParticipants,
                enableProposalSubmission: events.enableProposalSubmission,
                submissionFields: events.submissionFields
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

        // Enforce maximum participant limit
        if (event.maxParticipants) {
            const [result] = await db
                .select({ total: count() })
                .from(eventRegistrations)
                .where(
                    and(
                        eq(eventRegistrations.eventId, eventId),
                        eq(eventRegistrations.status, "confirmed")
                    )
                );

            if (result.total >= event.maxParticipants) {
                throw new ApiError(400, `Registration is full. Maximum ${event.maxParticipants} participants allowed.`);
            }
        }

        // Validate required submissions
        if (event.enableProposalSubmission && event.submissionFields) {
            const submissionFields = event.submissionFields as Array<{ id: string; title: string; required: boolean }>;
            const submittedFieldIds = new Set((data.submissions ?? []).map(s => s.fieldId));

            for (const field of submissionFields) {
                if (field.required && !submittedFieldIds.has(field.id)) {
                    throw new ApiError(400, `${field.title} is required`);
                }
            }
        }

        // Check if already registered (by email)
        const [existing] = await db
            .select({ id: eventRegistrations.id })
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.participantEmail, data.participantEmail.trim()),
                    eq(eventRegistrations.eventId, eventId)
                )
            )
            .limit(1);

        if (existing) {
            throw new ApiError(409, "This email is already registered for this event");
        }

        // Create registration with enhanced data
        const [registration] = await db
            .insert(eventRegistrations)
            .values({
                userId: session?.user.id ?? null,
                eventId,
                registrationType: data.registrationType,
                teamName: data.registrationType === "team" ? data.teamName?.trim() ?? null : null,
                participantName: data.participantName.trim(),
                participantEmail: data.participantEmail.trim(),
                participantPhone: data.participantPhone?.trim() ?? null,
                londonmetId: data.londonmetId?.trim() ?? null,
                notes: data.notes?.trim() ?? null,
                proposalLink: data.proposalLink?.trim() || null, // deprecated, kept for backward compatibility
                submissions: event.enableProposalSubmission && data.submissions?.length
                    ? data.submissions
                    : null,
                teamMembers: data.teamMembers && data.teamMembers.length > 0
                    ? JSON.stringify(data.teamMembers.filter(m => m.name.trim() || m.email))
                    : null,
                status: "confirmed",
            })
            .returning();

        // Send confirmation emails (non-blocking)
        const teamMembersParsed = data.teamMembers?.filter(m => m.name.trim() || m.email) ?? []
        const emailData = {
            eventTitle: event.title,
            participantName: data.participantName.trim(),
            registrationType: data.registrationType,
            teamName: data.teamName?.trim(),
            teamMembers: teamMembersParsed.length > 0
                ? teamMembersParsed.map(m => ({ name: m.name, email: m.email, londonmetId: m.londonmetId }))
                : null,
        }

        const { subject, html } = buildRegistrationConfirmationEmail(emailData)

        // Collect all email addresses: leader + team members
        const emailRecipients = new Set<string>()
        emailRecipients.add(data.participantEmail.trim())
        if (data.registrationType === "team" && teamMembersParsed.length > 0) {
            for (const member of teamMembersParsed) {
                if (member.email?.trim()) {
                    emailRecipients.add(member.email.trim())
                }
            }
        }

        // Send emails in the background (don't block the response)
        Promise.all(
            Array.from(emailRecipients).map(email =>
                sendEmail({ to: email, subject, html })
            )
        ).catch(err => console.error("[registration-email] Error:", err))

        return NextResponse.json({ data: registration }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// DELETE: Cancel registration
export async function DELETE(request: Request, context: RouteParams) {
    try {
        const session = await optionalUser();
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        if (!session) {
            throw new ApiError(401, "Authentication required to cancel registration");
        }

        // Find the registration for the logged-in user
        const [registration] = await db
            .select({ id: eventRegistrations.id, createdAt: eventRegistrations.createdAt })
            .from(eventRegistrations)
            .where(
                and(
                    eq(eventRegistrations.userId, session.user.id),
                    eq(eventRegistrations.eventId, eventId)
                )
            )
            .limit(1);

        if (!registration) {
            throw new ApiError(404, "Registration not found");
        }

        // Enforce 24-hour cancellation window
        const registeredAt = new Date(registration.createdAt);
        const now = new Date();
        const hoursSinceRegistration = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceRegistration > 24) {
            throw new ApiError(403, "Cancellation window has expired. Registrations can only be cancelled within 24 hours.");
        }

        // Delete registration
        await db
            .delete(eventRegistrations)
            .where(eq(eventRegistrations.id, registration.id));

        return NextResponse.json({ message: "Registration cancelled" });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// GET: Check registration status for current user
export async function GET(request: Request, context: RouteParams) {
    try {
        const session = await optionalUser();
        const params = await context.params;
        const eventId = Number.parseInt(params.id, 10);

        if (Number.isNaN(eventId)) {
            throw new ApiError(400, "Invalid event ID");
        }

        // If not authenticated, return not registered
        if (!session) {
            return NextResponse.json({
                isRegistered: false,
                registration: null
            });
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
