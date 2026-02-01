import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteContent } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/auth/service";

// Type for content data
export interface SiteContentRecord {
    id: number;
    pageKey: string;
    sectionKey: string;
    content: unknown;
    updatedAt: Date;
    updatedById: number | null;
}

// GET - Retrieve content for a page/section
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pageKey = searchParams.get("pageKey");
        const sectionKey = searchParams.get("sectionKey");

        if (!pageKey) {
            return NextResponse.json(
                { success: false, message: "pageKey is required" },
                { status: 400 }
            );
        }

        let result;

        if (sectionKey) {
            // Get specific section
            result = await db
                .select()
                .from(siteContent)
                .where(
                    and(
                        eq(siteContent.pageKey, pageKey),
                        eq(siteContent.sectionKey, sectionKey)
                    )
                )
                .limit(1);

            if (result.length === 0) {
                return NextResponse.json(
                    { success: true, data: null },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { success: true, data: result[0] },
                { status: 200 }
            );
        } else {
            // Get all sections for a page
            result = await db
                .select()
                .from(siteContent)
                .where(eq(siteContent.pageKey, pageKey));

            return NextResponse.json(
                { success: true, data: result },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error fetching site content:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch content" },
            { status: 500 }
        );
    }
}

// PUT - Create or update content (admin only)
export async function PUT(request: NextRequest) {
    try {
        // Check authentication
        const cookieStore = await cookies();
        const session = await getSessionUser(cookieStore);

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin or editor
        if (session.user.role !== "admin" && session.user.role !== "editor") {
            return NextResponse.json(
                { success: false, message: "Forbidden - Admin access required" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { pageKey, sectionKey, content } = body;

        if (!pageKey || !sectionKey || content === undefined) {
            return NextResponse.json(
                { success: false, message: "pageKey, sectionKey, and content are required" },
                { status: 400 }
            );
        }

        // Upsert the content
        const existing = await db
            .select()
            .from(siteContent)
            .where(
                and(
                    eq(siteContent.pageKey, pageKey),
                    eq(siteContent.sectionKey, sectionKey)
                )
            )
            .limit(1);

        let result;

        if (existing.length > 0) {
            // Update existing
            result = await db
                .update(siteContent)
                .set({
                    content,
                    updatedAt: new Date(),
                    updatedById: session.user.id
                })
                .where(
                    and(
                        eq(siteContent.pageKey, pageKey),
                        eq(siteContent.sectionKey, sectionKey)
                    )
                )
                .returning();
        } else {
            // Insert new
            result = await db
                .insert(siteContent)
                .values({
                    pageKey,
                    sectionKey,
                    content,
                    updatedById: session.user.id
                })
                .returning();
        }

        return NextResponse.json(
            { success: true, data: result[0], message: "Content saved successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving site content:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save content" },
            { status: 500 }
        );
    }
}
