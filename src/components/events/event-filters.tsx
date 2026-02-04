"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EventFilters {
    search: string;
    timeFrame: "all" | "upcoming" | "past" | "this-week" | "this-month";
    locationType: "all" | "virtual" | "in-person";
}

interface EventFiltersProps {
    filters: EventFilters;
    onFiltersChange: (filters: EventFilters) => void;
    totalCount: number;
    filteredCount: number;
}

export function EventFiltersComponent({
    filters,
    onFiltersChange,
    totalCount,
    filteredCount,
}: EventFiltersProps) {
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = <K extends keyof EventFilters>(
        key: K,
        value: EventFilters[K]
    ) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange({
            search: "",
            timeFrame: "all",
            locationType: "all",
        });
    };

    const activeFilterCount = [
        filters.search.length > 0,
        filters.timeFrame !== "all",
        filters.locationType !== "all",
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        value={filters.search}
                        onChange={(e) => updateFilter("search", e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border/50 bg-background/50"
                    />
                    {filters.search && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => updateFilter("search", "")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Button
                    variant="outline"
                    className={cn(
                        "h-11 rounded-xl border-border/50 gap-2",
                        activeFilterCount > 0 && "border-primary/50 bg-primary/5"
                    )}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Select
                            value={filters.timeFrame}
                            onValueChange={(value) => updateFilter("timeFrame", value as EventFilters["timeFrame"])}
                        >
                            <SelectTrigger className="w-[150px] h-9 rounded-lg border-border/50">
                                <SelectValue placeholder="Time frame" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="past">Past Events</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Select
                            value={filters.locationType}
                            onValueChange={(value) => updateFilter("locationType", value as EventFilters["locationType"])}
                        >
                            <SelectTrigger className="w-[140px] h-9 rounded-lg border-border/50">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="virtual">Virtual</SelectItem>
                                <SelectItem value="in-person">In-Person</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-muted-foreground hover:text-foreground"
                            onClick={clearFilters}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear all
                        </Button>
                    )}
                </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {filteredCount === totalCount
                        ? `${totalCount} event${totalCount !== 1 ? "s" : ""}`
                        : `${filteredCount} of ${totalCount} events`}
                </span>
                {activeFilterCount > 0 && (
                    <div className="flex gap-2">
                        {filters.search && (
                            <Badge variant="secondary" className="gap-1">
                                &quot;{filters.search}&quot;
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => updateFilter("search", "")}
                                />
                            </Badge>
                        )}
                        {filters.timeFrame !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                {filters.timeFrame.replace("-", " ")}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => updateFilter("timeFrame", "all")}
                                />
                            </Badge>
                        )}
                        {filters.locationType !== "all" && (
                            <Badge variant="secondary" className="gap-1">
                                {filters.locationType}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => updateFilter("locationType", "all")}
                                />
                            </Badge>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export function filterEvents<T extends {
    title: string;
    summary?: string | null;
    description?: string | null;
    isVirtual: boolean;
    startsAt: string;
    endsAt?: string | null;
}>(events: T[], filters: EventFilters): T[] {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    return events.filter((event) => {
        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const titleMatch = event.title.toLowerCase().includes(searchLower);
            const summaryMatch = event.summary?.toLowerCase().includes(searchLower);
            const descMatch = event.description?.toLowerCase().includes(searchLower);
            if (!titleMatch && !summaryMatch && !descMatch) {
                return false;
            }
        }

        // Location type filter
        if (filters.locationType !== "all") {
            if (filters.locationType === "virtual" && !event.isVirtual) return false;
            if (filters.locationType === "in-person" && event.isVirtual) return false;
        }

        // Time frame filter
        if (filters.timeFrame !== "all") {
            const startTime = Date.parse(event.startsAt);
            const endTime = event.endsAt ? Date.parse(event.endsAt) : startTime;

            if (Number.isNaN(startTime)) return false;

            switch (filters.timeFrame) {
                case "upcoming":
                    if (endTime < now) return false;
                    break;
                case "past":
                    if (endTime >= now) return false;
                    break;
                case "this-week":
                    if (startTime < now || startTime > now + oneWeek) return false;
                    break;
                case "this-month":
                    if (startTime < now || startTime > now + oneMonth) return false;
                    break;
            }
        }

        return true;
    });
}
