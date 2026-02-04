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
    HomePageContent,
    CapabilityTile,
    AchievementStat,
    DEFAULT_HOME_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";

const defaultContent: HomePageContent = DEFAULT_HOME_CONTENT;

export default function HomeContentPage() {
    const [content, setContent] = useState<HomePageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/site-content?pageKey=${PAGE_KEYS.HOME}&sectionKey=${SECTION_KEYS.MAIN}`);
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as HomePageContent);
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
                    pageKey: PAGE_KEYS.HOME,
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

    const updateCapability = (index: number, field: keyof CapabilityTile, value: string) => {
        setContent((prev) => ({
            ...prev,
            capabilityTiles: prev.capabilityTiles.map((tile, i) =>
                i === index ? { ...tile, [field]: value } : tile
            ),
        }));
    };

    const updateStat = (index: number, field: keyof AchievementStat, value: string) => {
        setContent((prev) => ({
            ...prev,
            achievementStats: prev.achievementStats.map((stat, i) =>
                i === index ? { ...stat, [field]: value } : stat
            ),
        }));
    };

    // Add/Remove functions for capability tiles
    const addCapability = () => {
        setContent((prev) => ({
            ...prev,
            capabilityTiles: [...prev.capabilityTiles, { title: "", description: "" }],
        }));
    };

    const removeCapability = (index: number) => {
        setContent((prev) => ({
            ...prev,
            capabilityTiles: prev.capabilityTiles.filter((_, i) => i !== index),
        }));
    };

    // Add/Remove functions for achievement stats
    const addStat = () => {
        setContent((prev) => ({
            ...prev,
            achievementStats: [...prev.achievementStats, { value: "", label: "" }],
        }));
    };

    const removeStat = (index: number) => {
        setContent((prev) => ({
            ...prev,
            achievementStats: prev.achievementStats.filter((_, i) => i !== index),
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
                    <h1 className="text-3xl font-bold tracking-tight">Home Page Content</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage the content displayed on the homepage.
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
                    <CardDescription>The main headline and introduction text.</CardDescription>
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
                            <Label htmlFor="heroSubtitle">Subtitle</Label>
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

            {/* Capability Tiles */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Capability Tiles</CardTitle>
                            <CardDescription>Features and capabilities showcased on the homepage.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addCapability}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tile
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.capabilityTiles.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No capability tiles yet. Click "Add Tile" to create one.
                        </p>
                    ) : (
                        content.capabilityTiles.map((tile, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Tile {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeCapability(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={tile.title}
                                            onChange={(e) => updateCapability(index, "title", e.target.value)}
                                            placeholder="e.g., Machine Translation"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={tile.description}
                                            onChange={(e) => updateCapability(index, "description", e.target.value)}
                                            placeholder="Brief description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Achievement Stats */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Achievement Stats</CardTitle>
                            <CardDescription>Key statistics displayed in the achievements section.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addStat}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Stat
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {content.achievementStats.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No achievement stats yet. Click "Add Stat" to create one.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {content.achievementStats.map((stat, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">Stat {index + 1}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={() => removeStat(index)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Value</Label>
                                        <Input
                                            value={stat.value}
                                            onChange={(e) => updateStat(index, "value", e.target.value)}
                                            placeholder="e.g., 500+"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={stat.label}
                                            onChange={(e) => updateStat(index, "label", e.target.value)}
                                            placeholder="e.g., Projects delivered"
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
