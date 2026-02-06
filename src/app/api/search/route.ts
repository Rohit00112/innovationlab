
import { db } from "@/lib/db";
import { communities, events, faqs } from "@/lib/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ results: [] });
        }

        const searchPattern = `%${query}%`;

        const [eventsResults, communitiesResults, faqsResults] = await Promise.all([
            db
                .select({
                    id: events.id,
                    title: events.title,
                    slug: events.slug,
                })
                .from(events)
                .where(
                    and(
                        eq(events.status, "published"),
                        or(ilike(events.title, searchPattern), ilike(events.description, searchPattern))
                    )
                )
                .limit(5),
            db
                .select({
                    id: communities.id,
                    name: communities.name,
                    slug: communities.slug,
                })
                .from(communities)
                .where(
                    and(
                        eq(communities.status, "published"),
                        or(ilike(communities.name, searchPattern), ilike(communities.description, searchPattern))
                    )
                )
                .limit(5),
            db
                .select({
                    id: faqs.id,
                    question: faqs.question,
                })
                .from(faqs)
                .where(
                    and(
                        eq(faqs.isActive, true),
                        ilike(faqs.question, searchPattern)
                    )
                )
                .limit(5),
        ]);

        const results = [
            ...eventsResults.map((item) => ({
                id: `event-${item.id}`,
                title: item.title,
                href: `/events/${item.slug}`,
                type: "Event" as const,
            })),
            ...communitiesResults.map((item) => ({
                id: `community-${item.id}`,
                title: item.name,
                href: `/communities/${item.slug}`,
                type: "Community" as const,
            })),
            ...faqsResults.map((item) => ({
                id: `faq-${item.id}`,
                title: item.question,
                href: `/faqs`,
                type: "FAQ" as const,
            })),
        ];

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
