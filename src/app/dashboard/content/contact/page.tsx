"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw, Plus, Trash2, MapPin, CheckCircle2, XCircle, HelpCircle, ExternalLink } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ContactPageContent,
    ContactDetail,
    DEFAULT_CONTACT_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";

const defaultContent: ContactPageContent = DEFAULT_CONTACT_CONTENT;

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
            const res = await fetch(`/api/site-content?pageKey=${PAGE_KEYS.CONTACT}&sectionKey=${SECTION_KEYS.MAIN}`);
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as ContactPageContent);
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
                    pageKey: PAGE_KEYS.CONTACT,
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

    const updateContactDetail = (index: number, field: keyof ContactDetail, value: string) => {
        setContent((prev) => ({
            ...prev,
            contactDetails: prev.contactDetails.map((detail, i) =>
                i === index ? { ...detail, [field]: value } : detail
            ),
        }));
    };

    // Add/Remove functions for contact details
    const addContactDetail = () => {
        setContent((prev) => ({
            ...prev,
            contactDetails: [...prev.contactDetails, { title: "", description: "" }],
        }));
    };

    const removeContactDetail = (index: number) => {
        setContent((prev) => ({
            ...prev,
            contactDetails: prev.contactDetails.filter((_, i) => i !== index),
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
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>Address, phone, email, and hours information.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addContactDetail}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Detail
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.contactDetails.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No contact details yet. Click &quot;Add Detail&quot; to create one.
                        </p>
                    ) : (
                        content.contactDetails.map((detail, index) => (
                            <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        Detail {index + 1}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => removeContactDetail(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={detail.title}
                                            onChange={(e) => updateContactDetail(index, "title", e.target.value)}
                                            placeholder={"e.g., Visit the Lab"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={detail.description}
                                            onChange={(e) => updateContactDetail(index, "description", e.target.value)}
                                            placeholder={"e.g., Address or info..."}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Location Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                            <CardTitle>Location Section</CardTitle>
                            <CardDescription>Map and location information.</CardDescription>
                        </div>
                    </div>
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

                    {/* Enhanced Map Embed Control */}
                    <MapEmbedControl
                        value={content.mapEmbedUrl}
                        onChange={(url) => setContent({ ...content, mapEmbedUrl: url })}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

// Enhanced Map Embed Control Component
function MapEmbedControl({ value, onChange }: { value: string; onChange: (url: string) => void }) {
    const [showHelp, setShowHelp] = useState(false);

    const isValidMapUrl = useMemo(() => {
        if (!value) return false;
        return value.includes("google.com/maps/embed") || value.includes("google.com/maps/d/embed");
    }, [value]);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="mapEmbedUrl" className="flex items-center gap-2">
                        Google Maps Embed URL
                        {value && (
                            isValidMapUrl ? (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Valid URL
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                    <XCircle className="h-3 w-3" />
                                    Invalid format
                                </span>
                            )
                        )}
                    </Label>
                </div>
                <div className="relative">
                    <Input
                        id="mapEmbedUrl"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={"https://www.google.com/maps/embed?pb=..."}
                        className={`pr-10 ${value && !isValidMapUrl ? "border-amber-500 focus-visible:ring-amber-500" : ""}`}
                    />
                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => onChange("")}
                        >
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Help Section */}
            <Collapsible open={showHelp} onOpenChange={setShowHelp}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                        <HelpCircle className="h-4 w-4" />
                        {showHelp ? "Hide instructions" : "How to get the embed URL"}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                    <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
                        <h4 className="font-medium text-sm">Steps to get Google Maps Embed URL:</h4>
                        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                            <li>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google Maps <ExternalLink className="h-3 w-3" /></a></li>
                            <li>Search for your location</li>
                            <li>Click the <strong>Share</strong> button (or menu)</li>
                            <li>Select <strong>&quot;Embed a map&quot;</strong> tab</li>
                            <li>Copy the <strong>src URL</strong> from the iframe code (starts with https://www.google.com/maps/embed...)</li>
                        </ol>
                        <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                                <strong>Tip:</strong> Only copy the URL inside <code className="bg-muted px-1 rounded">src=&quot;...&quot;</code>, not the entire iframe code.
                            </p>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Live Map Preview */}
            {value && (
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Map Preview</Label>
                    <div className="relative rounded-lg overflow-hidden border bg-muted/30">
                        {isValidMapUrl ? (
                            <iframe
                                src={value}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-2">
                                <MapPin className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Invalid map URL. Please check the format.</p>
                                <p className="text-xs">URL should contain &quot;google.com/maps/embed&quot;</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!value && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-muted-foreground gap-2">
                    <MapPin className="h-10 w-10 opacity-30" />
                    <p className="text-sm">No map configured</p>
                    <p className="text-xs">Add a Google Maps embed URL above to show a map</p>
                </div>
            )}
        </div>
    );
}
