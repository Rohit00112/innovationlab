"use client";

import { useEffect, useState, useCallback } from "react";

interface ContentEditorOptions<T> {
    pageKey: string;
    sectionKey: string;
    defaultContent: T;
}

interface ContentEditorResult<T> {
    content: T;
    setContent: React.Dispatch<React.SetStateAction<T>>;
    loading: boolean;
    saving: boolean;
    message: { type: "success" | "error"; text: string } | null;
    clearMessage: () => void;
    fetchContent: () => Promise<void>;
    saveContent: () => Promise<void>;
}

/**
 * Custom hook for managing site content with fetch/save functionality.
 * Reduces boilerplate in dashboard content pages.
 */
export function useContentEditor<T>(
    options: ContentEditorOptions<T>
): ContentEditorResult<T> {
    const { pageKey, sectionKey, defaultContent } = options;

    const [content, setContent] = useState<T>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `/api/site-content?pageKey=${encodeURIComponent(pageKey)}&sectionKey=${encodeURIComponent(sectionKey)}`
            );
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as T);
            }
        } catch (error) {
            console.error(`Failed to fetch content for ${pageKey}/${sectionKey}:`, error);
        } finally {
            setLoading(false);
        }
    }, [pageKey, sectionKey]);

    const saveContent = useCallback(async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/site-content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageKey,
                    sectionKey,
                    content,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Content saved successfully!" });
            } else {
                setMessage({
                    type: "error",
                    text: data.message || "Failed to save content",
                });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save content" });
        } finally {
            setSaving(false);
        }
    }, [pageKey, sectionKey, content]);

    useEffect(() => {
        void fetchContent();
    }, [fetchContent]);

    return {
        content,
        setContent,
        loading,
        saving,
        message,
        clearMessage,
        fetchContent,
        saveContent,
    };
}

/**
 * Helper to update a nested array item
 */
export function updateArrayItem<T, K extends keyof T>(
    array: T[],
    index: number,
    field: K,
    value: T[K]
): T[] {
    return array.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
    );
}

/**
 * Helper to add an item to an array
 */
export function addArrayItem<T>(array: T[], newItem: T): T[] {
    return [...array, newItem];
}

/**
 * Helper to remove an item from an array
 */
export function removeArrayItem<T>(array: T[], index: number): T[] {
    return array.filter((_, i) => i !== index);
}
