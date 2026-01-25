import Image from "next/image";
import { Quote } from "lucide-react";

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

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
            {/* Hero Section */}
            <section className="py-16 md:py-24 border-b border-foreground/10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        What People Say
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hear from our community members about their experiences with Innovation Lab.
                    </p>
                </div>
            </section>

            {/* Featured Testimonials */}
            {featured.length > 0 && (
                <section className="py-16 border-b border-foreground/10">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
                            Featured
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            {featured.map((testimonial) => (
                                <TestimonialCard key={testimonial.id} testimonial={testimonial} featured />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Testimonials */}
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6 lg:px-8">
                    {regular.length > 0 && (
                        <>
                            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
                                All Testimonials
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {regular.map((testimonial) => (
                                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                                ))}
                            </div>
                        </>
                    )}

                    {testimonials.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">No testimonials yet.</p>
                        </div>
                    )}
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
            className={`border border-foreground/20 p-6 ${featured ? "bg-foreground/5" : ""
                }`}
        >
            <Quote className="h-8 w-8 text-foreground/20 mb-4" />

            {testimonial.headline && (
                <h3 className="text-lg font-semibold mb-2">{testimonial.headline}</h3>
            )}

            <p className="text-foreground/70 leading-relaxed mb-6">
                {testimonial.body}
            </p>

            <div className="flex items-center gap-4">
                {testimonial.avatarUrl ? (
                    <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.authorName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center text-lg font-medium">
                        {testimonial.authorName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="font-medium">{testimonial.authorName}</p>
                    {(testimonial.authorTitle || testimonial.company) && (
                        <p className="text-sm text-muted-foreground">
                            {testimonial.authorTitle}
                            {testimonial.authorTitle && testimonial.company && " at "}
                            {testimonial.company}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
