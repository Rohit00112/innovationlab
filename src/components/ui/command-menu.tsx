
"use client";

import * as React from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Newspaper, Users, HelpCircle, Loader2 } from "lucide-react";

type SearchResult = {
    id: string;
    title: string;
    href: string;
    type: "Event" | "News" | "Community" | "FAQ";
};

const typeIcons = {
    Event: Calendar,
    News: Newspaper,
    Community: Users,
    FAQ: HelpCircle,
};

const typeColors = {
    Event: "text-blue-500",
    News: "text-green-500",
    Community: "text-purple-500",
    FAQ: "text-orange-500",
};

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        if (debouncedQuery.length === 0) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        async function fetchResults() {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (error) {
                console.error("Search failed", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        setQuery("");
        command();
    }, []);

    // Group results by type
    const groupedResults = React.useMemo(() => {
        const groups: Record<string, SearchResult[]> = {};
        for (const result of results) {
            if (!groups[result.type]) {
                groups[result.type] = [];
            }
            groups[result.type].push(result);
        }
        return groups;
    }, [results]);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 rounded-full border-border/50 bg-background/50 hover:bg-secondary/80 text-muted-foreground lg:w-auto lg:px-3 lg:justify-start lg:bg-background/50"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline-flex lg:w-20 xl:w-40 text-left truncate">Search...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 xl:flex ml-auto">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search events, news, communities..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {loading && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                            Searching...
                        </div>
                    )}

                    {!loading && query.length > 0 && results.length === 0 && (
                        <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
                    )}

                    {!loading && Object.entries(groupedResults).map(([type, items]) => {
                        const Icon = typeIcons[type as keyof typeof typeIcons];
                        const color = typeColors[type as keyof typeof typeColors];

                        return (
                            <CommandGroup key={type} heading={type + "s"}>
                                {items.map((result) => (
                                    <CommandItem
                                        key={result.id}
                                        value={`${result.title} ${result.type}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(result.href));
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon className={`h-4 w-4 ${color}`} />
                                        <span className="flex-1 truncate">{result.title}</span>
                                        <span className="text-xs text-muted-foreground">{result.type}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        );
                    })}

                    {!loading && results.length > 0 && <CommandSeparator />}

                    <CommandGroup heading="Quick Links">
                        <CommandItem value="events" onSelect={() => runCommand(() => router.push("/events"))}>
                            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                            Browse Events
                        </CommandItem>
                        <CommandItem value="news" onSelect={() => runCommand(() => router.push("/news"))}>
                            <Newspaper className="mr-2 h-4 w-4 text-green-500" />
                            Latest News
                        </CommandItem>
                        <CommandItem value="communities" onSelect={() => runCommand(() => router.push("/communities"))}>
                            <Users className="mr-2 h-4 w-4 text-purple-500" />
                            Communities
                        </CommandItem>
                        <CommandItem value="about" onSelect={() => runCommand(() => router.push("/about"))}>
                            <HelpCircle className="mr-2 h-4 w-4 text-orange-500" />
                            About Us
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
