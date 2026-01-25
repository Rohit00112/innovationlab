import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/service";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import { EventRegistrationForm } from "@/components/event-registration-form";
import type { EventRecord } from "@/lib/types/events";

interface EventsApiResponse {
    data: EventRecord[];
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function fetchEvent(slug: string): Promise<EventRecord | null> {
    const baseUrl = resolveApiBaseUrl();
    const url = new URL("/api/events", baseUrl);
    url.searchParams.set("slug", slug);
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    const data: EventsApiResponse = await response.json();
    return data.data[0] ?? null;
}

export default async function EventRegisterPage({ params }: PageProps) {
    const resolvedParams = await params;
    const event = await fetchEvent(resolvedParams.slug);

    if (!event) {
        notFound();
    }

    if (event.status !== "published") {
        redirect(`/events/${resolvedParams.slug}`);
    }

    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect(`/login?redirect=/events/${resolvedParams.slug}/register`);
    }

    return (
        <main className="w-full bg-background text-foreground py-10 px-6">
            <EventRegistrationForm
                eventId={event.id}
                eventSlug={event.slug}
                eventTitle={event.title}
                userEmail={session.user.email}
                userName={session.user.name ?? ""}
                enableProposalSubmission={event.enableProposalSubmission}
            />
        </main>
    );
}
