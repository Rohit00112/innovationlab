import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Enter a valid email address"),
});

// Helper to generate token
function generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

// Helper to hash token
function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json(
            { message: "Validation failed", errors: parseResult.error.flatten() },
            { status: 400 }
        );
    }

    const email = parseResult.data.email.toLowerCase();

    try {
        // Find user
        const [user] = await db
            .select({ id: users.id, email: users.email })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        // Generate token
        const token = generateToken();
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save token to database
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        // In development, log the reset link
        // In production, you would send an email here
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

        console.log("=".repeat(60));
        console.log("PASSWORD RESET LINK (for development):");
        console.log(resetLink);
        console.log("=".repeat(60));

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("[forgot-password]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
