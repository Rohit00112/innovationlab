import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { EVENT_STATUSES, type EventStatus } from "@/lib/types/events";
import { z } from "zod";

const bulkDeleteSchema = z.object({
    action: z.literal("delete"),
    ids: z.array(z.number().int().positive()).min(1).max(100),
});

const bulkUpdateStatusSchema = z.object({
    action: z.literal("updateStatus"),
    ids: z.array(z.number().int().positive()).min(1).max(100),
    status: z.enum(EVENT_STATUSES),
});

const bulkActionSchema = z.union([bulkDeleteSchema, bulkUpdateStatusSchema]);

export async function POST(request: Request) {
    try {
        await requireUser({ roles: ["admin", "editor"] });
        const body = await request.json().catch(() => null);

        const parsed = bulkActionSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const payload = parsed.data;

        if (payload.action === "delete") {
            const deleted = await db
                .delete(events)
                .where(inArray(events.id, payload.ids))
                .returning({ id: events.id });

            return NextResponse.json({
                data: {
                    action: "delete",
                    affected: deleted.length,
                    ids: deleted.map((d) => d.id),
                },
            });
        }

        if (payload.action === "updateStatus") {
            const now = new Date();
            const updateData: { status: EventStatus; publishedAt?: Date } = {
                status: payload.status,
            };

            // Set publishedAt when publishing for the first time
            if (payload.status === "published") {
                updateData.publishedAt = now;
            }

            const updated = await db
                .update(events)
                .set({
                    ...updateData,
                    updatedAt: now,
                })
                .where(inArray(events.id, payload.ids))
                .returning({ id: events.id });

            return NextResponse.json({
                data: {
                    action: "updateStatus",
                    status: payload.status,
                    affected: updated.length,
                    ids: updated.map((u) => u.id),
                },
            });
        }

        throw new ApiError(400, "Unknown action");
    } catch (error) {
        return toErrorResponse(error);
    }
}
