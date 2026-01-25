import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { z } from "zod";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be at most 128 characters long"),
});

export async function POST(request: Request) {
    try {
        const session = await requireUser();
        const body = await request.json().catch(() => null);

        const parseResult = changePasswordSchema.safeParse(body);

        if (!parseResult.success) {
            throw new ApiError(400, "Validation failed", parseResult.error.flatten());
        }

        const { currentPassword, newPassword } = parseResult.data;

        // Get user with password
        const [user] = await db
            .select({ hashedPassword: users.hashedPassword })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Verify current password
        const isValidPassword = await verifyPassword(currentPassword, user.hashedPassword);

        if (!isValidPassword) {
            throw new ApiError(400, "Current password is incorrect");
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await db
            .update(users)
            .set({
                hashedPassword,
                updatedAt: new Date()
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ message: "Password changed successfully" });
    } catch (error) {
        return toErrorResponse(error);
    }
}
