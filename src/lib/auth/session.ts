import crypto from "node:crypto";

import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { userSessions } from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "ivlab_session";
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const maxAgeSeconds = Number.parseInt(
  process.env.AUTH_SESSION_MAX_AGE ?? `${DEFAULT_MAX_AGE_SECONDS}`,
  10
);

export type CookieReader = {
  get(name: string): { value: string } | undefined;
};

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

export async function createSessionRecord(options: {
  userId: number;
  userAgent?: string;
  ipAddress?: string;
}) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + maxAgeSeconds * 1000);

  await db.insert(userSessions).values({
    userId: options.userId,
    tokenHash,
    userAgent: options.userAgent,
    ipAddress: options.ipAddress,
    expiresAt
  });

  return { token, expiresAt };
}

export function readSessionToken(cookieStore: CookieReader) {
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function findActiveSessionByToken(token: string) {
  const tokenHash = hashSessionToken(token);

  const [session] = await db
    .select()
    .from(userSessions)
    .where(
      and(
        eq(userSessions.tokenHash, tokenHash),
        eq(userSessions.status, "active"),
        gt(userSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return session ?? null;
}

export async function revokeSessionByToken(token: string) {
  const tokenHash = hashSessionToken(token);

  await db
    .update(userSessions)
    .set({ status: "revoked" })
    .where(eq(userSessions.tokenHash, tokenHash));
}

export function sessionCookieMaxAge() {
  return maxAgeSeconds;
}

export function buildSessionCookie(token: string, expiresAt: Date) {
  return {
    name: SESSION_COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: maxAgeSeconds,
      expires: expiresAt
    }
  };
}

export function buildClearSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0
    }
  };
}
