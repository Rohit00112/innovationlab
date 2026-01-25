import { apiRequest } from "@/lib/http/api-client"
import {
  type CreateNewsPayload,
  type NewsRecord,
  type NewsStatus,
  type PaginatedNewsResponse,
  type UpdateNewsPayload,
} from "@/lib/types/news"

export interface NewsListFilters {
  status?: NewsStatus | "all"
  authorId?: number
  search?: string
  limit?: number
  offset?: number
  slug?: string
}

function buildQuery(params: NewsListFilters) {
  const query = new URLSearchParams()

  if (params.status && params.status !== "all") {
    query.set("status", params.status)
  }

  if (typeof params.authorId === "number") {
    query.set("authorId", String(params.authorId))
  }

  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim())
  }

  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit))
  }

  if (typeof params.offset === "number") {
    query.set("offset", String(params.offset))
  }

  if (params.slug && params.slug.trim()) {
    query.set("slug", params.slug.trim().toLowerCase())
  }

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

export async function listNews(params: NewsListFilters = {}) {
  const response = await apiRequest<PaginatedNewsResponse>(
    `/api/news${buildQuery(params)}`,
  )

  return response.data
}

export async function getNews(id: number) {
  const response = await apiRequest<{ data: NewsRecord }>(`/api/news/${id}`)
  return response.data
}

export async function getNewsBySlug(slug: string) {
  const normalized = slug.trim().toLowerCase()
  const response = await apiRequest<PaginatedNewsResponse>(
    `/api/news${buildQuery({ slug: normalized, limit: 1 })}`,
  )

  return response.data[0] ?? null
}

export async function createNews(payload: CreateNewsPayload) {
  const response = await apiRequest<{ data: NewsRecord }>(`/api/news`, {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function updateNews(id: number, payload: UpdateNewsPayload) {
  const response = await apiRequest<{ data: NewsRecord }>(`/api/news/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })

  return response.data
}

export async function deleteNews(id: number) {
  await apiRequest(`/api/news/${id}`, { method: "DELETE" })
}
