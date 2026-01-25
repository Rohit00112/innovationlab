import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  FileText,
} from "lucide-react";

import { LexicalRenderer } from "@/components/blocks/editor-x/viewer";
import { EventRegisterButton } from "@/components/event-register-button";
import { SubEventsList } from "@/components/sub-events-list";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import type { EventRecord } from "@/lib/types/events";

export const revalidate = 60;

interface EventsApiResponse {
  data: EventRecord[];
}

interface DescriptionContent {
  lexicalState: string | null;
  paragraphs: string[];
}

function getEventTags(event: EventRecord) {
  const tags = new Set<string>();

  tags.add(event.isVirtual ? "Virtual session" : "In-person gathering");

  if (event.organizer?.name) {
    tags.add(event.organizer.name);
  } else if (event.organizer?.email) {
    tags.add(event.organizer.email);
  }

  if (event.registrationUrl) {
    tags.add("Registration open");
  }

  return Array.from(tags);
}

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

function resolveDescriptionContent(description: string | null): DescriptionContent {
  const empty: DescriptionContent = { lexicalState: null, paragraphs: [] };

  if (!description) {
    return empty;
  }

  const trimmed = description.trim();

  if (!trimmed) {
    return empty;
  }

  try {
    const parsed = JSON.parse(trimmed) as {
      root?: {
        children?: Array<{
          text?: string;
          children?: unknown[];
        }>;
      };
    };

    if (!parsed?.root) {
      return { lexicalState: null, paragraphs: [trimmed] };
    }

    const gather = (node: any): string => {
      if (!node) {
        return "";
      }

      if (typeof node.text === "string") {
        return node.text;
      }

      if (Array.isArray(node.children)) {
        return node.children.map(gather).join("");
      }

      return "";
    };

    const paragraphs = Array.isArray(parsed.root.children)
      ? parsed.root.children.map(child => gather(child).trim()).filter(Boolean)
      : [];

    return { lexicalState: trimmed, paragraphs };
  } catch (e) {
    return { lexicalState: null, paragraphs: [trimmed] };
  }
}

async function fetchEventBySlug(slug: string): Promise<EventRecord | null> {
  const baseUrl = resolveApiBaseUrl();
  const url = new URL("/api/events", baseUrl);
  url.searchParams.set("slug", slug);
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    next: { revalidate },
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to load event: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as EventsApiResponse;
  return payload.data[0] ?? null;
}

export async function generateStaticParams() {
  try {
    const baseUrl = resolveApiBaseUrl();
    const url = new URL("/api/events", baseUrl);
    url.searchParams.set("status", "published");
    url.searchParams.set("limit", "50");

    const response = await fetch(url.toString(), {
      next: { revalidate },
      cache: "force-cache",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as EventsApiResponse;
    return payload.data.map(event => ({ slug: event.slug }));
  } catch (_error) {
    return [];
  }
}

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const event = await fetchEventBySlug(params.slug.toLowerCase());

  if (!event) {
    return {
      title: "Event not found — Innovation Lab",
      description: "The event you were looking for could not be found.",
    };
  }

  return {
    title: `${event.title} — Innovation Lab`,
    description: event.summary ?? `Discover ${event.title} hosted by Innovation Lab.`,
    openGraph: {
      title: `${event.title} — Innovation Lab`,
      description: event.summary ?? undefined,
      images: event.image ? [{ url: event.image }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const normalizedSlug = params.slug.toLowerCase();
  const event = await fetchEventBySlug(normalizedSlug);

  if (!event) {
    notFound();
  }

  const schedule = formatSchedule(event);
  const tags = getEventTags(event);
  const locationLabel = getLocationLabel(event);
  const descriptionContent = resolveDescriptionContent(event.description);
  const imageUrl = event.image && event.image.trim() ? event.image.trim() : null;

  return (
    <main className="w-full bg-background text-foreground">
      <section className="py-10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60 hover:border-foreground/40 hover:text-foreground/80 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <div className="mt-0">
            <div className="relative h-96 w-full overflow-hidden border border-foreground/20">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-foreground/5" />
              )}
            </div>

            <div className="border-x border-b border-foreground/20 p-8 sm:p-12 space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {schedule.date}
                </span>
                <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                  <Clock className="h-3.5 w-3.5" />
                  {schedule.time}
                </span>
                <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                  <MapPin className="h-3.5 w-3.5" />
                  {locationLabel}
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="border border-foreground/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-foreground/10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {event.summary && (
                <div className="space-y-4">
                  <div className="inline-flex border border-foreground/20 px-4 py-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      Overview
                    </p>
                  </div>
                  <p className="text-lg leading-relaxed text-foreground/70">
                    {event.summary}
                  </p>
                </div>
              )}

              {descriptionContent.lexicalState ? (
                <div className="space-y-4">
                  {/* <div className="inline-flex border border-foreground/20 px-4 py-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      Details
                    </p>
                  </div> */}
                  <LexicalRenderer
                    state={descriptionContent.lexicalState}
                    contentClassName="space-y-6 text-base leading-relaxed text-foreground/70 [&_strong]:text-foreground [&_em]:italic [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-6"
                  />
                </div>
              ) : descriptionContent.paragraphs.length > 0 ? (
                <div className="space-y-4">
                  <div className="inline-flex border border-foreground/20 px-4 py-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      Details
                    </p>
                  </div>
                  <div className="space-y-6 text-base leading-relaxed text-foreground/70">
                    {descriptionContent.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Sub-Events Section */}
              <SubEventsList parentEventId={event.id} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="border border-foreground/20 p-6 space-y-4">
                <div className="inline-flex border border-foreground/20 px-3 py-1.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Schedule
                  </p>
                </div>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-start gap-3 pb-3 border-b border-foreground/10">
                    <CalendarDays className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{schedule.date}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{schedule.time}</span>
                  </div>
                </div>
              </div>

              <div className="border border-foreground/20 p-6 space-y-4">
                <div className="inline-flex border border-foreground/20 px-3 py-1.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Event Info
                  </p>
                </div>
                <div className="space-y-3 text-sm text-foreground/70">
                  <div className="flex items-start gap-3 pb-3 border-b border-foreground/10">
                    <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{event.organizer?.name ?? event.organizer?.email ?? "Innovation Lab"}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{locationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Native Registration */}
              <EventRegisterButton eventId={event.id} eventSlug={event.slug} hasRegistration={event.hasRegistration} />

              {/* External Registration Link */}
              {event.registrationUrl && (
                <Link
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border border-foreground/30 px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    External Registration
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              )}

              {/* Event Resources */}
              {event.documents && event.documents.length > 0 && (
                <div className="border border-foreground/20 p-6 space-y-4">
                  <div className="inline-flex border border-foreground/20 px-3 py-1.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                      Resources
                    </p>
                  </div>
                  <div className="space-y-3">
                    {event.documents.map((doc, index) => (
                      <Link
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 group"
                      >
                        <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-foreground/70 group-hover:text-foreground transition-colors" />
                        <span className="text-sm text-foreground/70 group-hover:text-foreground underline-offset-4 group-hover:underline transition-all">
                          {doc.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
