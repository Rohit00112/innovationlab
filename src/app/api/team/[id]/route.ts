import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getTeamMemberById, teamMemberSelection } from "@/lib/api/resources/team";
import { updateTeamMemberSchema } from "@/lib/api/validation/team";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// GET: Get single team member
export async function GET(request: Request, context: RouteContext) {
    try {
        const { id } = await context.params;
        const memberId = Number.parseInt(id, 10);

        if (Number.isNaN(memberId)) {
            throw new ApiError(400, "Invalid team member ID");
        }

        const member = await getTeamMemberById(memberId);

        if (!member) {
            throw new ApiError(404, "Team member not found");
        }

        // Check access - non-admins can only see active members
        let isAdmin = false;
        try {
            const user = await requireUser({ roles: ["admin"] });
            isAdmin = !!user;
        } catch {
            isAdmin = false;
        }

        if (!isAdmin && !member.isActive) {
            throw new ApiError(404, "Team member not found");
        }

        return NextResponse.json({ data: member });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// PATCH: Update team member (admin only)
export async function PATCH(request: Request, context: RouteContext) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id } = await context.params;
        const memberId = Number.parseInt(id, 10);

        if (Number.isNaN(memberId)) {
            throw new ApiError(400, "Invalid team member ID");
        }

        const existingMember = await getTeamMemberById(memberId);

        if (!existingMember) {
            throw new ApiError(404, "Team member not found");
        }

        const body = await request.json();
        const parsed = updateTeamMemberSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(
                400,
                "Validation failed",
                parsed.error.flatten().fieldErrors
            );
        }

        const updateData: Record<string, unknown> = {
            updatedAt: new Date()
        };

        if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
        if (parsed.data.position !== undefined) updateData.position = parsed.data.position;
        if (parsed.data.bio !== undefined) updateData.bio = parsed.data.bio ?? null;
        if (parsed.data.photoUrl !== undefined) updateData.photoUrl = parsed.data.photoUrl ?? null;
        if (parsed.data.email !== undefined) updateData.email = parsed.data.email ?? null;
        if (parsed.data.linkedinUrl !== undefined) updateData.linkedinUrl = parsed.data.linkedinUrl ?? null;
        if (parsed.data.githubUrl !== undefined) updateData.githubUrl = parsed.data.githubUrl ?? null;
        if (parsed.data.websiteUrl !== undefined) updateData.websiteUrl = parsed.data.websiteUrl ?? null;
        if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
        if (parsed.data.displayOrder !== undefined) updateData.displayOrder = parsed.data.displayOrder;
        if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;
        if (parsed.data.joinedAt !== undefined) {
            updateData.joinedAt = parsed.data.joinedAt ? new Date(parsed.data.joinedAt) : null;
        }

        const [updatedMember] = await db
            .update(teamMembers)
            .set(updateData)
            .where(eq(teamMembers.id, memberId))
            .returning(teamMemberSelection);

        return NextResponse.json({ data: updatedMember });
    } catch (error) {
        return toErrorResponse(error);
    }
}

// DELETE: Delete team member (admin only)
export async function DELETE(request: Request, context: RouteContext) {
    try {
        await requireUser({ roles: ["admin"] });

        const { id } = await context.params;
        const memberId = Number.parseInt(id, 10);

        if (Number.isNaN(memberId)) {
            throw new ApiError(400, "Invalid team member ID");
        }

        const existingMember = await getTeamMemberById(memberId);

        if (!existingMember) {
            throw new ApiError(404, "Team member not found");
        }

        await db.delete(teamMembers).where(eq(teamMembers.id, memberId));

        return NextResponse.json({ success: true });
    } catch (error) {
        return toErrorResponse(error);
    }
}
