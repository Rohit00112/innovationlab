import { getActiveFaqs } from "@/lib/data/faqs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Faq {
    id: number;
    question: string;
    answer: string;
    category: string;
    displayOrder: number;
    isActive: boolean;
}

export default async function FaqPage() {
    let faqs: Faq[] = [];
    try {
        faqs = await getActiveFaqs() as Faq[];
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
    }

    const categories = Array.from(new Set(faqs.map((f) => f.category)));

    return (
        <div className="relative min-h-screen">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-background to-background" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-3xl" />

            <div className="relative max-w-3xl mx-auto py-16 md:py-24 px-6">
                {/* Header */}
                <div className="text-center space-y-4 mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Support
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Find answers to common questions about our platform, events, and community.
                    </p>
                </div>

                {/* FAQ Content */}
                {categories.length === 0 ? (
                    <div className="text-center p-12 rounded-xl ring-1 ring-border/40 bg-card/60">
                        <HelpCircle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground">No FAQs available at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {categories.map((category) => {
                            const categoryFaqs = faqs.filter((f) => f.category === category);
                            if (categoryFaqs.length === 0) return null;

                            return (
                                <div key={category} className="space-y-4">
                                    <Badge variant="outline" className="text-sm py-1.5 px-4 capitalize font-semibold">
                                        {category}
                                    </Badge>
                                    <Accordion type="single" collapsible className="space-y-3">
                                        {categoryFaqs.map((faq, index) => (
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
                                                    <div className="pl-12 text-muted-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
                                                        {faq.answer}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-14 text-center">
                    <p className="text-muted-foreground text-sm">
                        Still have questions?{" "}
                        <Link href="/contact" className="text-primary font-medium hover:underline underline-offset-4">
                            Get in touch
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
