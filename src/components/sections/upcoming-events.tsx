import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function UpcomingEvents() {
    return (
        <section className="w-full py-20 border-t border-foreground/10">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-5xl font-bold tracking-tight mb-2">
                        UPCOMING EVENTS
                    </h2>
                </div>
                <Button className="aspect-square">
                    <ArrowUpRight size={28} />
                </Button>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        date: "Nov 12, 2025",
                        time: "10:00 AM – 5:00 PM",
                        title: "Design Futures Summit",
                        category: "Conference",
                        description:
                            "An inspiring gathering exploring the intersection of creativity, technology, and design innovation.",
                        location: "New York City, USA",
                        link: "#",
                    },
                    {
                        date: "Dec 05, 2025",
                        time: "9:00 AM – 3:00 PM",
                        title: "Creative Lab Workshop",
                        category: "Workshop",
                        description:
                            "A hands-on design session where teams collaborate to reimagine everyday experiences through design thinking.",
                        location: "Berlin, Germany",
                        link: "#",
                    },
                    {
                        date: "Jan 20, 2026",
                        time: "11:00 AM – 6:00 PM",
                        title: "Innovation Expo",
                        category: "Exhibition",
                        description:
                            "Showcasing our latest prototypes and collaborations with partners redefining digital craftsmanship.",
                        location: "Tokyo, Japan",
                        link: "#",
                    },
                ].map((event) => (
                    <Card
                        key={event.title}
                        className="border border-foreground/10 rounded-[0px] bg-background shadow-none"
                    >
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-center justify-between text-sm text-foreground/60 mb-2">
                                    <span className="uppercase tracking-wide">{event.date}</span>
                                    <span>{event.time}</span>
                                </div>

                                <div className="w-10 h-[2px] bg-primary mb-3" />

                                <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                                <p className="text-primary text-sm font-medium uppercase mb-3">
                                    {event.category}
                                </p>
                                <p className="text-foreground/70 text-base leading-relaxed mb-4">
                                    {event.description}
                                </p>
                            </div>

                            <div className="mt-auto border-t border-foreground/10 pt-4 flex items-center justify-between">
                                <p className="text-sm text-foreground/60 uppercase tracking-wide">
                                    {event.location}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary font-semibold hover:underline px-0"
                                    asChild
                                >
                                    <a href={event.link}>Learn More</a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
