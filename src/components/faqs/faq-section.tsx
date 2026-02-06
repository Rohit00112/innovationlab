"use client";

import { useEffect, useState } from "react";
import { fetchFaqs } from "@/lib/http/faqs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Faq } from "@/lib/types/faqs";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export function FaqSection() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const data = await fetchFaqs();
                setFaqs(data);
            } catch (error) {
                console.error("Failed to load FAQs", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFaqs();
    }, []);

    if (!isLoading && faqs.length === 0) return null;

    return (
        <section className="py-24 md:py-32 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-3xl" />

            <div className="max-w-3xl mx-auto px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center space-y-4 mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                        <HelpCircle className="h-3.5 w-3.5" />
                        FAQs
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Questions? <span className="text-primary">Answers.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Everything you need to know about the Innovation Lab, memberships, and events.
                    </p>
                </div>

                {/* FAQ Accordion */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-20 bg-muted/30 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="space-y-3">
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={faq.id}
                                value={`item-${faq.id}`}
                                className="border-0 rounded-xl bg-card/60 backdrop-blur-sm shadow-sm ring-1 ring-border/40 overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-border/60 data-[state=open]:shadow-lg data-[state=open]:ring-primary/30 data-[state=open]:bg-card"
                            >
                                <AccordionTrigger className="px-6 py-5 text-left hover:no-underline gap-4 [&[data-state=open]]:text-primary transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-base font-semibold leading-snug">{faq.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6 pt-0">
                                    <div className="pl-12 text-muted-foreground text-[15px] leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground text-sm">
                        Still have questions?{" "}
                        <Link href="/contact" className="text-primary font-medium hover:underline underline-offset-4">
                            Get in touch
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}
