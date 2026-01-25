import { NextResponse } from "next/server";
import { eq, and, gt, isNull } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { z } from "zod";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(128, "Password must be at most 128 characters long"),
});

// Helper to hash token (must match forgot-password route)
function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    const parseResult = resetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: parseResult.error.flatten() },
            { status: 400 }
        );
    }

    const { token, password } = parseResult.data;
    const tokenHash = hashToken(token);

    try {
        // Find valid token
        const [resetToken] = await db
            .select()
            .from(passwordResetTokens)
            .where(
                and(
                    eq(passwordResetTokens.tokenHash, tokenHash),
                    gt(passwordResetTokens.expiresAt, new Date()),
                    isNull(passwordResetTokens.usedAt)
                )
            )
            .limit(1);

        if (!resetToken) {
            return NextResponse.json(
                { message: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update user password
        await db
            .update(users)
            .set({
                hashedPassword,
                updatedAt: new Date()
            })
            .where(eq(users.id, resetToken.userId));

        // Mark token as used
        await db
            .update(passwordResetTokens)
            .set({ usedAt: new Date() })
            .where(eq(passwordResetTokens.id, resetToken.id));

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("[reset-password]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
