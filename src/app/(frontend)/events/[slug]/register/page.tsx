import { notFound, redirect } from "next/navigation";

import { getEventBySlug } from "@/lib/data/events";
import { EventRegistrationForm } from "@/components/event-registration-form";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function EventRegisterPage({ params }: PageProps) {
    const resolvedParams = await params;
    const event = await getEventBySlug(resolvedParams.slug);

    if (!event) {
        notFound();
    }

    if (event.status !== "published") {
        redirect(`/events/${resolvedParams.slug}`);
    }

    return (
        <main className="w-full bg-background text-foreground py-10 px-6">
            <EventRegistrationForm
                eventId={event.id}
                eventSlug={event.slug}
                eventTitle={event.title}
                enableProposalSubmission={event.enableProposalSubmission}
                submissionFields={event.submissionFields}
                allowedRegistrationTypes={event.allowedRegistrationTypes}
                minParticipants={event.minParticipants}
                maxParticipants={event.maxParticipants}
            />
        </main>
    );
}
