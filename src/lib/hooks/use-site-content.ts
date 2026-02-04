"use client";

import { useEffect, useState, useCallback } from "react";
import type { SiteContentRecord } from "@/lib/types/site-content";

// Re-export for convenience
export type { SiteContentRecord };

interface UseSiteContentResult<T> {
    content: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSiteContent<T>(
    pageKey: string,
    sectionKey: string,
    defaultContent: T
): UseSiteContentResult<T> {
    const [content, setContent] = useState<T>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `/api/site-content?pageKey=${encodeURIComponent(pageKey)}&sectionKey=${encodeURIComponent(sectionKey)}`
            );
            const data = await res.json();

            if (data.success && data.data?.content) {
                setContent(data.data.content as T);
            } else {
                // Use default content if no data in database
                setContent(defaultContent);
            }
        } catch (err) {
            console.error(`Failed to fetch site content for ${pageKey}/${sectionKey}:`, err);
            setError("Failed to load content");
            setContent(defaultContent);
        } finally {
            setLoading(false);
        }
    }, [pageKey, sectionKey, defaultContent]);

    useEffect(() => {
        void fetchContent();
    }, [fetchContent]);

    return {
        content,
        loading,
        error,
        refetch: fetchContent,
    };
}
