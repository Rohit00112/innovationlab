import { apiRequest } from "@/lib/http/api-client"
import {
  type CreateEventPayload,
  type PaginatedEventsResponse,
  type EventRecord,
  type EventStatus,
  type UpdateEventPayload,
} from "@/lib/types/events"

export interface EventListFilters {
  status?: EventStatus | "all"
  isVirtual?: boolean
  search?: string
  slug?: string
  from?: string
  to?: string
  organizerId?: number
  limit?: number
  offset?: number
}

function buildQuery(params: EventListFilters) {
  const query = new URLSearchParams()

  if (params.status && params.status !== "all") {
    query.set("status", params.status)
  }

  if (typeof params.isVirtual === "boolean") {
    query.set("isVirtual", String(params.isVirtual))
  }

  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim())
  }

  if (params.slug && params.slug.trim()) {
    query.set("slug", params.slug.trim().toLowerCase())
  }

  if (params.from) {
    query.set("from", params.from)
  }

  if (params.to) {
    query.set("to", params.to)
  }

  if (typeof params.organizerId === "number") {
    query.set("organizerId", String(params.organizerId))
  }

  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit))
  }

  if (typeof params.offset === "number") {
    query.set("offset", String(params.offset))
  }

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

export async function listEvents(params: EventListFilters = {}): Promise<EventRecord[]> {
  // Add includeSubEvents=true for admin dashboard to see all events
  const queryParams = { ...params }
  const queryString = buildQuery(queryParams)
  const url = queryString ? `/api/events${queryString}&includeSubEvents=true` : `/api/events?includeSubEvents=true`
  const response = await apiRequest<PaginatedEventsResponse>(url)

  return response.data
}

export async function getEventBySlug(slug: string): Promise<EventRecord | null> {
  const normalized = slug.trim().toLowerCase()

  if (!normalized) {
    return null
  }

  const results = await listEvents({ slug: normalized, limit: 1 })

  return results.length > 0 ? results[0] : null
}

export async function createEvent(payload: CreateEventPayload) {
  const response = await apiRequest<{ data: EventRecord }>(`/api/events`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function updateEvent(id: number, payload: UpdateEventPayload) {
  const response = await apiRequest<{ data: EventRecord }>(`/api/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function deleteEvent(id: number) {
  await apiRequest(`/api/events/${id}`, { method: "DELETE" })
}

export interface BulkActionResult {
  action: string
  affected: number
  ids: number[]
  status?: EventStatus
}

export async function bulkDeleteEvents(ids: number[]) {
  const response = await apiRequest<{ data: BulkActionResult }>(`/api/events/bulk`, {
    method: "POST",
    body: JSON.stringify({ action: "delete", ids }),
  })

  return response.data
}

export async function bulkUpdateEventStatus(ids: number[], status: EventStatus) {
  const response = await apiRequest<{ data: BulkActionResult }>(`/api/events/bulk`, {
    method: "POST",
    body: JSON.stringify({ action: "updateStatus", ids, status }),
  })

  return response.data
}
