import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  FileText,
  User,
} from "lucide-react";

import { LexicalRenderer } from "@/components/blocks/editor-x/viewer";
import { EventRegisterButton } from "@/components/event-register-button";
import { SubEventsList } from "@/components/sub-events-list";
import { ShareButton } from "@/components/share-button";
import { getEventBySlug, getEventById, getPublishedEvents, type EventRecord } from "@/lib/data/events";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 60;

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
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  });

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kathmandu",
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
    timeZone: "Asia/Kathmandu",
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

    const gather = (node: { text?: string; children?: unknown[] } | null | undefined): string => {
      if (!node) {
        return "";
      }

      if (typeof node.text === "string") {
        return node.text;
      }

      if (Array.isArray(node.children)) {
        return node.children.map((child) => gather(child as { text?: string; children?: unknown[] })).join("");
      }

      return "";
    };

    const paragraphs = Array.isArray(parsed.root.children)
      ? parsed.root.children.map(child => gather(child).trim()).filter(Boolean)
      : [];

    return { lexicalState: trimmed, paragraphs };
  } catch {
    return { lexicalState: null, paragraphs: [trimmed] };
  }
}

export async function generateStaticParams() {
  try {
    const events = await getPublishedEvents({ limit: 50 });
    return events.map(event => ({ slug: event.slug }));
  } catch {
    return [];
  }
}

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug.toLowerCase());

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
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const event = await getEventBySlug(normalizedSlug);

  if (!event) {
    notFound();
  }

  const schedule = formatSchedule(event);
  const tags = getEventTags(event);
  const locationLabel = getLocationLabel(event);
  const descriptionContent = resolveDescriptionContent(event.description);
  const imageUrl = event.image && event.image.trim() ? event.image.trim() : null;

  // Resolve back link: sub-events go back to parent event, top-level events go to /events
  let backHref = "/events";
  let backLabel = "Back to Events";
  if (event.parentEventId) {
    const parentEvent = await getEventById(event.parentEventId);
    if (parentEvent) {
      backHref = `/events/${parentEvent.slug}`;
      backLabel = `Back to ${parentEvent.title}`;
    }
  }

  return (
    <main className="w-full bg-background text-foreground min-h-screen">
      <section className="relative pt-32 pb-20 bg-muted/20 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <Button variant="ghost" className="rounded-full hover:bg-background/50 hover:text-primary mb-8 pl-0" asChild>
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 2).map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  {event.title}
                </h1>
              </div>

              {event.summary && (
                <p className="text-xl leading-relaxed text-foreground/80 font-medium">
                  {event.summary}
                </p>
              )}

              <div className="flex flex-col gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-semibold mt-1">{schedule.date}</p>
                    <p className="text-sm text-muted-foreground">{schedule.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
                    <p className="text-sm font-semibold mt-1">{locationLabel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Organizer</p>
                    <p className="text-sm font-semibold mt-1">{event.organizer?.name ?? event.organizer?.email ?? "Innovation Lab"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl border border-border/50">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none"></div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <CalendarDays className="w-16 h-16 text-muted-foreground/20" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1fr_20rem] items-start">
            <div className="space-y-12">
              {/* Description Content */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-6">
                  About the Event
                </span>
                {descriptionContent.lexicalState ? (
                  <LexicalRenderer
                    state={descriptionContent.lexicalState}
                    contentClassName="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
                  />
                ) : descriptionContent.paragraphs.length > 0 ? (
                  <div className="space-y-6 text-lg leading-relaxed text-foreground/80">
                    {descriptionContent.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground italic">No additional details available.</p>
                )}
              </div>

              {/* Sub-Events Section */}
              <div className="pt-8 border-t border-border/50">
                <SubEventsList parentEventId={event.id} />
              </div>
            </div>

            <div className="space-y-8 lg:sticky lg:top-24">
              {/* Registration Card */}
              <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-lg space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Ready to join?</h3>
                  <p className="text-sm text-muted-foreground">Secure your spot for this event.</p>
                </div>

                <EventRegisterButton eventId={event.id} eventSlug={event.slug} hasRegistration={event.hasRegistration} />

                {event.registrationUrl && (
                  <Button variant="outline" className="w-full rounded-xl" asChild>
                    <Link
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      External Registration <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}

                <div className="pt-4 border-t border-border/50">
                  <ShareButton
                    title={event.title}
                    description={event.summary ?? undefined}
                    variant="outline"
                    className="w-full rounded-xl"
                  />
                </div>
              </div>

              {/* Resources Card */}
              {event.documents && event.documents.length > 0 && (
                <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resources</h3>
                  <div className="space-y-3">
                    {event.documents.map((doc, index) => (
                      <Link
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
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

