import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { toErrorResponse, ApiError } from "@/lib/api/errors";
import { teamMemberSelection } from "@/lib/api/resources/team";
import { createTeamMemberSchema } from "@/lib/api/validation/team";
import { db } from "@/lib/db";
import { teamMembers, teamMemberCategoryEnum } from "@/lib/db/schema";

// GET: List team members (public sees active only, admins see all)
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const activeOnly = url.searchParams.get("activeOnly") !== "false";

        // Check if user is admin (optional - don't require auth)
        let isAdmin = false;
        try {
            const user = await requireUser({ roles: ["admin"] });
            isAdmin = !!user;
        } catch {
            isAdmin = false;
        }

        const conditions = [];

        // Non-admins can only see active members
        if (!isAdmin || activeOnly) {
            conditions.push(eq(teamMembers.isActive, true));
        }

        // Filter by category
        if (category && teamMemberCategoryEnum.enumValues.includes(category as typeof teamMemberCategoryEnum.enumValues[number])) {
            conditions.push(eq(teamMembers.category, category as typeof teamMemberCategoryEnum.enumValues[number]));
        }

        const members = await db
            .select(teamMemberSelection)
            .from(teamMembers)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));

        return NextResponse.json({ data: members });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// POST: Create team member (admin only)
export async function POST(request: Request) {
    try {
        await requireUser({ roles: ["admin"] });

        const body = await request.json();
        const parsed = createTeamMemberSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(
                400,
                "Validation failed",
                parsed.error.flatten().fieldErrors
            );
        }

        const {
            name,
            position,
            bio,
            photoUrl,
            email,
            linkedinUrl,
            githubUrl,
            websiteUrl,
            category,
            displayOrder,
            isActive,
            joinedAt
        } = parsed.data;

        const [newMember] = await db
            .insert(teamMembers)
            .values({
                name,
                position,
                bio: bio ?? null,
                photoUrl: photoUrl ?? null,
                email: email ?? null,
                linkedinUrl: linkedinUrl ?? null,
                githubUrl: githubUrl ?? null,
                websiteUrl: websiteUrl ?? null,
                category,
                displayOrder,
                isActive,
                joinedAt: joinedAt ? new Date(joinedAt) : null
            })
            .returning(teamMemberSelection);

        return NextResponse.json({ data: newMember }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
