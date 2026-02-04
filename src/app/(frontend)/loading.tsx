import { Skeleton } from "@/components/ui/skeleton";

export default function FrontendLoading() {
    return (
        <main className="w-full bg-background text-foreground">
            {/* Hero Section Skeleton */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-8">
                            <Skeleton className="h-8 w-48 rounded-full" />
                            <div className="space-y-4">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-16 w-1/2" />
                            </div>
                            <Skeleton className="h-24 w-full max-w-xl" />
                            <div className="flex gap-4">
                                <Skeleton className="h-12 w-40 rounded-xl" />
                                <Skeleton className="h-12 w-36 rounded-xl" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-12">
                                <Skeleton className="h-40 rounded-2xl" />
                                <Skeleton className="h-40 rounded-2xl" />
                            </div>
                            <div className="space-y-6">
                                <Skeleton className="h-40 rounded-2xl" />
                                <Skeleton className="h-40 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Section Skeleton */}
            <section className="py-24 bg-muted/30 border-y border-border/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-32 rounded-full" />
                            <Skeleton className="h-12 w-64" />
                        </div>
                        <Skeleton className="h-10 w-36 rounded-full" />
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50">
                                <Skeleton className="h-64 w-full" />
                                <div className="p-8 space-y-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-6 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section Skeleton */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-12 w-72" />
                        </div>
                        <Skeleton className="h-10 w-36 rounded-full" />
                    </div>

                    <div className="grid gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col md:flex-row bg-card rounded-3xl overflow-hidden border border-border/50">
                                <Skeleton className="h-48 md:h-auto md:w-1/3" />
                                <div className="flex-1 p-8 space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-12 w-full" />
                                    <div className="flex justify-between pt-4">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-8 w-24 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
