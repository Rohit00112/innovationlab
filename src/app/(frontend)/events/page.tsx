import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Layers,
  MapPin,
} from "lucide-react"

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url"
import type { EventRecord } from "@/lib/types/events"

export const revalidate = 60

interface EventsApiResponse {
  data: EventRecord[]
}

async function fetchPublishedEvents(): Promise<EventRecord[]> {
  const baseUrl = resolveApiBaseUrl()
  const url = new URL("/api/events", baseUrl)
  url.searchParams.set("status", "published")
  url.searchParams.set("limit", "12")

  const response = await fetch(url.toString(), {
    next: { revalidate },
    cache: "force-cache",
  })

  if (!response.ok) {
    throw new Error(`Failed to load events: ${response.status} ${response.statusText}`)
  }

  const payload = (await response.json()) as EventsApiResponse
  return payload.data
}

function getStartTimestamp(event: EventRecord) {
  const value = Date.parse(event.startsAt)
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value
}

function chooseSpotlight(events: EventRecord[]) {
  if (events.length === 0) {
    return { spotlight: null as EventRecord | null, others: [] as EventRecord[] }
  }

  const sorted = [...events].sort((a, b) => getStartTimestamp(a) - getStartTimestamp(b))
  const now = Date.now()

  const upcoming = sorted.filter((event) => {
    const start = Date.parse(event.startsAt)

    if (!Number.isNaN(start) && start >= now) {
      return true
    }

    if (!event.endsAt) {
      return false
    }

    const end = Date.parse(event.endsAt)
    return !Number.isNaN(end) && end >= now
  })

  if (upcoming.length > 0) {
    const spotlight = upcoming[0]

    return {
      spotlight,
      others: sorted.filter((event) => event.id !== spotlight.id),
    }
  }

  const [spotlight, ...rest] = sorted
  return { spotlight, others: rest }
}

function formatSchedule(event: EventRecord) {
  const start = new Date(event.startsAt)

  if (Number.isNaN(start.getTime())) {
    return { date: "Date coming soon", time: "Time to be announced" }
  }

  const date = start.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })

  if (!event.endsAt) {
    return { date, time: startTime }
  }

  const end = new Date(event.endsAt)

  if (Number.isNaN(end.getTime())) {
    return { date, time: startTime }
  }

  const endTime = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })

  return {
    date,
    time: `${startTime} – ${endTime}`,
  }
}

function getLocationLabel(event: EventRecord) {
  if (event.isVirtual) {
    return "Remote"
  }

  if (event.location && event.location.trim()) {
    return event.location.trim()
  }

  return "Location to be announced"
}

function getEventTags(event: EventRecord) {
  const tags = new Set<string>()

  tags.add(event.isVirtual ? "Virtual session" : "In-person gathering")

  if (event.organizer?.name) {
    tags.add(event.organizer.name)
  } else if (event.organizer?.email) {
    tags.add(event.organizer.email)
  }

  if (event.registrationUrl) {
    tags.add("Registration open")
  }

  return Array.from(tags)
}

function getEventSummary(event: EventRecord) {
  if (event.summary && event.summary.trim()) {
    return event.summary.trim()
  }

  return "Further details coming soon."
}

export default async function EventsPage() {
  let records: EventRecord[] = []

  try {
    records = await fetchPublishedEvents()
  } catch (e) {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
            <p className="mt-4 text-base text-foreground/70">
              We&apos;re unable to load upcoming gatherings right now. Please refresh the page in a moment.
            </p>
          </div>
        </section>
      </main>
    )
  }

  const { spotlight, others } = chooseSpotlight(records)

  if (!spotlight) {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
            <p className="mt-4 text-base text-foreground/70">
              There are no published events just yet. Check back soon for what&apos;s happening at the Innovation Lab.
            </p>
          </div>
        </section>
      </main>
    )
  }

  const spotlightSchedule = formatSchedule(spotlight)
  //const spotlightTags = getEventTags(spotlight)
  const spotlightImage = spotlight.image && spotlight.image.trim() ? spotlight.image.trim() : null
  const otherEvents = others

  return (
    <main className="w-full bg-background text-foreground">
      <section className="relative py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex w-fit border border-foreground/20 px-4 py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                  Events & Gatherings
                </p>
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Where Bold Thinkers Connect
              </h1>

              <p className="text-lg leading-relaxed text-foreground/70 max-w-xl">
                Join us for workshops, summits, and networking events where innovation meets collaboration.
                Connect with industry leaders and emerging talents shaping the future.
              </p>

              <div className="flex flex-wrap gap-3">
                {["Strategy", "Prototyping", "Community", "Learning"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60 hover:border-foreground/40 hover:text-foreground/80 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <article className="border border-foreground/20 bg-background">
              <div className="relative h-80 w-full overflow-hidden">
                {spotlightImage ? (
                  <Image
                    src={spotlightImage}
                    alt={spotlight.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-foreground/5" />
                )}
                {/* <div className="absolute top-6 left-6">
                  <div className="border border-foreground/20 bg-background/95 px-4 py-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-foreground/60">Featured Event</span>
                  </div>
                </div> */}
              </div>

              <div className="border-t border-foreground/20 p-8 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {spotlightSchedule.date}
                  </span>
                  <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                    <Clock className="h-3.5 w-3.5" />
                    {spotlightSchedule.time}
                  </span>
                  <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                    <MapPin className="h-3.5 w-3.5" />
                    {getLocationLabel(spotlight)}
                  </span>
                  {(spotlight.subEventCount ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      <Layers className="h-3.5 w-3.5" />
                      {spotlight.subEventCount} Sessions
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {spotlight.title}
                </h2>

                <p className="text-base leading-relaxed text-foreground/70">
                  {getEventSummary(spotlight)}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-foreground/10">
                  {spotlight.registrationUrl && (
                    <Link
                      href={spotlight.registrationUrl}
                      className="inline-flex items-center gap-2 border border-foreground/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      Register Now
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/events/${spotlight.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors"
                  >
                    View Details
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16">
            <div className="inline-flex border border-foreground/20 px-4 py-2 mb-6">
              <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                Upcoming Gatherings
              </p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Don&apos;t Miss Out
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherEvents.length === 0 ? (
              <div className="col-span-full border border-foreground/20 p-12 text-center">
                <p className="text-sm uppercase tracking-wider text-foreground/60">
                  More events coming soon. Meanwhile, explore the featured event above.
                </p>
              </div>
            ) : (
              otherEvents.map((event) => {
                const schedule = formatSchedule(event)
                const eventImage = event.image && event.image.trim() ? event.image.trim() : null

                return (
                  <article
                    key={event.slug}
                    className="group border border-foreground/20 bg-background hover:border-foreground/40 transition-colors"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      {eventImage ? (
                        <Image
                          src={eventImage}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-foreground/5" />
                      )}
                    </div>

                    <div className="border-t border-foreground/20 p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground/60">
                          <CalendarDays className="h-3 w-3" />
                          {schedule.date}
                        </span>
                        <span className="inline-flex items-center gap-2 border border-foreground/20 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-foreground/60">
                          <Clock className="h-3 w-3" />
                          {schedule.time}
                        </span>
                        {(event.subEventCount ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            <Layers className="h-3 w-3" />
                            {event.subEventCount}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold tracking-tight line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
                        {getEventSummary(event)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/60">
                          <MapPin className="h-3 w-3" />
                          {getLocationLabel(event)}
                        </span>
                        <Link
                          href={`/events/${event.slug}`}
                          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors"
                        >
                          Details
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
