export const REGISTRATION_STATUSES = [
    "pending",
    "confirmed",
    "cancelled",
] as const

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number]

export const REGISTRATION_TYPES = [
    "individual",
    "team",
] as const

export type RegistrationType = (typeof REGISTRATION_TYPES)[number]

export interface SubmissionValue {
    fieldId: string
    value: string
}

export interface EventRegistrationRecord {
    id: number
    userId: number
    eventId: number
    registrationType: RegistrationType
    teamName: string | null
    participantName: string
    participantEmail: string
    participantPhone: string | null
    londonmetId: string | null
    notes: string | null
    teamMembers: string | null // JSON string
    proposalLink: string | null // deprecated, use submissions
    submissions: SubmissionValue[] | null
    status: RegistrationStatus
    createdAt: string
    user?: {
        id: number
        name: string | null
        email: string | null
        avatarUrl: string | null
    }
}

export interface PaginatedRegistrationsResponse {
    data: EventRegistrationRecord[]
    total: number
}
