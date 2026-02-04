"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    Clock,
    Layers,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    EventFiltersComponent,
    filterEvents,
    type EventFilters,
} from "@/components/events/event-filters";
import type { EventRecord } from "@/lib/types/events";

function formatSchedule(event: EventRecord) {
    const start = new Date(event.startsAt);

    if (Number.isNaN(start.getTime())) {
        return { date: "Date coming soon", time: "Time to be announced" };
    }

    const date = start.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });

    const startTime = start.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });

    if (!event.endsAt) {
        return { date, time: startTime };
    }

    const end = new Date(event.endsAt);

    if (Number.isNaN(end.getTime())) {
        return { date, time: startTime };
    }

    const endTime = end.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });

    return {
        date,
        time: `${startTime} – ${endTime}`,
    };
}

function getLocationLabel(event: EventRecord) {
    if (event.isVirtual) {
        return "Remote";
    }

    if (event.location && event.location.trim()) {
        return event.location.trim();
    }

    return "Location to be announced";
}

function getEventSummary(event: EventRecord) {
    if (event.summary && event.summary.trim()) {
        return event.summary.trim();
    }

    return "Further details coming soon.";
}

interface EventsListClientProps {
    events: EventRecord[];
}

export function EventsListClient({ events }: EventsListClientProps) {
    const [filters, setFilters] = useState<EventFilters>({
        search: "",
        timeFrame: "all",
        locationType: "all",
    });

    const filteredEvents = useMemo(
        () => filterEvents(events, filters),
        [events, filters]
    );

    return (
        <>
            <div className="mb-10">
                <EventFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    totalCount={events.length}
                    filteredCount={filteredEvents.length}
                />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full border border-dashed border-border p-12 text-center rounded-3xl bg-card/50">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                            {filters.search || filters.timeFrame !== "all" || filters.locationType !== "all"
                                ? "No events match your filters. Try adjusting your search criteria."
                                : "More events coming soon. Meanwhile, explore the featured event above."}
                        </p>
                    </div>
                ) : (
                    filteredEvents.map((event) => {
                        const schedule = formatSchedule(event);
                        const eventImage =
                            event.image && event.image.trim() ? event.image.trim() : null;

                        return (
                            <article
                                key={event.slug}
                                className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px]"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    {eventImage ? (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                                            <Image
                                                src={eventImage}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center">
                                            <CalendarDays className="w-16 h-16 text-primary/20" />
                                        </div>
                                    )}
                                    {/* Date Badge - always visible */}
                                    <div className="absolute top-4 left-4 z-20">
                                        <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex flex-col items-center shadow-sm border border-border/50">
                                            <span className="text-xs font-bold uppercase text-primary">
                                                {schedule.date.split(" ")[0]}
                                            </span>
                                            <span className="text-lg font-bold leading-none text-foreground">
                                                {schedule.date.split(" ")[1]?.replace(",", "") || ""}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Virtual/In-person Badge */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${event.isVirtual
                                                ? "bg-blue-500/90 text-white"
                                                : "bg-emerald-500/90 text-white"
                                            }`}>
                                            {event.isVirtual ? "Virtual" : "In-person"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 flex flex-col space-y-4 border-t border-border/50">
                                    <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{schedule.time}</span>
                                        </div>
                                        {(event.subEventCount ?? 0) > 0 && (
                                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                <Layers className="h-3.5 w-3.5" />
                                                <span>{event.subEventCount}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1">
                                        {getEventSummary(event)}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {getLocationLabel(event)}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            className="p-0 h-auto text-xs font-bold uppercase tracking-wider hover:bg-transparent hover:text-primary"
                                            asChild
                                        >
                                            <Link href={`/events/${event.slug}`}>
                                                Details{" "}
                                                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </>
    );
}
