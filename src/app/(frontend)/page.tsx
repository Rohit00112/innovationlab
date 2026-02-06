import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    CalendarDays,
    Sparkles,
    Lightbulb,
    Code2,
    Briefcase,
    Clock,
    MapPin,
    ArrowUpRight,
} from "lucide-react";

import { FaqSection } from "@/components/faqs/faq-section";
import { getPublishedTestimonials } from "@/lib/data/testimonials";
import { getPublishedEvents } from "@/lib/data/events";
import { type TestimonialRecord } from "@/lib/types/testimonials";
import { type EventRecord } from "@/lib/types/events";

// ---------------------------------------------------------------------------
// Static hero content
// ---------------------------------------------------------------------------
const HERO_TITLE = "INNOVATION LABS";
const HERO_DESCRIPTION =
    "A collaborative space for students to explore, create, and innovate.";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

interface EventItem {
    image: string | null;
    date: string;
    time: string;
    title: string;
    category: string;
    description: string;
    location: string;
    link: string;
}

interface FallbackTestimonial {
    avatarUrl: string | null;
    quote: string;
    author: string;
    role: string;
}

const FALLBACK_EVENTS: EventItem[] = [
    {
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        date: "Nov 12, 2025",
        time: "10:00 AM – 5:00 PM",
        title: "PASTRAMA 2025: Ideas, momo, repeat",
        category: "Conference",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquet enim vel urna blandit gravida.",
        location: "IIC atrium ma comfy kura",
        link: "#",
    },
    {
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        date: "Dec 05, 2025",
        time: "9:00 AM – 3:00 PM",
        title: "BYE BYE C QUEST 3.0: Last minute hero mode",
        category: "Workshop",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquet enim vel urna blandit gravida.",
        location: "SSD ko sunny patio",
        link: "#",
    },
    {
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
        date: "Jan 20, 2026",
        time: "11:00 AM – 6:00 PM",
        title: "WHAT THE HEX 3.0: Demo gara, wow sun",
        category: "Exhibition",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer aliquet enim vel urna blandit gravida.",
        location: "Guild Hall, IIC",
        link: "#",
    },
];

const FALLBACK_TESTIMONIALS: FallbackTestimonial[] = [
    {
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        quote:
            "Morning standup ma punchline diyera sabai lai jagaaunu parcha. Yo team le deadline lai pani comedian banaucha, believe me.",
        author: "Manjeyy Gautam",
        role: "CEO, NASA (allegedly)",
    },
    {
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        quote:
            "Prototype demo dekhi signature chai latte samma handle garne talent. Innovation lai kehi bhaye ni meme ready, respect!",
        author: "Anshu Punchgain",
        role: "CTO, Nykaa ko maato",
    },
    {
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        quote:
            "Yesko presentation ma lights off bhaye pani energy on. I could not see them, tara uniharule future dekheshan, wow!",
        author: "John Cena",
        role: "Still invisible",
    },
];

function safeText(value: string | null | undefined) {
    return value?.trim() ?? "";
}

function safeUrl(value: string | null | undefined) {
    const normalized = safeText(value);
    return normalized ? normalized : null;
}

function truncateText(value: string, limit: number) {
    if (!value) {
        return value;
    }

    if (value.length <= limit) {
        return value;
    }

    return `${value.slice(0, Math.max(0, limit - 3)).trimEnd()}...`;
}

