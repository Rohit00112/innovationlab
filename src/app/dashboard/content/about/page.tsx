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
    MissionPanel,
    AboutValue,
    Milestone,
    AchievementStat,
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
        } catch (error) {
            console.error("Failed to fetch content:", error);
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
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save content" });
        } finally {
            setSaving(false);
        }
    };

    const updateMissionPanel = (index: number, field: keyof MissionPanel, value: string) => {
        setContent((prev) => ({
            ...prev,
            missionPanels: prev.missionPanels.map((panel, i) =>
                i === index ? { ...panel, [field]: value } : panel
            ),
        }));
    };

    const updateValue = (index: number, field: keyof AboutValue, value: string) => {
        setContent((prev) => ({
            ...prev,
            values: prev.values.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
        }));
    };

    const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
        setContent((prev) => ({
            ...prev,
            milestones: prev.milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
        }));
    };

    const updateAchievement = (index: number, field: keyof AchievementStat, value: string) => {
        setContent((prev) => ({
            ...prev,
            achievements: prev.achievements.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
        }));
    };

    // Add/Remove functions for mission panels
    const addMissionPanel = () => {
        setContent((prev) => ({
            ...prev,
            missionPanels: [...prev.missionPanels, { title: "", subtitle: "", description: "" }],
        }));
    };

    const removeMissionPanel = (index: number) => {
        setContent((prev) => ({
            ...prev,
            missionPanels: prev.missionPanels.filter((_, i) => i !== index),
        }));
    };

    // Add/Remove functions for values
    const addValue = () => {
        setContent((prev) => ({
            ...prev,
            values: [...prev.values, { title: "", description: "" }],
        }));
    };

    const removeValue = (index: number) => {
        setContent((prev) => ({
            ...prev,
            values: prev.values.filter((_, i) => i !== index),
        }));
    };

    // Add/Remove functions for milestones
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

    // Add/Remove functions for achievements
    const addAchievement = () => {
        setContent((prev) => ({
            ...prev,
            achievements: [...prev.achievements, { value: "", label: "" }],
        }));
    };

    const removeAchievement = (index: number) => {
        setContent((prev) => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index),
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
                        Manage the content displayed on the About page.
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

            {/* Hero Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>The main headline and introduction for the About page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="heroTitle">Title</Label>
                            <Input
                                id="heroTitle"
                                value={content.heroTitle}
                                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="heroSubtitle">Subtitle / Badge</Label>
                            <Input
                                id="heroSubtitle"
                                value={content.heroSubtitle}
                                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroDescription">Description</Label>
                        <Textarea
                            id="heroDescription"
                            value={content.heroDescription}
                            onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Mission Panels */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Mission, Vision & Approach</CardTitle>
                            <CardDescription>Foundational panels displayed on the About page.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addMissionPanel}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Panel
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.missionPanels.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No mission panels yet. Click "Add Panel" to create one.
                        </p>
                    ) : (
                        content.missionPanels.map((panel, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Panel {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeMissionPanel(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={panel.title}
                                            onChange={(e) => updateMissionPanel(index, "title", e.target.value)}
                                            placeholder="e.g., Mission"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subtitle</Label>
                                        <Input
                                            value={panel.subtitle}
                                            onChange={(e) => updateMissionPanel(index, "subtitle", e.target.value)}
                                            placeholder="e.g., Empower Innovators"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={panel.description}
                                            onChange={(e) => updateMissionPanel(index, "description", e.target.value)}
                                            rows={2}
                                            placeholder="Panel description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Values */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Core Values</CardTitle>
                            <CardDescription>Values that drive the Innovation Lab.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addValue}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Value
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.values.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No core values yet. Click "Add Value" to create one.
                        </p>
                    ) : (
                        content.values.map((value, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Value {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeValue(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={value.title}
                                            onChange={(e) => updateValue(index, "title", e.target.value)}
                                            placeholder="e.g., Innovation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={value.description}
                                            onChange={(e) => updateValue(index, "description", e.target.value)}
                                            placeholder="Value description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

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
                            No milestones yet. Click "Add Milestone" to create one.
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
                                            placeholder="e.g., 2024"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={milestone.title}
                                            onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                            placeholder="e.g., Foundation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={milestone.description}
                                            onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                            rows={2}
                                            placeholder="Milestone details..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Achievement Stats</CardTitle>
                            <CardDescription>Key statistics displayed in the impact section.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addAchievement}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stat
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {content.achievements.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No achievement stats yet. Click "Add Stat" to create one.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {content.achievements.map((stat, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Stat {index + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={() => removeAchievement(index)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Value</Label>
                                        <Input
                                            value={stat.value}
                                            onChange={(e) => updateAchievement(index, "value", e.target.value)}
                                            placeholder="e.g., 500+"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={stat.label}
                                            onChange={(e) => updateAchievement(index, "label", e.target.value)}
                                            placeholder="e.g., Projects"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
