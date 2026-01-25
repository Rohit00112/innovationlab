import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const userSelection = {
  id: users.id,
  email: users.email,
  name: users.name,
  avatarUrl: users.avatarUrl,
  role: users.role,
  status: users.status,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt
} as const;

export async function getUserById(id: number) {
  const [record] = await db.select(userSelection).from(users).where(eq(users.id, id));
  return record ?? null;
}
