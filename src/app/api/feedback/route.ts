
import { db } from "@/lib/db";
import { feedbacks } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
    message: z.string().min(1, "Message is required"),
    email: z.string().email().optional().or(z.literal("")),
    category: z.enum(["suggestion", "issue", "other"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = feedbackSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid input", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { message, email, category } = result.data;

        await db.insert(feedbacks).values({
            message,
            email: email || null,
            category,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
