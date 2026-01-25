export const USER_ROLES = [
  "admin",
  "editor",
  "author",
  "viewer"
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "invited",
  "disabled"
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserRecord {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  name?: string | null;
  avatarUrl?: string | null;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string | null;
  avatarUrl?: string | null;
  role?: UserRole;
  status?: UserStatus;
  revokeSessions?: boolean;
}

export interface PaginatedUsersResponse {
  data: UserRecord[];
}
