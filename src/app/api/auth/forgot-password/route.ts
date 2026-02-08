import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/service";
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

        // Build and send reset email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your Password – Innovation Lab",
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
                                <span style="color: #fff; font-size: 24px; font-weight: bold;">🔒</span>
                            </div>
                            <h1 style="margin: 0; font-size: 24px; color: #1a1a2e; font-weight: 700;">Reset Your Password</h1>
                        </div>

                        <p style="font-size: 16px; color: #444; line-height: 1.6; margin-bottom: 24px;">
                            We received a request to reset your password. Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.
                        </p>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                Reset Password
                            </a>
                        </div>

                        <p style="font-size: 14px; color: #666; line-height: 1.6;">
                            If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
                        </p>

                        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
                            <p style="font-size: 12px; color: #999; margin: 0; word-break: break-all;">
                                If the button doesn't work, copy and paste this link into your browser:<br>
                                <a href="${resetLink}" style="color: #6366f1;">${resetLink}</a>
                            </p>
                        </div>

                        <div style="margin-top: 24px; text-align: center;">
                            <p style="font-size: 13px; color: #999; margin: 0;">
                                Innovation Lab · Itahari International College
                            </p>
                            <p style="font-size: 12px; color: #bbb; margin: 8px 0 0 0;">
                                This is an automated email. Please do not reply.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
        });

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("[forgot-password]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
