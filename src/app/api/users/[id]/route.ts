import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { getUserById, userSelection } from "@/lib/api/resources/users";
import { updateUserSchema } from "@/lib/api/validation/users";
import { hashPassword } from "@/lib/auth/password";
import { revokeUserSessions } from "@/lib/auth/service";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

function parseId(param: string) {
  const value = Number.parseInt(param, 10);

  if (Number.isNaN(value) || value <= 0) {
    throw new ApiError(400, "Invalid id parameter");
  }

  return value;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireUser({ roles: ["admin"] });
    const id = parseId(params.id);
    const record = await getUserById(id);

    if (!record) {
      throw new ApiError(404, "User not found");
    }

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
  await requireUser({ roles: ["admin"] });
    const id = parseId(params.id);
    const existing = await getUserById(id);

    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    const body = await request.json().catch(() => null);
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
  const updates: Partial<typeof users.$inferInsert> = {};
  let modified = false;
  let passwordUpdated = false;

    if (payload.email !== undefined) {
      const email = payload.email.toLowerCase();

      if (email !== existing.email) {
        const [emailConflict] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (emailConflict && emailConflict.id !== id) {
          throw new ApiError(409, "Email already in use");
        }
      }

      updates.email = email;
      modified = true;
    }

    if (payload.password !== undefined) {
      updates.hashedPassword = await hashPassword(payload.password);
      passwordUpdated = true;
      modified = true;
    }

    if (payload.name !== undefined) {
      updates.name = payload.name?.trim() ?? null;
      modified = true;
    }

    if (payload.avatarUrl !== undefined) {
      updates.avatarUrl = payload.avatarUrl?.trim() ?? null;
      modified = true;
    }

    if (payload.role !== undefined) {
      updates.role = payload.role;
      modified = true;
    }

    if (payload.status !== undefined) {
      updates.status = payload.status;
      modified = true;
    }

    if (!modified) {
      if (payload.revokeSessions) {
        await revokeUserSessions(id);
      }

      return NextResponse.json({ data: existing });
    }

    updates.updatedAt = new Date();

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id));

    if (passwordUpdated || payload.status === "disabled" || payload.revokeSessions) {
      await revokeUserSessions(id);
    }

    const [record] = await db
      .select(userSelection)
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return NextResponse.json({ data: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireUser({ roles: ["admin"] });
    const id = parseId(params.id);
    const existing = await getUserById(id);

    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    await db
      .update(users)
      .set({ status: "disabled", updatedAt: new Date() })
      .where(eq(users.id, id));

    await revokeUserSessions(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
