"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw } from "lucide-react";

interface ContentPageHeaderProps {
    title: string;
    description: string;
    loading: boolean;
    saving: boolean;
    onRefresh: () => void;
    onSave: () => void;
}

/**
 * Reusable header component for content management pages.
 * Displays title, description, and action buttons (Refresh & Save).
 */
export function ContentPageHeader({
    title,
    description,
    loading,
    saving,
    onRefresh,
    onSave,
}: ContentPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onRefresh} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
                <Button onClick={onSave} disabled={saving}>
                    {saving ? (
                        <Spinner className="h-4 w-4 mr-2" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

interface ContentMessageProps {
    message: { type: "success" | "error"; text: string } | null;
}

/**
 * Reusable message component for displaying success/error feedback.
 */
export function ContentMessage({ message }: ContentMessageProps) {
    if (!message) return null;

    return (
        <div
            className={`p-4 rounded-lg border ${message.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                    : "bg-destructive/10 border-destructive/30 text-destructive"
                }`}
        >
            {message.text}
        </div>
    );
}

/**
 * Reusable loading spinner for content pages.
 */
export function ContentLoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-100">
            <Spinner className="h-8 w-8" />
        </div>
    );
}
