import type { PaginatedRegistrationsResponse } from "@/lib/types/registrations"

export async function getEventRegistrations(
    eventId: number
): Promise<PaginatedRegistrationsResponse> {
    const response = await fetch(`/api/events/${eventId}/registrations`, {
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch event registrations")
    }

    return response.json()
}
