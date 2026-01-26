import type { UserRole } from "./users"

export const EVENT_STATUSES = [
  "draft",
  "published",
  "cancelled",
] as const

export type EventStatus = (typeof EVENT_STATUSES)[number]

export const ALLOWED_REGISTRATION_TYPES = [
  "individual",
  "team",
  "both",
] as const

export type AllowedRegistrationType = (typeof ALLOWED_REGISTRATION_TYPES)[number]

export interface EventOrganizer {
  id: number
  name: string | null
  email: string | null
  avatarUrl: string | null
  role: UserRole | null
}

export interface EventDocument {
  title: string
  url: string
}

export interface EventRecord {
  id: number
  title: string
  slug: string
  summary: string | null
  description: string | null
  location: string | null
  registrationUrl: string | null
  image: string | null
  isVirtual: boolean
  hasRegistration: boolean
  allowedRegistrationTypes: AllowedRegistrationType
  enableProposalSubmission: boolean
  startsAt: string
  endsAt: string | null
  status: EventStatus
  publishedAt: string | null
  organizerId: number | null
  parentEventId: number | null
  documents: EventDocument[] | null
  createdAt: string
  updatedAt: string
  organizer: EventOrganizer | null
  subEventCount?: number
}

export interface CreateEventPayload {
  title: string
  slug: string
  summary?: string | null
  description?: string | null
  location?: string | null
  registrationUrl?: string | null
  image?: string | null
  isVirtual?: boolean
  startsAt: string
  endsAt?: string | null
  status?: EventStatus
  publishedAt?: string | null
  organizerId?: number | null
  parentEventId?: number | null
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> { }

export interface PaginatedEventsResponse {
  data: EventRecord[]
}
