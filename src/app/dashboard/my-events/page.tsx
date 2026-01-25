import { cookies } from "next/headers";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

import { getSessionUser } from "@/lib/auth/service";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventRegistration {
    id: number;
    status: string;
    createdAt: string;
    event: {
        id: number;
        title: string;
        slug: string;
        image: string | null;
        startsAt: string;
        endsAt: string | null;
        location: string | null;
        isVirtual: boolean;
        status: string;
    } | null;
}

interface RegistrationsResponse {
    data: EventRegistration[];
}

async function fetchUserRegistrations(): Promise<EventRegistration[]> {
    const baseUrl = resolveApiBaseUrl();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session_token");

    const response = await fetch(`${baseUrl}/api/user/registrations`, {
        headers: {
            Cookie: sessionCookie ? `session_token=${sessionCookie.value}` : "",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return [];
    }

    const data: RegistrationsResponse = await response.json();
    return data.data;
}

export default async function MyEventsPage() {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        return (
            <div className="container mx-auto py-10 px-4">
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground mb-4">
                            Please log in to view your registered events.
                        </p>
                        <Link href="/login?redirect=/dashboard/my-events">
                            <Button>Log in</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const registrations = await fetchUserRegistrations();

    const upcomingEvents = registrations.filter(
        (r) => r.event && new Date(r.event.startsAt) > new Date()
    );
    const pastEvents = registrations.filter(
        (r) => r.event && new Date(r.event.startsAt) <= new Date()
    );

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                <p className="text-muted-foreground mt-2">
                    Events you&apos;ve registered for
                </p>
            </div>

            {registrations.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground mb-4">
                            You haven&apos;t registered for any events yet.
                        </p>
                        <Link href="/events">
                            <Button>Browse Events</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {upcomingEvents.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingEvents.map((registration) => (
                                    <EventCard key={registration.id} registration={registration} />
                                ))}
                            </div>
                        </section>
                    )}

                    {pastEvents.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pastEvents.map((registration) => (
                                    <EventCard key={registration.id} registration={registration} isPast />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

function EventCard({
    registration,
    isPast = false,
}: {
    registration: EventRegistration;
    isPast?: boolean;
}) {
    if (!registration.event) return null;

    const { event } = registration;

    return (
        <Card className={isPast ? "opacity-75" : ""}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                        {format(new Date(event.startsAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.isVirtual ? "Online" : event.location || "TBA"}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${registration.status === "confirmed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                    >
                        {registration.status}
                    </span>
                    <Link href={`/events/${event.slug}`}>
                        <Button variant="ghost" size="sm">
                            View <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
