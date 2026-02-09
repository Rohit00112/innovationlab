import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react"

import { getPublishedEvents, type EventRecord } from "@/lib/data/events"
import { Button } from "@/components/ui/button"
import { EventsListClient } from "@/components/events/events-list-client"

export const dynamic = "force-dynamic"
export const revalidate = 60

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
    timeZone: "Asia/Kathmandu",
  })

  const startTime = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kathmandu",
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
    timeZone: "Asia/Kathmandu",
  })

  return {
    date,
    time: `${startTime} – ${endTime}`,
  }
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
    records = await getPublishedEvents({ limit: 50 })
  } catch {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 cursor-default pointer-events-none"></div>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Events Unavailable</h1>
            <p className="text-lg text-foreground/70">
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
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 cursor-default pointer-events-none"></div>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Upcoming Events
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">No Scheduled Events</h1>
            <p className="text-lg text-foreground/70 max-w-xl mx-auto">
              There are no published events just yet. Check back soon for what&apos;s happening at the Innovation Lab.
            </p>
            <Button variant="outline" className="mt-8 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  const spotlightSchedule = formatSchedule(spotlight)
  const spotlightImage = spotlight.image && spotlight.image.trim() ? spotlight.image.trim() : null
  const otherEvents = others

  return (
    <main className="w-full bg-background text-foreground">
      <section className="relative py-20 min-h-screen flex items-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-xs font-semibold tracking-wide uppercase text-foreground/80 w-fit">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                Events & Gatherings
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
                Where Bold <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Thinkers Connect</span>
              </h1>

              <p className="text-lg leading-relaxed text-foreground/80 max-w-xl">
                Join us for workshops, summits, and networking events where innovation meets collaboration.
                Connect with industry leaders and emerging talents shaping the future.
              </p>

              <div className="flex flex-wrap gap-3">
                {["Strategy", "Prototyping", "Community", "Learning"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <article className="group relative bg-card dark:bg-card/80 rounded-3xl overflow-hidden shadow-2xl dark:shadow-primary/5 border border-border/50 dark:border-border/30 hover:translate-y-[-4px] transition-all duration-500">
              {spotlightImage ? (
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 dark:opacity-70"></div>
                  <Image
                    src={spotlightImage}
                    alt={spotlight.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg">
                      Featured Event
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-80 w-full bg-muted flex items-center justify-center">
                  <CalendarDays className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}

              <div className="relative p-8 -mt-20 z-20">
                <div className="bg-card/95 backdrop-blur-xl p-6 rounded-2xl border border-border/20 shadow-lg space-y-5">
                  <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{spotlightSchedule.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{spotlightSchedule.time}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {spotlight.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-foreground/70 line-clamp-2">
                    {getEventSummary(spotlight)}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {spotlight.registrationUrl && (
                      <Button className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform" asChild>
                        <Link href={spotlight.registrationUrl}>
                          Register <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="rounded-full border-border/50 hover:bg-secondary/50" asChild>
                      <Link href={`/events/${spotlight.slug}`}>
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {otherEvents.length > 0 && (
        <section className="py-24 bg-muted/30 dark:bg-muted/10 border-t border-border/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
                Upcoming Gatherings
              </span>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Don&apos;t Miss Out
              </h2>
            </div>

            <EventsListClient events={otherEvents} />
          </div>
        </section>
      )}
    </main>
  )
}
