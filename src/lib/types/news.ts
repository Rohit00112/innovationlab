import type { UserRole } from "./users"

export const NEWS_STATUSES = [
  "draft",
  "scheduled",
  "published",
  "archived"
] as const

export type NewsStatus = (typeof NEWS_STATUSES)[number]

export interface NewsAuthor {
  id: number
  name: string | null
  email: string | null
  avatarUrl: string | null
  role: UserRole | null
}

export interface NewsRecord {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImageUrl: string | null
  status: NewsStatus
  publishedAt: string | null
  authorId: number | null
  createdAt: string
  updatedAt: string
  author: NewsAuthor | null
}

export interface CreateNewsPayload {
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImageUrl?: string | null
  status?: NewsStatus
  publishedAt?: string | null
}

export interface UpdateNewsPayload extends Partial<CreateNewsPayload> {}

export interface PaginatedNewsResponse {
  data: NewsRecord[]
}
