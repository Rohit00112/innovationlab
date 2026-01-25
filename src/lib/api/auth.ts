import { cookies } from "next/headers";

import { getSessionUser } from "@/lib/auth/service";
import type { PublicUser } from "@/lib/auth/service";
import { userRoleEnum } from "@/lib/db/schema";

import { ApiError } from "./errors";

export type SessionWithUser = NonNullable<Awaited<ReturnType<typeof getSessionUser>>>;

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export async function requireUser(options?: { roles?: UserRole[] }) {
  const cookieStore = await cookies();
  const session = await getSessionUser(cookieStore);

  if (!session) {
    throw new ApiError(401, "Authentication required");
  }

  if (session.user.status !== "active") {
    throw new ApiError(403, "Account disabled");
  }

  if (options?.roles && !options.roles.includes(session.user.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }

  return session as SessionWithUser;
}

export function assertRole(user: PublicUser, roles: UserRole[]) {
  if (!roles.includes(user.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }
}
