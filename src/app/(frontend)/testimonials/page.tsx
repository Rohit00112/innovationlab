import Image from "next/image";
import { Quote, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface Testimonial {
    id: number;
    headline: string | null;
    body: string;
    authorName: string;
    authorTitle: string | null;
    company: string | null;
    avatarUrl: string | null;
    isFeatured: boolean;
}

interface TestimonialsResponse {
    data: Testimonial[];
}

async function fetchTestimonials(): Promise<Testimonial[]> {
    const baseUrl = resolveApiBaseUrl();
    const url = new URL("/api/testimonials", baseUrl);
    url.searchParams.set("status", "published");
    url.searchParams.set("limit", "50");

    const response = await fetch(url.toString(), {
        next: { revalidate },
        cache: "force-cache",
    });

    if (!response.ok) {
        return [];
    }

    const data: TestimonialsResponse = await response.json();
    return data.data;
}

export default async function TestimonialsPage() {
    const testimonials = await fetchTestimonials();
    const featured = testimonials.filter((t) => t.isFeatured);
    const regular = testimonials.filter((t) => !t.isFeatured);

    return (
        <main className="w-full bg-background text-foreground">
            {/* Animated Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-8">
                        <MessageSquare className="w-3 h-3" />
                        Community Voices
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Impact</span>
                    </h1>
                    <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Hear directly from our students, partners, and community members about their journey with Innovation Lab.
                    </p>
                </div>
            </section>

            {/* Featured Testimonials */}
            {featured.length > 0 && (
                <section className="py-24 border-b border-border/50 bg-muted/20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-border/50"></div>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                Featured Stories
                            </h2>
                            <div className="h-px flex-1 bg-border/50"></div>
                        </div>

                        <div className="grid gap-12 md:grid-cols-2">
                            {featured.map((testimonial) => (
                                <TestimonialCard key={testimonial.id} testimonial={testimonial} featured />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Testimonials */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {regular.length > 0 && (
                        <>
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold tracking-tight mb-4">
                                    More from the Community
                                </h2>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {regular.map((testimonial) => (
                                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                                ))}
                            </div>
                        </>
                    )}

                    {testimonials.length === 0 && (
                        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/50">
                            <Quote className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground font-medium">No testimonials yet.</p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Check back soon for stories from our community.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 border-t border-border/50 bg-primary/5">
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Have a story to share?</h2>
                    <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                        We&apos;d love to hear about your experience with Innovation Lab. Shoot us a message!
                    </p>
                    <Button className="rounded-full px-8 py-6 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                        <Link href="/contact">
                            Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}

function TestimonialCard({
    testimonial,
    featured = false,
}: {
    testimonial: Testimonial;
    featured?: boolean;
}) {
    return (
        <div
            className={`flex flex-col rounded-3xl p-8 transition-all duration-300 ${featured
                ? "bg-card border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-4px]"
                : "bg-background border border-border/50 hover:bg-card hover:border-border/80 hover:shadow-md"
                }`}
        >
            <Quote className={`mb-6 ${featured ? "h-10 w-10 text-primary/40" : "h-8 w-8 text-muted-foreground/30"}`} />

            {testimonial.headline && (
                <h3 className={`font-bold mb-4 tracking-tight ${featured ? "text-2xl" : "text-xl"}`}>{testimonial.headline}</h3>
            )}

            <p className="text-foreground/70 leading-relaxed mb-8 flex-1">
                &ldquo;{testimonial.body}&rdquo;
            </p>

            <div className={`flex items-center gap-4 pt-6 ${featured ? "border-t border-border/50" : ""}`}>
                {testimonial.avatarUrl ? (
                    <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.authorName}
                        width={featured ? 56 : 48}
                        height={featured ? 56 : 48}
                        className="rounded-full object-cover border-2 border-background shadow-sm"
                    />
                ) : (
                    <div className={`${featured ? "w-14 h-14" : "w-12 h-12"} rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-lg font-bold border-2 border-background shadow-sm`}>
                        {testimonial.authorName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className={`font-bold text-foreground ${featured ? "text-base" : "text-sm"}`}>{testimonial.authorName}</p>
                    {(testimonial.authorTitle || testimonial.company) && (
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                            {testimonial.authorTitle}
                            {testimonial.authorTitle && testimonial.company && " • "}
                            {testimonial.company}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

