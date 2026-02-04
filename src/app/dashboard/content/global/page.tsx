"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    GlobalContent,
    SocialLink,
    DEFAULT_GLOBAL_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";
import {
    useContentEditor,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
} from "@/lib/hooks/use-content-editor";
import {
    ContentPageHeader,
    ContentMessage,
    ContentLoadingSpinner,
} from "@/components/dashboard/content-page-components";

export default function GlobalContentPage() {
    const {
        content,
        setContent,
        loading,
        saving,
        message,
        fetchContent,
        saveContent,
    } = useContentEditor<GlobalContent>({
        pageKey: PAGE_KEYS.GLOBAL,
        sectionKey: SECTION_KEYS.GLOBAL_SETTINGS,
        defaultContent: DEFAULT_GLOBAL_CONTENT,
    });

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        setContent((prev) => ({
            ...prev,
            socialLinks: updateArrayItem(prev.socialLinks, index, field, value),
        }));
    };

    const addSocialLink = () => {
        setContent((prev) => ({
            ...prev,
            socialLinks: addArrayItem(prev.socialLinks, { platform: "", url: "" }),
        }));
    };

    const removeSocialLink = (index: number) => {
        setContent((prev) => ({
            ...prev,
            socialLinks: removeArrayItem(prev.socialLinks, index),
        }));
    };

    if (loading) {
        return <ContentLoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <ContentPageHeader
                title="Global Settings"
                description="Manage site-wide settings like branding, footer, and social links."
                loading={loading}
                saving={saving}
                onRefresh={fetchContent}
                onSave={saveContent}
            />

            <ContentMessage message={message} />

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
