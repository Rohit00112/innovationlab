import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

interface Testimonials {
    title: string;
    quote: string;
    author: string;
    role: string;
    image: string;
}

export default function Testimonials() {
    const testimonials: Testimonials[] = [
        {
            image: "shadcn/ui",
            title: "",
            quote:
                "Our team has seen an incredible boost in productivity since adopting this platform. It's a game-changer for us!",
            author: "Sarah Williams",
            role: "Head of Product, @company",
        },
        {
            image: "NEXT.js",
            title: "",
            quote:
                "This tool has streamlined our development process and improved team collaboration like never before.",
            author: "David Parker",
            role: "CTO, @company",
        },
        {
            image: "tailwindcss",
            title: "",
            quote:
                "We’ve reduced our development cycles by 30% thanks to the clean component architecture and design system integration.",
            author: "Alex Kim",
            role: "Lead Developer, @company",
        },
    ];

    return (
        <section className="w-full py-20 bg-background">
            <div className=" mx-auto grid grid-cols-2 gap-8">
                <div className="md:col-span-1 flex flex-col justify-start">
                    <div className="w-full py-0 flex flex-row justify-between ">
                        <h2 className="text-5xl font-bold">TESTIMONIALS</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {testimonials.map((item: Testimonials, i) => (
                        <Card
                            key={i}
                            className="border border-border/70 rounded-[0px] py-8 bg-background shadow-none"
                        >
                            <CardHeader className="pb-2">
                                <div className="text-lg font-semibold text-foreground">
                                    {item.image}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-base text-foreground font-medium mb-6">
                                    {item.quote}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground/70">
                                        {item.author[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {item.author}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{item.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