function getEventStartTimestamp(event: EventRecord) {
    const value = Date.parse(event.startsAt);
    return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function pickHomepageEvents(records: EventRecord[]) {
    if (records.length === 0) {
        return [] as EventRecord[];
    }

    const sorted = [...records].sort((a, b) => getEventStartTimestamp(a) - getEventStartTimestamp(b));
    const now = Date.now();

    const upcoming = sorted.filter((event) => {
        const start = Date.parse(event.startsAt);

        if (!Number.isNaN(start) && start >= now) {
            return true;
        }

        if (!event.endsAt) {
            return false;
        }

        const end = Date.parse(event.endsAt);
        return !Number.isNaN(end) && end >= now;
    });

    const selection: EventRecord[] = [];

    for (const event of upcoming) {
        if (selection.length >= 3) {
            break;
        }
        selection.push(event);
    }

    for (const event of sorted) {
        if (selection.length >= 3) {
            break;
        }

        if (selection.some((existing) => existing.id === event.id)) {
            continue;
        }

        selection.push(event);
    }

    return selection;
}

function formatEventSchedule(event: EventRecord) {
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

function resolveEventCategory(event: EventRecord) {
    const organizerName = safeText(event.organizer?.name ?? null);

    if (organizerName) {
        return organizerName;
    }

    const organizerEmail = safeText(event.organizer?.email ?? null);

    if (organizerEmail) {
        return organizerEmail;
    }

    return event.isVirtual ? "Virtual session" : "In-person";
}

function resolveEventLocation(event: EventRecord) {
    if (event.isVirtual) {
        return "Remote";
    }

    const location = safeText(event.location);
    return location || "Location to be announced";
}

function resolveEventDescription(event: EventRecord) {
    const summary = safeText(event.summary);

    if (summary) {
        return summary;
    }

    const description = safeText(event.description);
    return description || "Further details coming soon.";
}

function mapEventRecord(event: EventRecord): EventItem {
    const schedule = formatEventSchedule(event);

    return {
        image: safeUrl(event.image),
        date: schedule.date,
        time: schedule.time,
        title: event.title,
        category: resolveEventCategory(event),
        description: truncateText(resolveEventDescription(event), 160),
        location: resolveEventLocation(event),
        link: `/events/${event.slug}`,
    };
}

// Server-side data fetching functions using direct database access
async function fetchTestimonialsServer(): Promise<TestimonialRecord[]> {
    try {
        const testimonials = await getPublishedTestimonials(6);
        return testimonials as unknown as TestimonialRecord[];
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return [];
    }
}

async function fetchEventsServer(): Promise<EventRecord[]> {
    try {
        const events = await getPublishedEvents({ limit: 12 });
        return events as unknown as EventRecord[];
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}

export default async function Frontend() {
    // Fetch all data in parallel on the server
    const [testimonials, eventRecords] = await Promise.all([
        fetchTestimonialsServer(),
        fetchEventsServer(),
    ]);

    // Process events
    const selectedEvents = pickHomepageEvents(eventRecords);
    const eventCards = selectedEvents.length > 0
        ? selectedEvents.map(mapEventRecord)
        : FALLBACK_EVENTS;

    const displayTestimonials =
        testimonials.length > 0
            ? testimonials.map((item) => {
                // Handle both API types: DB returns body/authorName/authorTitle, type interface has quote/author/role
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const raw = item as any;
                const quote = raw.body ?? raw.quote ?? "";
                const author = raw.authorName ?? raw.author ?? "Anonymous";
                const role = raw.authorTitle ?? raw.role ?? null;
                const company = raw.company ?? null;
                return {
                    key: `testimonial-${item.id}`,
                    image: safeUrl(item.avatarUrl),
                    quote: quote as string,
                    author: author as string,
                    role: [role, company].filter(Boolean).join(" · ") || undefined,
                };
            })
            : FALLBACK_TESTIMONIALS.map((item, index) => ({
                key: `fallback-${index}`,
                image: item.avatarUrl,
                quote: item.quote,
                author: item.author,
                role: item.role,
            }));

    return (
        <main className="w-full bg-background text-foreground">


            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob opacity-70 dark:opacity-20"></div>
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-secondary/80 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000 opacity-70 dark:opacity-15"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-accent/60 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000 opacity-70 dark:opacity-20"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8 relative lg:col-span-1">
                            {/* Decorative element */}
                            <div className="absolute -left-8 -top-8 w-24 h-24 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl"></div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-primary/10 dark:border-primary/20 rounded-full text-xs font-medium tracking-wide text-primary shadow-sm dark:shadow-none">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Itahari International College
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                    {HERO_TITLE.split(" ")[0]}
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{HERO_TITLE.split(" ").slice(1).join(" ")}</span>
                                </h1>
                                <p className="text-xl leading-relaxed text-foreground/80 max-w-xl">
                                    {HERO_DESCRIPTION}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                                <Button size="lg" className="px-8 text-sm font-medium h-12 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30">
                                    Explore Projects
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 text-sm font-medium h-12 rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                                >
                                    Get Involved
                                </Button>
                            </div>
                        </div>

                        <div className="relative hidden lg:flex items-center justify-center">
                            <div className="relative w-full max-w-md aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-3xl blur-2xl"></div>
                                <div className="relative w-full h-full rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                                    <div className="text-center space-y-4 relative z-10">
                                        <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Sparkles className="h-10 w-10 text-primary" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground/60 px-8">Where ideas become reality</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div className="space-y-8 relative">
                            {/* Accent card background */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl -z-10 blur-xl"></div>

                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                                    Our Mission
                                </span>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                                    Innovation Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Collaboration</span>
                                </h2>
                            </div>
                            <p className="text-lg leading-relaxed text-foreground/70">
                                At the Innovation Lab, we empower students to transform bold ideas into real-world solutions. Through collaborative experimentation, cutting-edge technology, and creative thinking, we&apos;re shaping the future one project at a time.
                            </p>

                            <div className="p-6 rounded-2xl bg-muted/50 dark:bg-muted/30 border border-border/50 dark:border-border/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        <h3 className="font-semibold text-foreground">Why join us?</h3>
                                    </div>
                                    <p className="text-sm text-foreground/70">
                                        Gain hands-on experience, access mentorship from industry leaders, and build a portfolio that stands out.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: Lightbulb,
                                    title: "Ideation & Design",
                                    description: "From concept to prototype, we help students explore innovative solutions to real-world challenges.",
                                    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                },
                                {
                                    icon: Code2,
                                    title: "Technical Development",
                                    description: "Hands-on experience with cutting-edge tools, frameworks, and technologies across multiple domains.",
                                    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                },
                                {
                                    icon: Briefcase,
                                    title: "Project Execution",
                                    description: "Transform ideas into fully-realized projects with mentorship and industry-standard practices.",
                                    color: "bg-green-500/10 text-green-600 dark:text-green-400"
                                }
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="group p-6 rounded-2xl border border-transparent hover:border-border/50 hover:bg-card/50 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                                <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>



            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold tracking-wide uppercase">
                                Upcoming
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Events & Workshops</h2>
                        </div>
                        <Button variant="outline" className="w-fit rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                            <Link href="/events">
                                View All Events
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-8">
                        {eventCards.map((event, index) => {
                            // Extract date components if possible
                            let day = "";
                            let month = "";
                            try {
                                const dateParts = new Date(event.date);
                                if (!isNaN(dateParts.getTime())) {
                                    day = dateParts.getDate().toString();
                                    month = dateParts.toLocaleString('default', { month: 'short' });
                                } else {
                                    // Fallback for pre-formatted strings
                                    const parts = event.date.split(" ");
                                    if (parts.length >= 2) {
                                        month = parts[0];
                                        day = parts[1].replace(",", "");
                                    }
                                }
                            } catch {
                                day = "??";
                                month = "DEC";
                            }

                            return (
                                <article
                                    key={`${event.link}-${index}`}
                                    className="group relative bg-card dark:bg-card/80 rounded-3xl overflow-hidden border border-border/50 dark:border-border/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 hover:translate-y-[-2px]"
                                >
                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                                            {event.image ? (
                                                <>
                                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                                    <Image
                                                        src={event.image}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center">
                                                    <CalendarDays className="w-16 h-16 text-primary/20" />
                                                </div>
                                            )}
                                            {/* Date Badge - positioned on image */}
                                            <div className="absolute top-4 left-4 z-20 bg-background/95 backdrop-blur shadow-lg rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] border border-border/50 text-center">
                                                <span className="text-xs font-bold uppercase text-primary tracking-wider">{month || "UP"}</span>
                                                <span className="text-2xl font-bold text-foreground leading-none mt-1">{day || "NY"}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-8 flex flex-col justify-between relative">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold shadow-sm">
                                                        {event.category}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-foreground/70 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-foreground/60">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{event.location}</span>
                                                </div>

                                                {event.link === "#" ? (
                                                    <Button size="sm" variant="ghost" className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground" disabled>
                                                        Details <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="ghost" className="rounded-full px-4 hover:bg-primary hover:text-primary-foreground" asChild>
                                                        <Link href={event.link}>Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden">
                <div className="absolute -left-20 top-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase border border-border/50">
                            Community
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Stories from the Lab</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayTestimonials.map((item) => (
                            <div
                                key={item.key}
                                className="glass-card p-8 rounded-3xl space-y-6 flex flex-col relative group"
                            >
                                <div className="text-6xl text-primary/20 font-serif absolute top-4 right-6 leading-none">&quot;</div>

                                <p className="text-base leading-relaxed text-foreground/80 relative z-10 italic">
                                    {item.quote}
                                </p>

                                <div className="pt-6 mt-auto border-t border-border/50 flex items-center gap-4">
                                    {item.image ? (
                                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors">
                                            <Image
                                                src={item.image}
                                                alt={item.author || "Author"}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/5 text-primary font-bold">
                                            {(item.author || "A").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-foreground">{item.author || "Anonymous"}</p>
                                        {item.role && (
                                            <p className="text-xs font-medium text-foreground/60 mt-0.5">{item.role}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <FaqSection />
        </main>
    );
}