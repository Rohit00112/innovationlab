"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Dashboard Error
                    </h1>
                    <p className="text-muted-foreground">
                        Something went wrong while loading this section.
                        Your data is safe - please try again.
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
                        <Link href="/dashboard">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
