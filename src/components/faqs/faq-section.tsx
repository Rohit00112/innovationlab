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

export function FaqSection() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFaqs = async () => {
            try {
                const data = await fetchFaqs();
                // Fetch all active FAQs
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
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                        Got Questions?
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about the Innovation Lab, memberships, and events.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6 w-full">
                        {faqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                                <Accordion type="single" collapsible className="relative w-full h-full">
                                    <AccordionItem
                                        value={`item-${faq.id}`}
                                        className="h-full border-0 bg-card/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 data-[state=open]:bg-card/80 data-[state=open]:ring-1 data-[state=open]:ring-primary/20"
                                    >
                                        <AccordionTrigger className="px-6 py-5 text-left text-lg font-semibold hover:no-underline hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                                            <span className="mr-8 leading-snug">{faq.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 text-muted-foreground text-base leading-relaxed">
                                            <div className="pt-2 border-t border-border/50">
                                                {faq.answer}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
