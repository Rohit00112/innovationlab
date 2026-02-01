"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-8">
                {/* 404 Text with gradient */}
                <div className="relative">
                    <h1 className="text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/60 to-accent/40 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Oops! Page not found
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        The page you&apos;re looking for seems to have wandered off into the innovation void. Let&apos;s get you back on track.
                    </p>
                </div>

                {/* Decorative element */}
                <div className="flex items-center justify-center gap-2 py-4">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-border"></div>
                    <Rocket className="w-5 h-5 text-primary animate-bounce" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-border"></div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="px-8 h-12 text-base rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        asChild
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="px-8 h-12 text-base rounded-full border-primary/30 hover:bg-primary/10 hover:text-primary transition-all"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>

                {/* Quick links */}
                <div className="pt-8 space-y-4">
                    <p className="text-sm text-muted-foreground">Or explore these pages:</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {[
                            { label: "About", href: "/about" },
                            { label: "News", href: "/news" },
                            { label: "Events", href: "/events" },
                            { label: "Communities", href: "/communities" },
                            { label: "Contact", href: "/contact" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium rounded-full bg-card border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Search suggestion */}
                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span>Can&apos;t find what you&apos;re looking for? Visit our homepage</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
