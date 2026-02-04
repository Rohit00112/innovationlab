import type { MetadataRoute } from "next";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://innovationlab.edu.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/news`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/communities`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/team`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/faqs`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/testimonials`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // Dynamic pages from database
    let dynamicPages: MetadataRoute.Sitemap = [];

    try {
        // Published news articles
        const newsArticles = await db
            .select({
                slug: schema.news.slug,
                updatedAt: schema.news.updatedAt,
            })
            .from(schema.news)
            .where(eq(schema.news.status, "published"));

        const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
            url: `${BASE_URL}/news/${article.slug}`,
            lastModified: article.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

        // Published events
        const publishedEvents = await db
            .select({
                slug: schema.events.slug,
                updatedAt: schema.events.updatedAt,
            })
            .from(schema.events)
            .where(eq(schema.events.status, "published"));

        const eventPages: MetadataRoute.Sitemap = publishedEvents.map((event) => ({
            url: `${BASE_URL}/events/${event.slug}`,
            lastModified: event.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        // Published communities
        const publishedCommunities = await db
            .select({
                slug: schema.communities.slug,
                updatedAt: schema.communities.updatedAt,
            })
            .from(schema.communities)
            .where(eq(schema.communities.status, "published"));

        const communityPages: MetadataRoute.Sitemap = publishedCommunities.map(
            (community) => ({
                url: `${BASE_URL}/communities/${community.slug}`,
                lastModified: community.updatedAt,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            })
        );

        dynamicPages = [...newsPages, ...eventPages, ...communityPages];
    } catch (error) {
        // Log error but don't fail sitemap generation
        console.error("Error fetching dynamic sitemap entries:", error);
    }

    return [...staticPages, ...dynamicPages];
}
