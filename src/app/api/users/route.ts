import { NextResponse } from "next/server";
import { and, desc, eq, ilike } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { userSelection } from "@/lib/api/resources/users";
import { createUserSchema } from "@/lib/api/validation/users";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { userRoleEnum, userStatusEnum, users } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    await requireUser({ roles: ["admin"] });

    const url = new URL(request.url);
    const roleParam = url.searchParams.get("role");
    const statusParam = url.searchParams.get("status");
    const searchParam = url.searchParams.get("search");
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    let roleFilter: (typeof userRoleEnum.enumValues)[number] | undefined;

    if (roleParam) {
      if (!userRoleEnum.enumValues.includes(roleParam as (typeof userRoleEnum.enumValues)[number])) {
        throw new ApiError(400, "Invalid role filter");
      }

      roleFilter = roleParam as (typeof userRoleEnum.enumValues)[number];
    }

    let statusFilter: (typeof userStatusEnum.enumValues)[number] | undefined;

    if (statusParam) {
      if (!userStatusEnum.enumValues.includes(statusParam as (typeof userStatusEnum.enumValues)[number])) {
        throw new ApiError(400, "Invalid status filter");
      }

      statusFilter = statusParam as (typeof userStatusEnum.enumValues)[number];
    }

    const limit = limitParam ? Math.min(100, Math.max(1, Number.parseInt(limitParam, 10))) : 50;
    const offset = offsetParam ? Math.max(0, Number.parseInt(offsetParam, 10) || 0) : 0;

    const filters: Array<ReturnType<typeof eq>> = [];

    if (roleFilter) {
      filters.push(eq(users.role, roleFilter));
    }

    if (statusFilter) {
      filters.push(eq(users.status, statusFilter));
    }

    if (searchParam) {
      const searchTerm = `%${searchParam}%`;
      filters.push(ilike(users.email, searchTerm));
    }

    const baseQuery = db.select(userSelection).from(users);
    const filteredQuery = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery;

    const items = await filteredQuery
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data: items });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireUser({ roles: ["admin"] });
    const body = await request.json().catch(() => null);

    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const email = payload.email.toLowerCase();

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new ApiError(409, "Email already in use");
    }

    const passwordHash = await hashPassword(payload.password);

    const [created] = await db
      .insert(users)
      .values({
        email,
        hashedPassword: passwordHash,
        name: payload.name?.trim() ?? null,
        avatarUrl: payload.avatarUrl?.trim() ?? null,
        role: payload.role ?? "viewer",
        status: payload.status ?? "active"
      })
      .returning({ id: users.id });

    const [record] = await db
      .select(userSelection)
      .from(users)
      .where(eq(users.id, created.id))
      .limit(1);

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
