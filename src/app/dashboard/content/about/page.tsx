"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw } from "lucide-react";

interface MissionPanel {
    title: string;
    subtitle: string;
    description: string;
}

interface Value {
    title: string;
    description: string;
}

interface Milestone {
    year: string;
    title: string;
    description: string;
}

interface AchievementStat {
    value: string;
    label: string;
}

interface AboutPageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    missionPanels: MissionPanel[];
    values: Value[];
    milestones: Milestone[];
    achievements: AchievementStat[];
}

const defaultContent: AboutPageContent = {
    heroTitle: "SHAPING THE FUTURE",
    heroSubtitle: "About Us",
    heroDescription: "At Innovation Lab, we transform bold ideas into real-world solutions through technology, creativity, and collaborative innovation.",
    missionPanels: [
        { title: "Mission", subtitle: "Empower Innovators", description: "We provide students with the resources, mentorship, and collaborative environment needed to transform bold ideas into impactful solutions." },
        { title: "Vision", subtitle: "Lead Innovation", description: "To become a leading innovation hub that bridges academia and industry, fostering a culture of creativity, experimentation, and technological advancement." },
        { title: "Approach", subtitle: "Learning by Building", description: "Hands-on project-based learning combined with industry mentorship, enabling students to gain practical experience while developing innovative solutions." },
        { title: "Community", subtitle: "Inclusive by Design", description: "A diverse and welcoming community where every voice is heard, collaboration is celebrated, and innovation thrives through collective effort." },
    ],
    values: [
        { title: "Passion", description: "Driven by curiosity and enthusiasm to explore new technologies and push the boundaries of what's possible." },
        { title: "Collaboration", description: "Working together across disciplines to create solutions that are greater than the sum of their parts." },
        { title: "Innovation", description: "Constantly seeking new approaches, embracing failure as learning, and iterating toward breakthrough solutions." },
        { title: "Impact", description: "Creating meaningful change that extends beyond the lab, benefiting communities and society at large." },
    ],
    milestones: [
        { year: "2015", title: "Foundation", description: "Innovation Lab was established at Itahari International College with a vision to create a collaborative space for student innovation." },
        { year: "2018", title: "First Breakthrough", description: "Successfully launched our first major project, gaining recognition from industry partners." },
        { year: "2021", title: "Expansion", description: "Expanded our programs and partnerships, reaching international collaborators and broadening our impact." },
        { year: "2024", title: "Recognition", description: "Received multiple awards for innovation and community impact, solidifying our position as a leading student innovation hub." },
    ],
    achievements: [
        { value: "500+", label: "Projects delivered" },
        { value: "12+", label: "Years of momentum" },
        { value: "50+", label: "Collaborators" },
        { value: "25", label: "Awards & honours" },
    ],
};

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
            const res = await fetch("/api/site-content?pageKey=about&sectionKey=main");
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
                    pageKey: "about",
                    sectionKey: "main",
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

    const updateValue = (index: number, field: keyof Value, value: string) => {
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
                    <CardTitle>Mission, Vision & Approach</CardTitle>
                    <CardDescription>The four foundational panels displayed on the About page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.missionPanels.map((panel, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="text-sm font-medium text-muted-foreground">{panel.title}</div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input
                                        value={panel.subtitle}
                                        onChange={(e) => updateMissionPanel(index, "subtitle", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={panel.description}
                                        onChange={(e) => updateMissionPanel(index, "description", e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Values */}
            <Card>
                <CardHeader>
                    <CardTitle>Core Values</CardTitle>
                    <CardDescription>Values that drive the Innovation Lab.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.values.map((value, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={value.title}
                                        onChange={(e) => updateValue(index, "title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={value.description}
                                        onChange={(e) => updateValue(index, "description", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
                <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                    <CardDescription>Key moments in the Innovation Lab journey.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.milestones.map((milestone, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input
                                        value={milestone.year}
                                        onChange={(e) => updateMilestone(index, "year", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={milestone.title}
                                        onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={milestone.description}
                                        onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle>Achievement Stats</CardTitle>
                    <CardDescription>Key statistics displayed in the impact section.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {content.achievements.map((stat, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="space-y-2">
                                    <Label>Value</Label>
                                    <Input
                                        value={stat.value}
                                        onChange={(e) => updateAchievement(index, "value", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={stat.label}
                                        onChange={(e) => updateAchievement(index, "label", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
