import type { PublicUser } from "./service";

export function canManageContent(user: PublicUser, ownerId?: number | null) {
  if (user.role === "admin" || user.role === "editor") {
    return true;
  }

  if (user.role === "author") {
    return typeof ownerId === "number" && ownerId === user.id;
  }

  return false;
}
