import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";

import { toErrorResponse } from "@/lib/api/errors";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

// GET: List public team members (admins, editors, authors)
export async function GET() {
    try {
        const teamMembers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                avatarUrl: users.avatarUrl,
                role: users.role,
            })
            .from(users)
            .where(
                and(
                    eq(users.status, "active"),
                    inArray(users.role, ["admin", "editor", "author"])
                )
            );

        // Sanitize data - only show name and avatar publicly
        const publicMembers = teamMembers.map((member) => ({
            id: member.id,
            name: member.name || "Team Member",
            avatarUrl: member.avatarUrl,
            role: member.role,
        }));

        return NextResponse.json({ data: publicMembers });
    } catch (error) {
        return toErrorResponse(error);
    }
}
