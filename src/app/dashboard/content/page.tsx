"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
    Info,
    ExternalLink,
    RefreshCw,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { PAGE_KEYS, SECTION_KEYS } from "@/lib/types/site-content";

interface ContentSection {
    pageKey: string;
    sectionKey: string;
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    previewUrl?: string;
}

const CONTENT_SECTIONS: ContentSection[] = [
    {
        pageKey: PAGE_KEYS.ABOUT,
        sectionKey: SECTION_KEYS.MAIN,
        title: "About Page",
        description: "Milestones and journey timeline",
        icon: Info,
        href: "/dashboard/content/about",
        previewUrl: "/about",
    },
];

interface SectionStatus {
    pageKey: string;
    sectionKey: string;
    hasContent: boolean;
    lastUpdated?: string;
}

export default function ContentDashboardPage() {
    const [statuses, setStatuses] = useState<Record<string, SectionStatus>>({});
    const [loading, setLoading] = useState(true);

    const fetchStatuses = async () => {
        setLoading(true);
        const newStatuses: Record<string, SectionStatus> = {};

        await Promise.all(
            CONTENT_SECTIONS.map(async (section) => {
                try {
                    const res = await fetch(
                        `/api/site-content?pageKey=${encodeURIComponent(section.pageKey)}&sectionKey=${encodeURIComponent(section.sectionKey)}`
                    );
                    const data = await res.json();
                    const key = `${section.pageKey}-${section.sectionKey}`;

                    if (data.success && data.data) {
                        newStatuses[key] = {
                            pageKey: section.pageKey,
                            sectionKey: section.sectionKey,
                            hasContent: true,
                            lastUpdated: data.data.updatedAt,
                        };
                    } else {
                        newStatuses[key] = {
                            pageKey: section.pageKey,
                            sectionKey: section.sectionKey,
                            hasContent: false,
                        };
                    }
                } catch {
                    const key = `${section.pageKey}-${section.sectionKey}`;
                    newStatuses[key] = {
                        pageKey: section.pageKey,
                        sectionKey: section.sectionKey,
                        hasContent: false,
                    };
                }
            })
        );

        setStatuses(newStatuses);
        setLoading(false);
    };

    useEffect(() => {
        void fetchStatuses();
    }, []);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusKey = (section: ContentSection) =>
        `${section.pageKey}-${section.sectionKey}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage all site content from one place
                    </p>
                </div>
                <Button variant="outline" onClick={fetchStatuses} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh Status
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Sections</CardDescription>
                        <CardTitle className="text-3xl">{CONTENT_SECTIONS.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Configured</CardDescription>
                        <CardTitle className="text-3xl text-emerald-600">
                            {Object.values(statuses).filter((s) => s.hasContent).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Using Defaults</CardDescription>
                        <CardTitle className="text-3xl text-amber-600">
                            {
                                CONTENT_SECTIONS.length -
                                Object.values(statuses).filter((s) => s.hasContent).length
                            }
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Status</CardDescription>
                        <CardTitle className="text-3xl">
                            {loading ? (
                                <Spinner className="h-6 w-6" />
                            ) : (
                                <span className="text-emerald-600">Ready</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Content Sections Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {CONTENT_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const status = statuses[getStatusKey(section)];

                    return (
                        <Card key={getStatusKey(section)} className="relative overflow-hidden">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{section.title}</CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
                                        </div>
                                    </div>
                                    {loading ? (
                                        <Spinner className="h-4 w-4" />
                                    ) : status?.hasContent ? (
                                        <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-600/30">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Configured
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="gap-1 text-amber-600 border-amber-600/30">
                                            <XCircle className="h-3 w-3" />
                                            Default
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Last updated:{" "}
                                        <span className="font-medium">
                                            {loading ? "..." : formatDate(status?.lastUpdated)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {section.previewUrl && (
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={section.previewUrl} target="_blank">
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    Preview
                                                </Link>
                                            </Button>
                                        )}
                                        <Button size="sm" asChild>
                                            <Link href={section.href}>Edit</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Help Section */}
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-base">How Content Management Works</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>
                        <strong>Configured:</strong> Content has been customized and saved to the database.
                    </p>
                    <p>
                        <strong>Default:</strong> Using built-in default content. Edit to customize.
                    </p>
                    <p>
                        Changes are saved immediately and cached for fast loading. The cache automatically
                        refreshes when content is updated.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
