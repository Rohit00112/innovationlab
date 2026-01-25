import { apiRequest } from "@/lib/http/api-client";
import {
  type CreateUserPayload,
  type PaginatedUsersResponse,
  type UpdateUserPayload,
  type UserRecord,
  type UserRole,
  type UserStatus
} from "@/lib/types/users";

export interface UserListFilters {
  role?: UserRole | "all";
  status?: UserStatus | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(params: UserListFilters) {
  const query = new URLSearchParams();

  if (params.role && params.role !== "all") {
    query.set("role", params.role);
  }

  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }

  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }

  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit));
  }

  if (typeof params.offset === "number") {
    query.set("offset", String(params.offset));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function listUsers(
  params: UserListFilters = {}
): Promise<UserRecord[]> {
  const response = await apiRequest<PaginatedUsersResponse>(
    `/api/users${buildQuery(params)}`
  );

  return response.data;
}

export async function createUser(payload: CreateUserPayload) {
  const response = await apiRequest<{ data: UserRecord }>(`/api/users`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export async function updateUser(id: number, payload: UpdateUserPayload) {
  const response = await apiRequest<{ data: UserRecord }>(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export async function deleteUser(id: number) {
  await apiRequest(`/api/users/${id}`, { method: "DELETE" });
}
