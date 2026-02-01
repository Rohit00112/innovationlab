"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw } from "lucide-react";

interface SocialLink {
    platform: string;
    url: string;
}

interface GlobalContent {
    siteName: string;
    siteTagline: string;
    footerText: string;
    copyrightText: string;
    socialLinks: SocialLink[];
}

const defaultContent: GlobalContent = {
    siteName: "Innovation Labs",
    siteTagline: "Where Ideas Come Alive",
    footerText: "Innovation Labs is a collaborative space for students to explore, create, and innovate at Itahari International College.",
    copyrightText: "© 2024 Innovation Labs. All rights reserved.",
    socialLinks: [
        { platform: "Facebook", url: "https://facebook.com/innovationlabs" },
        { platform: "Twitter", url: "https://twitter.com/innovationlabs" },
        { platform: "LinkedIn", url: "https://linkedin.com/company/innovationlabs" },
        { platform: "GitHub", url: "https://github.com/innovationlabs" },
    ],
};

export default function GlobalContentPage() {
    const [content, setContent] = useState<GlobalContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/site-content?pageKey=global&sectionKey=main");
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as GlobalContent);
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
                    pageKey: "global",
                    sectionKey: "main",
                    content,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Global settings saved successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to save settings" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        setContent((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            ),
        }));
    };

    const addSocialLink = () => {
        setContent((prev) => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
        }));
    };

    const removeSocialLink = (index: number) => {
        setContent((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
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
                    <h1 className="text-3xl font-bold tracking-tight">Global Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage site-wide settings like branding, footer, and social links.
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

            {/* Branding */}
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Site name and tagline used across the website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={content.siteName}
                                onChange={(e) => setContent({ ...content, siteName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="siteTagline">Tagline</Label>
                            <Input
                                id="siteTagline"
                                value={content.siteTagline}
                                onChange={(e) => setContent({ ...content, siteTagline: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <Card>
                <CardHeader>
                    <CardTitle>Footer</CardTitle>
                    <CardDescription>Footer text and copyright information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="footerText">Footer Description</Label>
                        <Textarea
                            id="footerText"
                            value={content.footerText}
                            onChange={(e) => setContent({ ...content, footerText: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="copyrightText">Copyright Text</Label>
                        <Input
                            id="copyrightText"
                            value={content.copyrightText}
                            onChange={(e) => setContent({ ...content, copyrightText: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Social Links</CardTitle>
                            <CardDescription>Links to your social media profiles.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addSocialLink}>
                            Add Link
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-3 items-end p-4 border rounded-lg">
                            <div className="flex-1 space-y-2">
                                <Label>Platform</Label>
                                <Input
                                    value={link.platform}
                                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                    placeholder="e.g., Facebook, Twitter"
                                />
                            </div>
                            <div className="flex-[2] space-y-2">
                                <Label>URL</Label>
                                <Input
                                    value={link.url}
                                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeSocialLink(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                    {content.socialLinks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No social links added yet. Click "Add Link" to add one.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
