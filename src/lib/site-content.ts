import { SiteContentRecord } from "@/lib/types/site-content";

export type { SiteContentRecord };

// Server-side helper for fetching content
export async function getSiteContent<T>(
    pageKey: string,
    sectionKey: string,
    baseUrl?: string
): Promise<T | null> {
    try {
        const url = baseUrl
            ? `${baseUrl}/api/site-content?pageKey=${encodeURIComponent(pageKey)}&sectionKey=${encodeURIComponent(sectionKey)}`
            : `/api/site-content?pageKey=${encodeURIComponent(pageKey)}&sectionKey=${encodeURIComponent(sectionKey)}`;

        const res = await fetch(url, {
            cache: "no-store", // Always get fresh content
            next: { tags: [`site-content-${pageKey}-${sectionKey}`] }
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        if (data.success && data.data?.content) {
            return data.data.content as T;
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch site content for ${pageKey}/${sectionKey}:`, error);
        return null;
    }
}
