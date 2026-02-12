/**
 * Server-side data fetching for events
 * Use this directly in server components instead of HTTP fetches
 */

import { and, eq, gte, isNull, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, users } from "@/lib/db/schema";
import type { SubmissionField, EventDocument } from "@/lib/types/events";
import type { UserRole } from "@/lib/types/users";

const eventSelection = {
    id: events.id,
    title: events.title,
    slug: events.slug,
    summary: events.summary,
    description: events.description,
    location: events.location,
    registrationUrl: events.registrationUrl,
    image: events.image,
    isVirtual: events.isVirtual,
    hasRegistration: events.hasRegistration,
    allowedRegistrationTypes: events.allowedRegistrationTypes,
    enableProposalSubmission: events.enableProposalSubmission,
    minParticipants: events.minParticipants,
    maxParticipants: events.maxParticipants,
    submissionFields: events.submissionFields,
    startsAt: events.startsAt,
    endsAt: events.endsAt,
    status: events.status,
    publishedAt: events.publishedAt,
    organizerId: events.organizerId,
    parentEventId: events.parentEventId,
    documents: events.documents,
    displayOrder: events.displayOrder,
    createdAt: events.createdAt,
    updatedAt: events.updatedAt,
    organizer: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        role: users.role,
    }
} as const;

export type EventRecord = NonNullable<Awaited<ReturnType<typeof getPublishedEvents>>>[number];

/**
 * Get all published events (excluding sub-events by default)
 */
export async function getPublishedEvents(options?: { includeSubEvents?: boolean; limit?: number }) {
    const { includeSubEvents = false, limit = 50 } = options ?? {};

    const filters = [
        eq(events.status, "published"),
    ];

    if (!includeSubEvents) {
        filters.push(isNull(events.parentEventId));
    }

    const records = await db
        .select(eventSelection)
        .from(events)
        .leftJoin(users, eq(events.organizerId, users.id))
        .where(and(...filters))
        .orderBy(asc(events.startsAt))
        .limit(limit);

    return records.map(formatEventRecord);
}

/**
 * Get upcoming published events
 */
export async function getUpcomingEvents(limit = 10) {
    const now = new Date();

    const records = await db
        .select(eventSelection)
        .from(events)
        .leftJoin(users, eq(events.organizerId, users.id))
        .where(and(
            eq(events.status, "published"),
            gte(events.startsAt, now),
            isNull(events.parentEventId)
        ))
        .orderBy(asc(events.startsAt))
        .limit(limit);

    return records.map(formatEventRecord);
}

/**
 * Get event by slug
 */
export async function getEventBySlug(slug: string) {
    const [record] = await db
        .select(eventSelection)
        .from(events)
        .leftJoin(users, eq(events.organizerId, users.id))
        .where(eq(events.slug, slug))
        .limit(1);

    if (!record) return null;
    return formatEventRecord(record);
}

/**
 * Get event by ID
 */
export async function getEventById(id: number) {
    const [record] = await db
        .select(eventSelection)
        .from(events)
        .leftJoin(users, eq(events.organizerId, users.id))
        .where(eq(events.id, id))
        .limit(1);

    if (!record) return null;
    return formatEventRecord(record);
}

/**
 * Get sub-events for a parent event
 */
export async function getSubEvents(parentEventId: number) {
    const records = await db
        .select(eventSelection)
        .from(events)
        .leftJoin(users, eq(events.organizerId, users.id))
        .where(and(
            eq(events.parentEventId, parentEventId),
            eq(events.status, "published")
        ))
        .orderBy(asc(events.displayOrder), asc(events.startsAt));

    return records.map(formatEventRecord);
}

function formatEventRecord(record: typeof eventSelection extends infer T ? { [K in keyof T]: unknown } : never) {
    return {
        id: record.id as number,
        title: record.title as string,
        slug: record.slug as string,
        summary: record.summary as string | null,
        description: record.description as string | null,
        location: record.location as string | null,
        registrationUrl: record.registrationUrl as string | null,
        image: record.image as string | null,
        isVirtual: record.isVirtual as boolean,
        hasRegistration: record.hasRegistration as boolean,
        allowedRegistrationTypes: record.allowedRegistrationTypes as "individual" | "team" | "both",
        enableProposalSubmission: record.enableProposalSubmission as boolean,
        minParticipants: record.minParticipants as number | null,
        maxParticipants: record.maxParticipants as number | null,
        submissionFields: record.submissionFields as SubmissionField[] | null,
        startsAt: (record.startsAt as Date).toISOString(),
        endsAt: record.endsAt ? (record.endsAt as Date).toISOString() : null,
        status: record.status as "draft" | "published" | "cancelled",
        publishedAt: record.publishedAt ? (record.publishedAt as Date).toISOString() : null,
        organizerId: record.organizerId as number | null,
        parentEventId: record.parentEventId as number | null,
        documents: record.documents as EventDocument[] | null,
        displayOrder: record.displayOrder as number,
        createdAt: (record.createdAt as Date).toISOString(),
        updatedAt: (record.updatedAt as Date).toISOString(),
        organizer: record.organizer ? {
            id: (record.organizer as { id: number }).id,
            name: (record.organizer as { name: string | null }).name,
            email: (record.organizer as { email: string }).email,
            avatarUrl: (record.organizer as { avatarUrl: string | null }).avatarUrl,
            role: (record.organizer as { role: UserRole }).role,
        } : null,
    };
}
