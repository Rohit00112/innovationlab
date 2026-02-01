"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw } from "lucide-react";

interface ContactDetail {
    title: string;
    description: string;
}

interface ContactPageContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    contactDetails: ContactDetail[];
    locationTitle: string;
    locationDescription: string;
    mapEmbedUrl: string;
}

const defaultContent: ContactPageContent = {
    heroTitle: "Let's Build Something Great",
    heroSubtitle: "Get in Touch",
    heroDescription: "Whether you're exploring collaboration, need support on a project, or want a tour of the lab, we're here to help.",
    contactDetails: [
        { title: "Visit the Lab", description: "Itahari International College, 4th Floor Innovation Wing, Sunsari 56705" },
        { title: "Talk With Us", description: "+977-25-525123 (Sun–Fri, 9:00 AM – 5:00 PM)" },
        { title: "Write to Us", description: "hello@innovationlab.com" },
        { title: "Open Hours", description: "Drop-in mentoring every Wednesday & Thursday, 2:00 PM – 4:00 PM." },
    ],
    locationTitle: "Visit Innovation Labs",
    locationDescription: "We love welcoming new collaborators into the lab. Reach out at least 48 hours in advance so we can prep the right team and gear for you.",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13948.090852794756!2d87.3058053!3d26.6498704!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e1!3m2!1sen!2snp!4v1762175844952!5m2!1sen!2snp",
};

export default function ContactContentPage() {
    const [content, setContent] = useState<ContactPageContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/site-content?pageKey=contact&sectionKey=main");
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as ContactPageContent);
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
                    pageKey: "contact",
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

    const updateContactDetail = (index: number, field: keyof ContactDetail, value: string) => {
        setContent((prev) => ({
            ...prev,
            contactDetails: prev.contactDetails.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            ),
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
                    <h1 className="text-3xl font-bold tracking-tight">Contact Page Content</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage the content displayed on the Contact page.
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
                    <CardDescription>The main headline for the Contact page.</CardDescription>
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

            {/* Contact Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>Address, phone, email, and hours information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.contactDetails.map((detail, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={detail.title}
                                        onChange={(e) => updateContactDetail(index, "title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        value={detail.description}
                                        onChange={(e) => updateContactDetail(index, "description", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Location Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Location Section</CardTitle>
                    <CardDescription>Map and location information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="locationTitle">Section Title</Label>
                            <Input
                                id="locationTitle"
                                value={content.locationTitle}
                                onChange={(e) => setContent({ ...content, locationTitle: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="locationDescription">Section Description</Label>
                            <Textarea
                                id="locationDescription"
                                value={content.locationDescription}
                                onChange={(e) => setContent({ ...content, locationDescription: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                        <Input
                            id="mapEmbedUrl"
                            value={content.mapEmbedUrl}
                            onChange={(e) => setContent({ ...content, mapEmbedUrl: e.target.value })}
                            placeholder="https://www.google.com/maps/embed?..."
                        />
                        <p className="text-xs text-muted-foreground">
                            Get this from Google Maps → Share → Embed a map → Copy the src URL from the iframe.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
