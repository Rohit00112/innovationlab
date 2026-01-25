import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { userSessions, users } from "@/lib/db/schema";

import { hashPassword, verifyPassword } from "./password";
import {
  buildClearSessionCookie,
  buildSessionCookie,
  CookieReader,
  createSessionRecord,
  findActiveSessionByToken,
  readSessionToken,
  revokeSessionByToken
} from "./session";
import type { LoginInput, RegisterInput } from "./validation";

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "AuthError";
  }
}

export type UserRecord = typeof users.$inferSelect;
export type PublicUser = Omit<UserRecord, "hashedPassword">;

function sanitizeUser(user: UserRecord): PublicUser {
  const { hashedPassword, ...rest } = user;
  return rest;
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new AuthError("Email already in use", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const [created] = await db
    .insert(users)
    .values({
      email,
      hashedPassword: passwordHash,
      name: input.name ?? null,
      role: input.role ?? "viewer",
      status: "active"
    })
    .returning();

  return sanitizeUser(created);
}

export async function authenticateUser(input: LoginInput) {
  const email = input.email.toLowerCase();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (user.status !== "active") {
    throw new AuthError("Account is not active", 403);
  }

  const isValidPassword = await verifyPassword(input.password, user.hashedPassword);

  if (!isValidPassword) {
    throw new AuthError("Invalid email or password", 401);
  }

  await db
    .update(users)
    .set({ updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return sanitizeUser(user);
}

export async function startUserSession(options: {
  userId: number;
  userAgent?: string;
  ipAddress?: string;
}) {
  const { token, expiresAt } = await createSessionRecord({
    userId: options.userId,
    userAgent: options.userAgent,
    ipAddress: options.ipAddress
  });

  return {
    token,
    expiresAt,
    cookie: buildSessionCookie(token, expiresAt)
  };
}

export async function getSessionUser(cookieStore: CookieReader) {
  const token = readSessionToken(cookieStore);

  if (!token) {
    return null;
  }

  const session = await findActiveSessionByToken(token);

  if (!session) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.id, session.userId), eq(users.status, "active")))
    .limit(1);

  if (!user) {
    return null;
  }

  return {
    user: sanitizeUser(user),
    sessionToken: token,
    sessionRecord: session
  };
}

export async function endUserSession(cookieStore: CookieReader) {
  const token = readSessionToken(cookieStore);

  if (!token) {
    return null;
  }

  await revokeSessionByToken(token);
  return buildClearSessionCookie();
}

export async function revokeUserSessions(userId: number) {
  await db
    .update(userSessions)
    .set({ status: "revoked" })
    .where(eq(userSessions.userId, userId));
}

export { sanitizeUser };
