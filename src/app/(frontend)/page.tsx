"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    ArrowUpRight,
    ArrowRight,
    CalendarDays,
    CircleDashed,
    MessageCircle,
    Rocket,
    Sparkles,
    Target,
    Trophy,
    Users,
    Zap,
    CheckCircle2,
    Lightbulb,
    Code2,
    Briefcase,
} from "lucide-react";

import { HttpError } from "@/lib/http/api-client";
import { listTestimonials } from "@/lib/http/testimonials";
import { listNews } from "@/lib/http/news";
import { listEvents } from "@/lib/http/events";
import { normalizeLexicalState, estimateReadingTime } from "@/lib/editor/lexical-utils";
import { type TestimonialRecord } from "@/lib/types/testimonials";
import { type NewsRecord } from "@/lib/types/news";
import { type EventRecord } from "@/lib/types/events";

interface NewsItem {
    image: string | null;
    category: string;
    date: string;
    title: string;
    description: string;
    href: string;
    readTime: string;
}

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

const FALLBACK_NEWS: NewsItem[] = [
    {
        image:
            "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80",
        category: "Development",
        date: "01 Feb, 2025",
        title: "Robot haru le momo banaunda laptop pani royo",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget ligula sit amet sem tincidunt auctor.",
        href: "#",
        readTime: "3 min read",
    },
    {
        image:
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
        category: "Community",
        date: "18 Jan, 2025",
        title: "Community meetup ma free sel roti, say no more",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget ligula sit amet sem tincidunt auctor.",
        href: "#",
        readTime: "2 min read",
    },
    {
        image:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        category: "Research",
        date: "09 Jan, 2025",
        title: "Tihar lights le sensors confuse, data pani chillax",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget ligula sit amet sem tincidunt auctor.",
        href: "#",
        readTime: "4 min read",
    },
];

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

const capabilityTiles = [
    {
        title: "Recognize chiya cups",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in eros ut sapien vulputate pretium.",
        icon: Target,
    },
    {
        title: "Train ideas to Pokhara",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in eros ut sapien vulputate pretium.",
        icon: Zap,
    },
    {
        title: "Build successful prototypes",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in eros ut sapien vulputate pretium.",
        icon: Users,
    },
];

const statBadges = [
    { label: "SUCCESS", value: "87%" },
    { label: "TEAMS", value: "5" },
    { label: "MEMBERS", value: "18" },
];

const highlightTracks = [
    {
        title: "Future of Learning",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan leo nec sapien mattis dapibus.",
        icon: Sparkles,
    },
    {
        title: "Civic Tech",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan leo nec sapien mattis dapibus.",
        icon: CircleDashed,
    },
    {
        title: "Responsible AI",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam accumsan leo nec sapien mattis dapibus.",
        icon: MessageCircle,
    },
];

