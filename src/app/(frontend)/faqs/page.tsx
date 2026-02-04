import { getActiveFaqs } from "@/lib/data/faqs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

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
        <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-muted-foreground">
                    Find answers to common questions about our platform, events, and community.
                </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {categories.length === 0 ? (
                    <div className="text-center p-8 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No FAQs available at the moment.</p>
                    </div>
                ) : (
                    categories.map((category) => {
                        const categoryFaqs = faqs.filter((f) => f.category === category);
                        if (categoryFaqs.length === 0) return null;

                        return (
                            <div key={category} className="space-y-4">
                                <h2 className="text-2xl font-semibold capitalize flex items-center gap-2">
                                    <Badge variant="outline" className="text-base py-1 px-3">
                                        {category}
                                    </Badge>
                                </h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {categoryFaqs.map((faq) => (
                                        <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                                            <AccordionTrigger className="text-left text-lg font-medium">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
