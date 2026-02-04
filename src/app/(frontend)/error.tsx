"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function FrontendError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Frontend error:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We encountered an unexpected error while loading this page.
                        Please try again or return to the homepage.
                    </p>
                </div>

                {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono bg-muted px-3 py-2 rounded-lg">
                        Error ID: {error.digest}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