const achievementStats = [
    { value: "500+", label: "Projects delivered", icon: Rocket },
    { value: "12+", label: "Years of momentum", icon: CalendarDays },
    { value: "50+", label: "Collaborators", icon: Users },
    { value: "25", label: "Awards & honours", icon: Trophy },
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

function formatNewsDate(record: NewsRecord) {
    const source = record.publishedAt ?? record.createdAt;
    const date = new Date(source);

    if (Number.isNaN(date.getTime())) {
        return "Publication date coming soon";
    }

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function resolveNewsCategory(record: NewsRecord) {
    const role = safeText(record.author?.role ?? null);

    if (role) {
        return role;
    }

    const name = safeText(record.author?.name ?? null);

    if (name) {
        return name;
    }

    const email = safeText(record.author?.email ?? null);
    return email || "Innovation Lab";
}

function sortNewsRecords(records: NewsRecord[]) {
    return [...records].sort((a, b) => {
        const aTime = Date.parse(a.publishedAt ?? a.createdAt);
        const bTime = Date.parse(b.publishedAt ?? b.createdAt);
        const safeATime = Number.isNaN(aTime) ? 0 : aTime;
        const safeBTime = Number.isNaN(bTime) ? 0 : bTime;

        return safeBTime - safeATime;
    });
}

function mapNewsRecord(record: NewsRecord): NewsItem {
    const normalized = normalizeLexicalState(record.content);
    const excerptSource = safeText(record.excerpt) || (normalized.paragraphs[0] ?? "");
    const excerpt = excerptSource || "More details arriving soon.";
    const plainText = normalized.plainText || excerpt;

    return {
        image: safeUrl(record.coverImageUrl),
        category: resolveNewsCategory(record),
        date: formatNewsDate(record),
        title: record.title,
        description: truncateText(excerpt, 180),
        href: `/news/${record.slug}`,
        readTime: estimateReadingTime(plainText),
    };
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

export default function Frontend() {
    const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [testimonialsError, setTestimonialsError] = useState<string | null>(null);
    const [newsCards, setNewsCards] = useState<NewsItem[]>(FALLBACK_NEWS);
    const [newsLoading, setNewsLoading] = useState(true);
    const [newsError, setNewsError] = useState<string | null>(null);
    const [newsFromApi, setNewsFromApi] = useState(false);
    const [eventCards, setEventCards] = useState<EventItem[]>(FALLBACK_EVENTS);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [eventsFromApi, setEventsFromApi] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchTestimonials = async () => {
            setTestimonialsLoading(true);

            try {
                let dataset = await listTestimonials({ status: "published", isFeatured: true, limit: 6 });

                if (dataset.length === 0) {
                    dataset = await listTestimonials({ status: "published", limit: 6 });
                }

                if (cancelled) {
                    return;
                }

                setTestimonials(dataset);
                setTestimonialsError(null);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const message =
                    error instanceof HttpError ? error.message : "Unable to load testimonials";
                setTestimonialsError(message);
                setTestimonials([]);
            } finally {
                if (!cancelled) {
                    setTestimonialsLoading(false);
                }
            }
        };

        const fetchNews = async () => {
            setNewsLoading(true);

            try {
                const dataset = await listNews({ status: "published", limit: 6 });

                if (cancelled) {
                    return;
                }

                const sorted = sortNewsRecords(dataset);
                const selected = sorted.slice(0, 3);

                if (selected.length > 0) {
                    setNewsCards(selected.map(mapNewsRecord));
                    setNewsFromApi(true);
                    setNewsError(null);
                } else {
                    setNewsCards(FALLBACK_NEWS);
                    setNewsFromApi(false);
                    setNewsError(null);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const message = error instanceof HttpError ? error.message : "Unable to load news";
                setNewsError(message);
                setNewsCards(FALLBACK_NEWS);
                setNewsFromApi(false);
            } finally {
                if (!cancelled) {
                    setNewsLoading(false);
                }
            }
        };

        const fetchEvents = async () => {
            setEventsLoading(true);

            try {
                const dataset = await listEvents({ status: "published", limit: 12 });

                if (cancelled) {
                    return;
                }

                const selected = pickHomepageEvents(dataset);

                if (selected.length > 0) {
                    setEventCards(selected.map(mapEventRecord));
                    setEventsFromApi(true);
                    setEventsError(null);
                } else {
                    setEventCards(FALLBACK_EVENTS);
                    setEventsFromApi(false);
                    setEventsError(null);
                }
            } catch (error) {
                if (cancelled) {
                    return;
                }

                const message = error instanceof HttpError ? error.message : "Unable to load events";
                setEventsError(message);
                setEventCards(FALLBACK_EVENTS);
                setEventsFromApi(false);
            } finally {
                if (!cancelled) {
                    setEventsLoading(false);
                }
            }
        };

        void fetchTestimonials();
        void fetchNews();
        void fetchEvents();

        return () => {
            cancelled = true;
        };
    }, []);

    const displayTestimonials =
        testimonials.length > 0
            ? testimonials.map((item) => ({
                  key: `testimonial-${item.id}`,
                  image: safeUrl(item.avatarUrl),
                  quote: item.quote,
                  author: item.author,
                  role: [item.role, item.company].filter(Boolean).join(" · ") || undefined,
              }))
            : FALLBACK_TESTIMONIALS.map((item, index) => ({
                  key: `fallback-${index}`,
                  image: item.avatarUrl,
                  quote: item.quote,
                  author: item.author,
                  role: item.role,
              }));

    const testimonialCount = displayTestimonials.length;
    const primaryNews = newsCards[0] ?? null;
    const secondaryNews = primaryNews ? newsCards.slice(1) : [];
    const showNewsArchiveNotice = !newsError && !newsLoading && !newsFromApi;
    const showEventsArchiveNotice = !eventsError && !eventsLoading && !eventsFromApi;

    return (
        <main className="w-full bg-background text-foreground">


            <section className="relative min-h-[90vh] flex items-center border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
                    <div className="grid gap-20 lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-widest text-foreground/70">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                Itahari International College
                            </div>
                            
                            <div className="space-y-6">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                    INNOVATION
                                    <br />
                                    <span className="text-foreground/60">LAB</span>
                                </h1>
                                <p className="text-xl leading-relaxed text-foreground/70 max-w-xl">
                                    Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                                <Button size="lg" className="px-8 text-sm uppercase tracking-wider">
                                    Explore Projects
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 text-sm uppercase tracking-wider"
                                >
                                    Get Involved
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                                    <div className="w-12 h-12 mb-6 flex items-center justify-center border border-foreground/20">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">500+</h3>
                                    <p className="text-sm uppercase tracking-wider text-foreground/60">Projects</p>
                                </div>
                                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                                    <div className="w-12 h-12 mb-6 flex items-center justify-center border border-foreground/20">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">50+</h3>
                                    <p className="text-sm uppercase tracking-wider text-foreground/60">Members</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                                    <div className="w-12 h-12 mb-6 flex items-center justify-center border border-foreground/20">
                                        <Trophy className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">25</h3>
                                    <p className="text-sm uppercase tracking-wider text-foreground/60">Awards</p>
                                </div>
                                <div className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors">
                                    <div className="w-12 h-12 mb-6 flex items-center justify-center border border-foreground/20">
                                        <CalendarDays className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">12+</h3>
                                    <p className="text-sm uppercase tracking-wider text-foreground/60">Years</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-foreground/50">What We Do</p>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                    Innovation Through Collaboration
                                </h2>
                            </div>
                            <p className="text-lg leading-relaxed text-foreground/70">
                                At the Innovation Lab, we empower students to transform bold ideas into real-world solutions. Through collaborative experimentation, cutting-edge technology, and creative thinking, we're shaping the future.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    icon: Lightbulb,
                                    title: "Ideation & Design",
                                    description: "From concept to prototype, we help students explore innovative solutions to real-world challenges."
                                },
                                {
                                    icon: Code2,
                                    title: "Technical Development",
                                    description: "Hands-on experience with cutting-edge tools, frameworks, and technologies across multiple domains."
                                },
                                {
                                    icon: Briefcase,
                                    title: "Project Execution",
                                    description: "Transform ideas into fully-realized projects with mentorship and industry-standard practices."
                                }
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="border-l-2 border-foreground/20 pl-6 py-2">
                                        <div className="flex items-start gap-4">
                                            <Icon className="h-6 w-6 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
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

            <section className="py-16 border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-widest text-foreground/50">Latest Updates</p>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">News & Insights</h2>
                        </div>
                        <Button variant="outline" className="w-fit" asChild>
                            <Link href="/news">
                                View All News
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {newsError && (
                        <p className="mb-8 text-sm text-destructive border border-destructive/20 p-4">
                            {newsError}
                        </p>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {newsCards.map((item, index) => (
                            <article
                                key={`${item.href}-${index}`}
                                className="group border border-foreground/10 hover:border-foreground/30 transition-colors"
                            >
                                {item.image && (
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                    </div>
                                )}
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-foreground/50">
                                        <span>{item.category}</span>
                                        <span>•</span>
                                        <span>{item.date}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold leading-tight group-hover:text-foreground/80 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
                                        {item.description}
                                    </p>
                                    {item.href === "#" ? (
                                        <Button variant="link" className="p-0 h-auto text-sm" disabled>
                                            Read More →
                                        </Button>
                                    ) : (
                                        <Button variant="link" className="p-0 h-auto text-sm" asChild>
                                            <Link href={item.href}>Read More →</Link>
                                        </Button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-widest text-foreground/50">Upcoming</p>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Events & Workshops</h2>
                        </div>
                        <Button variant="outline" className="w-fit" asChild>
                            <Link href="/events">
                                View All Events
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {eventsError && (
                        <p className="mb-8 text-sm text-destructive border border-destructive/20 p-4">
                            {eventsError}
                        </p>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {eventCards.map((event, index) => (
                            <article
                                key={`${event.link}-${index}`}
                                className="border border-foreground/10 hover:border-foreground/30 transition-colors overflow-hidden group"
                            >
                                {event.image && (
                                    <div className="relative h-56 w-full overflow-hidden">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                    </div>
                                )}
                                <div className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-xs uppercase tracking-wider text-foreground/50">
                                            {event.date}
                                        </div>
                                        <div className="text-sm text-foreground/70">{event.time}</div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-foreground/20 text-xs uppercase tracking-wider text-foreground/60">
                                            {event.category}
                                        </div>
                                        <h3 className="text-xl font-semibold leading-tight">{event.title}</h3>
                                        <p className="text-sm leading-relaxed text-foreground/70">{event.description}</p>
                                    </div>

                                    <div className="pt-4 border-t border-foreground/10 flex items-center justify-between">
                                        <span className="text-xs uppercase tracking-wider text-foreground/50">
                                            {event.location}
                                        </span>
                                        {event.link === "#" ? (
                                            <Button variant="link" className="p-0 h-auto text-sm" disabled>
                                                Learn More →
                                            </Button>
                                        ) : (
                                            <Button variant="link" className="p-0 h-auto text-sm" asChild>
                                                <Link href={event.link}>Learn More →</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-foreground/50">Our Focus</p>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                    Innovation Tracks
                                </h2>
                            </div>
                            <p className="text-lg leading-relaxed text-foreground/70">
                                We explore cutting-edge themes through our residency and challenge programs, combining technical excellence with responsible innovation and real-world impact.
                            </p>

                            <div className="grid gap-4 pt-8">
                                <div className="border border-foreground/10 p-6">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Mentorship Programs</h3>
                                    </div>
                                    <p className="text-sm text-foreground/70 pl-14">110+ industry mentors guiding student projects</p>
                                </div>
                                <div className="border border-foreground/10 p-6">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Global Collaborations</h3>
                                    </div>
                                    <p className="text-sm text-foreground/70 pl-14">72+ international pilot projects launched</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {highlightTracks.map((track) => {
                                const Icon = track.icon;
                                return (
                                    <div
                                        key={track.title}
                                        className="border border-foreground/10 p-8 hover:border-foreground/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-semibold">{track.title}</h3>
                                                <p className="text-sm leading-relaxed text-foreground/70">
                                                    {track.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 border-b border-foreground/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="space-y-4 mb-16">
                        <p className="text-xs uppercase tracking-widest text-foreground/50">What People Say</p>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Testimonials</h2>
                    </div>

                    {testimonialsLoading && (
                        <div className="text-center text-foreground/60 py-12">Loading testimonials...</div>
                    )}

                    {testimonialsError && (
                        <p className="text-sm text-destructive border border-destructive/20 p-4 mb-8">
                            {testimonialsError}
                        </p>
                    )}

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {!testimonialsLoading &&
                            displayTestimonials.map((item: any) => (
                                <div
                                    key={item.key}
                                    className="border border-foreground/10 p-8 space-y-6 hover:border-foreground/30 transition-colors"
                                >
                                    <p className="text-base leading-relaxed text-foreground/80">
                                        "{item.quote}"
                                    </p>
                                    <div className="pt-4 border-t border-foreground/10 flex items-center gap-4">
                                        {item.image ? (
                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-foreground/20">
                                                <Image
                                                    src={item.image}
                                                    alt={item.author}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-12 flex-shrink-0 border border-foreground/20 flex items-center justify-center bg-foreground/5">
                                                <span className="text-sm font-semibold text-foreground/60">
                                                    {item.author.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-foreground/90">{item.author}</p>
                                            {item.role && (
                                                <p className="text-sm text-foreground/60 mt-1">{item.role}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="border border-foreground/10 py-16 px-4 lg:p-24">
                        <div className="max-w-3xl mx-auto text-center space-y-8">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                Ready to Innovate?
                            </h2>
                            <p className="text-md leading-relaxed text-foreground/70">
                                Join the Innovation Lab and transform your ideas into reality. Whether you're a student, researcher, or entrepreneur, we provide the tools and community you need to succeed.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button size="lg" className="px-8 text-sm uppercase tracking-wider w-full md:w-auto">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 w-full md:w-auto text-sm uppercase tracking-wider"
                                    asChild
                                >
                                    <Link href="/about">Learn More About Us</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}