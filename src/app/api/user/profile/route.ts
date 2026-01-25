import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { z } from "zod";

const updateProfileSchema = z.object({
    name: z.string().min(1).max(120).optional(),
    avatarUrl: z.string().url().optional().nullable(),
});

// GET: Get current user's profile
export async function GET() {
    try {
        const session = await requireUser();

        return NextResponse.json({
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                avatarUrl: session.user.avatarUrl,
                role: session.user.role,
                createdAt: session.user.createdAt,
            },
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// PATCH: Update user profile
export async function PATCH(request: Request) {
    try {
        const session = await requireUser();
        const body = await request.json().catch(() => null);

        const parseResult = updateProfileSchema.safeParse(body);

        if (!parseResult.success) {
            throw new ApiError(400, "Validation failed", parseResult.error.flatten());
        }

        const updates: Record<string, unknown> = { updatedAt: new Date() };

        if (parseResult.data.name !== undefined) {
            updates.name = parseResult.data.name.trim();
        }

        if (parseResult.data.avatarUrl !== undefined) {
            updates.avatarUrl = parseResult.data.avatarUrl;
        }

        const [updated] = await db
            .update(users)
            .set(updates)
            .where(eq(users.id, session.user.id))
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                avatarUrl: users.avatarUrl,
                role: users.role,
            });

        return NextResponse.json({ user: updated });
    } catch (error) {
        return toErrorResponse(error);
    }
}
