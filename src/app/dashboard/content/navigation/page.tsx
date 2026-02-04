"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Save, RefreshCw, Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import {
    NavigationContent,
    NavItem,
    DEFAULT_NAVIGATION_CONTENT,
    PAGE_KEYS,
    SECTION_KEYS,
} from "@/lib/types/site-content";

const defaultContent: NavigationContent = DEFAULT_NAVIGATION_CONTENT;

export default function NavigationContentPage() {
    const [content, setContent] = useState<NavigationContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/site-content?pageKey=${PAGE_KEYS.GLOBAL}&sectionKey=${SECTION_KEYS.NAVIGATION}`);
            const data = await res.json();
            if (data.success && data.data?.content) {
                setContent(data.data.content as NavigationContent);
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
                    pageKey: PAGE_KEYS.GLOBAL,
                    sectionKey: SECTION_KEYS.NAVIGATION,
                    content,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Navigation saved successfully!" });
            } else {
                setMessage({ type: "error", text: data.message || "Failed to save navigation" });
            }
        } catch {
            setMessage({ type: "error", text: "Failed to save navigation" });
        } finally {
            setSaving(false);
        }
    };

    const updateNavItem = (index: number, field: keyof NavItem, value: string | boolean | number) => {
        setContent((prev) => ({
            ...prev,
            navItems: prev.navItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const toggleVisibility = (index: number) => {
        setContent((prev) => ({
            ...prev,
            navItems: prev.navItems.map((item, i) =>
                i === index ? { ...item, visible: !item.visible } : item
            ),
        }));
    };

    const addNavItem = () => {
        const newId = `nav-${Date.now()}`;
        const maxOrder = Math.max(...content.navItems.map((item) => item.order), 0);
        setContent((prev) => ({
            ...prev,
            navItems: [
                ...prev.navItems,
                { id: newId, label: "", href: "/", visible: true, order: maxOrder + 1 },
            ],
        }));
    };

    const removeNavItem = (index: number) => {
        setContent((prev) => ({
            ...prev,
            navItems: prev.navItems.filter((_, i) => i !== index),
        }));
    };

    const moveNavItem = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === content.navItems.length - 1)
        ) {
            return;
        }

        const newIndex = direction === "up" ? index - 1 : index + 1;
        const newItems = [...content.navItems];
        [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

        // Update order values
        newItems.forEach((item, i) => {
            item.order = i + 1;
        });

        setContent((prev) => ({ ...prev, navItems: newItems }));
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
                    <h1 className="text-3xl font-bold tracking-tight">Navigation Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage navbar items, visibility, and ordering.
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

            {/* Navigation Items */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Navigation Items</CardTitle>
                            <CardDescription>
                                Add, remove, reorder, and toggle visibility of navbar links.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={addNavItem}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {content.navItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No navigation items. Click &quot;Add Item&quot; to create one.
                        </p>
                    ) : (
                        content.navItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={`p-4 border rounded-lg space-y-3 transition-opacity ${!item.visible ? "opacity-50 bg-muted/30" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => moveNavItem(index, "up")}
                                                disabled={index === 0}
                                            >
                                                ▲
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => moveNavItem(index, "down")}
                                                disabled={index === content.navItems.length - 1}
                                            >
                                                ▼
                                            </Button>
                                        </div>
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            #{index + 1}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleVisibility(index)}
                                            className={item.visible ? "text-emerald-600" : "text-muted-foreground"}
                                        >
                                            {item.visible ? (
                                                <>
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Visible
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-1" />
                                                    Hidden
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => removeNavItem(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Label</Label>
                                        <Input
                                            value={item.label}
                                            onChange={(e) => updateNavItem(index, "label", e.target.value)}
                                            placeholder={"e.g., About Us"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Link (href)</Label>
                                        <Input
                                            value={item.href}
                                            onChange={(e) => updateNavItem(index, "href", e.target.value)}
                                            placeholder={"e.g., /about"}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* CTA Button Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Call-to-Action Button</CardTitle>
                    <CardDescription>
                        Configure the &quot;Get Started&quot; button in the navbar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label>Show CTA Button</Label>
                            <p className="text-sm text-muted-foreground">
                                Display the primary action button in the navbar
                            </p>
                        </div>
                        <Switch
                            checked={content.showGetStartedButton}
                            onCheckedChange={(checked) =>
                                setContent((prev) => ({ ...prev, showGetStartedButton: checked }))
                            }
                        />
                    </div>
                    {content.showGetStartedButton && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="ctaText">Button Text</Label>
                                <Input
                                    id="ctaText"
                                    value={content.getStartedButtonText}
                                    onChange={(e) =>
                                        setContent((prev) => ({
                                            ...prev,
                                            getStartedButtonText: e.target.value,
                                        }))
                                    }
                                    placeholder={"e.g., Get Started"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ctaLink">Button Link</Label>
                                <Input
                                    id="ctaLink"
                                    value={content.getStartedButtonLink}
                                    onChange={(e) =>
                                        setContent((prev) => ({
                                            ...prev,
                                            getStartedButtonLink: e.target.value,
                                        }))
                                    }
                                    placeholder={"e.g., /events"}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>How the navigation will appear (visible items only).</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                        {content.navItems
                            .filter((item) => item.visible)
                            .sort((a, b) => a.order - b.order)
                            .map((item) => (
                                <span
                                    key={item.id}
                                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-background border"
                                >
                                    {item.label || "(empty)"}
                                </span>
                            ))}
                        {content.showGetStartedButton && (
                            <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-indigo-600 text-white ml-auto">
                                {content.getStartedButtonText || "Get Started"}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
