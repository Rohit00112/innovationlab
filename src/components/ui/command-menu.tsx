
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
import { Search } from "lucide-react";

type SearchResult = {
    id: string;
    title: string;
    href: string;
    type: "Event" | "Community" | "FAQ";
};

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = React.useState<SearchResult[]>([]);
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
            return;
        }

        async function fetchResults() {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (error) {
                console.error("Search failed", error);
                setResults([]);
            }
        }

        fetchResults();
    }, [debouncedQuery]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        command();
    }, []);

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
                    placeholder="Type a command or search..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {results.length > 0 ? (
                        <>
                            <CommandGroup heading="Search Results">
                                {results.map((result) => (
                                    <CommandItem
                                        key={result.id}
                                        value={`${result.title} ${result.type}`}
                                        onSelect={() => {
                                            runCommand(() => router.push(result.href));
                                        }}
                                    >
                                        <span className="mr-2 text-muted-foreground">[{result.type}]</span>
                                        {result.title}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    ) : null}

                    <CommandGroup heading="Suggestions">
                        <CommandItem value="events" onSelect={() => runCommand(() => router.push("/events"))}>
                            Events
                        </CommandItem>
                        <CommandItem value="communities" onSelect={() => runCommand(() => router.push("/communities"))}>
                            Communities
                        </CommandItem>
                        <CommandItem value="news" onSelect={() => runCommand(() => router.push("/news"))}>
                            News
                        </CommandItem>
                        <CommandItem value="about" onSelect={() => runCommand(() => router.push("/about"))}>
                            About
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
