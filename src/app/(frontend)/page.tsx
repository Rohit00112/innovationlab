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
    Clock,
    MapPin,
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


            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70"></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-70"></div>
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-secondary/80 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 opacity-70"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-accent/60 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 opacity-70"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8 relative">
                            {/* Decorative element */}
                            <div className="absolute -left-8 -top-8 w-24 h-24 border-t-2 border-l-2 border-primary/20 rounded-tl-3xl"></div>

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-primary/10 rounded-full text-xs font-medium tracking-wide text-primary shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Itahari International College
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                    INNOVATION
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">LAB</span>
                                </h1>
                                <p className="text-xl leading-relaxed text-foreground/80 max-w-xl">
                                    Transforming bold ideas into real-world solutions through technology, creativity, and collaborative innovation.
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

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-6 pt-12">
                                    <div className="glass-card p-8 rounded-2xl">
                                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary/10 rounded-xl text-primary">
                                            <Target className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-1 text-foreground">500+</h3>
                                        <p className="text-sm font-medium text-foreground/60">Projects Delivered</p>
                                    </div>
                                    <div className="glass-card p-8 rounded-2xl bg-primary/5 border-primary/20">
                                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/30">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-1 text-foreground">50+</h3>
                                        <p className="text-sm font-medium text-foreground/60">Active Members</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-card to-secondary/50">
                                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-secondary rounded-xl text-secondary-foreground">
                                            <Trophy className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-1 text-foreground">25</h3>
                                        <p className="text-sm font-medium text-foreground/60">Awards Won</p>
                                    </div>
                                    <div className="glass-card p-8 rounded-2xl">
                                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-accent/20 rounded-xl text-accent-foreground">
                                            <CalendarDays className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-1 text-foreground">12+</h3>
                                        <p className="text-sm font-medium text-foreground/60">Years Legacy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl -z-10"></div>
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
                                At the Innovation Lab, we empower students to transform bold ideas into real-world solutions. Through collaborative experimentation, cutting-edge technology, and creative thinking, we're shaping the future one project at a time.
                            </p>

                            <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 relative overflow-hidden group">
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
                                    color: "bg-orange-500/10 text-orange-600"
                                },
                                {
                                    icon: Code2,
                                    title: "Technical Development",
                                    description: "Hands-on experience with cutting-edge tools, frameworks, and technologies across multiple domains.",
                                    color: "bg-blue-500/10 text-blue-600"
                                },
                                {
                                    icon: Briefcase,
                                    title: "Project Execution",
                                    description: "Transform ideas into fully-realized projects with mentorship and industry-standard practices.",
                                    color: "bg-green-500/10 text-green-600"
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

            <section className="py-24 bg-muted/30 border-y border-border/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase border border-border/50">
                                Latest Updates
                            </span>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">News & Insights</h2>
                        </div>
                        <Button variant="outline" className="w-fit rounded-full px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                            <Link href="/news">
                                View All News
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {newsError && (
                        <p className="mb-8 text-sm text-destructive border border-destructive/20 p-4 rounded-xl bg-destructive/5">
                            {newsError}
                        </p>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {newsCards.map((item, index) => (
                            <article
                                key={`${item.href}-${index}`}
                                className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px]"
                            >
                                {item.image && (
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold shadow-sm">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 p-8 flex flex-col space-y-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <CalendarDays className="w-3 h-3" />
                                        <span>{item.date}</span>
                                        <span>•</span>
                                        <span>{item.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-4 flex-1">
                                        {item.description}
                                    </p>

                                    {item.href === "#" ? (
                                        <Button variant="ghost" className="p-0 h-auto text-sm font-semibold hover:bg-transparent hover:text-primary justify-start" disabled>
                                            Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" className="p-0 h-auto text-sm font-semibold hover:bg-transparent hover:text-primary justify-start" asChild>
                                            <Link href={item.href}>
                                                Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </article>
                        ))}
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

                    {eventsError && (
                        <p className="mb-8 text-sm text-destructive border border-destructive/20 p-4 rounded-xl bg-destructive/5">
                            {eventsError}
                        </p>
                    )}

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
                            } catch (e) {
                                day = "??";
                                month = "DEC";
                            }

                            return (
                                <article
                                    key={`${event.link}-${index}`}
                                    className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-2px]"
                                >
                                    <div className="flex flex-col md:flex-row h-full">
                                        {event.image && (
                                            <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden">
                                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            </div>
                                        )}
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

                                        {/* Stylized Date Badge */}
                                        <div className="absolute top-4 right-4 md:left-8 md:top-8 md:right-auto z-20 bg-background/95 backdrop-blur shadow-lg rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] border border-border/50 text-center">
                                            <span className="text-xs font-bold uppercase text-primary tracking-wider">{month || "UP"}</span>
                                            <span className="text-2xl font-bold text-foreground leading-none mt-1">{day || "NY"}</span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden bg-muted/30">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full filter blur-3xl opacity-50 -z-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                                    Our Focus
                                </span>
                                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                    Innovation Tracks
                                </h2>
                            </div>
                            <p className="text-lg leading-relaxed text-foreground/70">
                                We explore cutting-edge themes through our residency and challenge programs, combining technical excellence with responsible innovation and real-world impact.
                            </p>

                            <div className="grid gap-4 pt-8">
                                <div className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:bg-card/80 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Mentorship Programs</h3>
                                        <p className="text-sm text-foreground/70">110+ industry mentors guiding student projects</p>
                                    </div>
                                </div>
                                <div className="glass-card p-6 rounded-2xl flex items-start gap-4 hover:bg-card/80 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Global Collaborations</h3>
                                        <p className="text-sm text-foreground/70">72+ international pilot projects launched</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 relative">
                            {highlightTracks.map((track, index) => {
                                const Icon = track.icon;
                                const colors = [
                                    "from-violet-500/10 to-transparent border-violet-500/20",
                                    "from-pink-500/10 to-transparent border-pink-500/20",
                                    "from-cyan-500/10 to-transparent border-cyan-500/20"
                                ];
                                const iconColors = [
                                    "bg-violet-500/10 text-violet-600",
                                    "bg-pink-500/10 text-pink-600",
                                    "bg-cyan-500/10 text-cyan-600"
                                ];

                                return (
                                    <div
                                        key={track.title}
                                        className={`group relative p-8 rounded-3xl border bg-gradient-to-br ${colors[index % colors.length]} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                                    >
                                        <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Icon className="w-32 h-32" />
                                        </div>

                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColors[index % iconColors.length]} shadow-sm`}>
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-bold">{track.title}</h3>
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

            <section className="py-24 relative overflow-hidden">
                <div className="absolute -left-20 top-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="space-y-4 mb-16 text-center max-w-2xl mx-auto">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase border border-border/50">
                            Community
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Stories from the Lab</h2>
                    </div>

                    {testimonialsLoading && (
                        <div className="text-center text-foreground/60 py-12 flex items-center justify-center gap-2">
                            <CircleDashed className="animate-spin w-5 h-5" />
                            Loading stories...
                        </div>
                    )}

                    {testimonialsError && (
                        <p className="text-sm text-destructive border border-destructive/20 p-4 mb-8 rounded-xl bg-destructive/5 text-center">
                            {testimonialsError}
                        </p>
                    )}

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {!testimonialsLoading &&
                            displayTestimonials.map((item: any) => (
                                <div
                                    key={item.key}
                                    className="glass-card p-8 rounded-3xl space-y-6 flex flex-col relative group"
                                >
                                    <div className="text-6xl text-primary/20 font-serif absolute top-4 right-6 leading-none">"</div>

                                    <p className="text-base leading-relaxed text-foreground/80 relative z-10 italic">
                                        {item.quote}
                                    </p>

                                    <div className="pt-6 mt-auto border-t border-border/50 flex items-center gap-4">
                                        {item.image ? (
                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20 group-hover:border-primary transition-colors">
                                                <Image
                                                    src={item.image}
                                                    alt={item.author}
                                                    fill
                                                    className="object-cover"
                                                    sizes="48px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/5 text-primary font-bold">
                                                {item.author.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-foreground">{item.author}</p>
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

            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-primary/95 text-primary-foreground z-10"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-violet-600 to-indigo-700 z-10 opacity-90"></div>

                {/* Animated blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl animate-blob z-10"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-10"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-30">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wide uppercase border border-white/20 backdrop-blur-sm">
                            <Rocket className="w-3 h-3" />
                            Launch Your Ideas
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Innovate?</span>
                        </h2>

                        <p className="text-lg leading-relaxed text-white/80 max-w-2xl mx-auto">
                            Join the Innovation Lab and transform your ideas into reality. Whether you're a student, researcher, or entrepreneur, we provide the tools, community, and mentorship you need to succeed.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                            <Button size="lg" variant="secondary" className="px-10 h-14 text-base font-bold rounded-full shadow-xl shadow-black/20 hover:scale-105 transition-transform">
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                className="px-10 h-14 text-base font-medium rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10 backdrop-blur-sm transition-all"
                                asChild
                            >
                                <Link href="/about">Learn More About Us</Link>
                            </Button>
                        </div>

                        <p className="text-sm text-white/50 pt-8">
                            Join 50+ other students building the future today.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}