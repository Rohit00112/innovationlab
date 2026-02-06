"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import {
    AboutPageContent,
    Milestone,
    DEFAULT_ABOUT_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";

const defaultContent: AboutPageContent = DEFAULT_ABOUT_CONTENT;

export default function AboutContentPage() {
    const [content, setContent] = useState<AboutPageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/site-content?pageKey=${PAGE_KEYS.ABOUT}&sectionKey=${SECTION_KEYS.MAIN}`);
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as AboutPageContent);
            }
        } catch {
            // Failed to fetch content
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/site-content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pageKey: PAGE_KEYS.ABOUT,
                    sectionKey: SECTION_KEYS.MAIN,
                    content,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Content saved successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to save content" });
            }
        } catch {
            setMessage({ type: "error", text: "Failed to save content" });
        } finally {
            setSaving(false);
        }
    };

    const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
        setContent((prev) => ({
            ...prev,
            milestones: prev.milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
        }));
    };

    const addMilestone = () => {
        setContent((prev) => ({
            ...prev,
            milestones: [...prev.milestones, { year: "", title: "", description: "" }],
        }));
    };

    const removeMilestone = (index: number) => {
        setContent((prev) => ({
            ...prev,
            milestones: prev.milestones.filter((_, i) => i !== index),
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">About Page Content</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage the milestones displayed on the About page.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchContent} disabled={loading}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={saveContent} disabled={saving}>
                        {saving ? <Spinner className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {message && (
                <div
                    className={`p-4 rounded-lg border ${message.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                        : "bg-destructive/10 border-destructive/30 text-destructive"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Milestones */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Milestones</CardTitle>
                            <CardDescription>Key moments in the Innovation Lab journey.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addMilestone}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Milestone
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.milestones.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No milestones yet. Click &quot;Add Milestone&quot; to create one.
                        </p>
                    ) : (
                        content.milestones.map((milestone, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Milestone {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeMilestone(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Year</Label>
                                        <Input
                                            value={milestone.year}
                                            onChange={(e) => updateMilestone(index, "year", e.target.value)}
                                            placeholder={"e.g., 2024"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={milestone.title}
                                            onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                            placeholder={"e.g., Foundation"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={milestone.description}
                                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                            rows={2}
                                            placeholder={"Milestone details..."}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
