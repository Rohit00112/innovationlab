import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { requireUser } from "@/lib/api/auth"
import { ApiError, toErrorResponse } from "@/lib/api/errors"
import { db } from "@/lib/db"
import { eventRegistrations } from "@/lib/db/schema"

interface RouteParams {
    params: Promise<{ id: string; registrationId: string }>
}

const updateStatusSchema = z.object({
    status: z.enum(["confirmed", "pending", "cancelled"]),
})

// PATCH: Update registration status
export async function PATCH(request: Request, context: RouteParams) {
    try {
        await requireUser({ roles: ["admin", "editor"] })
        const params = await context.params
        const registrationId = Number.parseInt(params.registrationId, 10)

        if (Number.isNaN(registrationId)) {
            throw new ApiError(400, "Invalid registration ID")
        }

        const body = await request.json()
        const parsed = updateStatusSchema.safeParse(body)

        if (!parsed.success) {
            throw new ApiError(400, parsed.error.issues[0]?.message ?? "Invalid input")
        }

        const [existing] = await db
            .select({ id: eventRegistrations.id })
            .from(eventRegistrations)
            .where(eq(eventRegistrations.id, registrationId))
            .limit(1)

        if (!existing) {
            throw new ApiError(404, "Registration not found")
        }

        const [updated] = await db
            .update(eventRegistrations)
            .set({ status: parsed.data.status })
            .where(eq(eventRegistrations.id, registrationId))
            .returning()

        return NextResponse.json({ data: updated })
    } catch (error) {
        return toErrorResponse(error)
    }
}

// DELETE: Remove a registration
export async function DELETE(request: Request, context: RouteParams) {
    try {
        await requireUser({ roles: ["admin", "editor"] })
        const params = await context.params
        const registrationId = Number.parseInt(params.registrationId, 10)

        if (Number.isNaN(registrationId)) {
            throw new ApiError(400, "Invalid registration ID")
        }

        const [existing] = await db
            .select({ id: eventRegistrations.id })
            .from(eventRegistrations)
            .where(eq(eventRegistrations.id, registrationId))
            .limit(1)

        if (!existing) {
            throw new ApiError(404, "Registration not found")
        }

        await db
            .delete(eventRegistrations)
            .where(eq(eventRegistrations.id, registrationId))

        return NextResponse.json({ message: "Registration deleted" })
    } catch (error) {
        return toErrorResponse(error)
    }
}
