import Image from "next/image";
import Link from "next/link";
import { Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedCommunities } from "@/lib/data/communities";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface Community {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    coverImageUrl: string | null;
    memberCount: number;
}

export default async function CommunitiesPage() {
    const communities = await getPublishedCommunities() as Community[];

    return (
        <main className="w-full bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-xs font-semibold tracking-wide uppercase text-foreground/80 mb-8">
                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                        Community Labs
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Communities</span>
                    </h1>

                    <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        Explore the diverse communities within Innovation Lab, each focused on driving innovation in their domain.
                    </p>
                </div>
            </section>

            {/* Communities Grid */}
            <section className="py-24 bg-muted/30">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    {communities.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {communities.map((community) => (
                                <CommunityCard key={community.id} community={community} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/50">
                            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground font-medium">No communities to display.</p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Check back later as we add new communities.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-border/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Join a Community</h2>
                    <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                        Interested in joining one of our communities? Reach out to learn more about how you can get involved.
                    </p>
                    <Button className="rounded-full px-8 py-6 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                        <Link href="/contact">
                            Get in Touch <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}

function CommunityCard({ community }: { community: Community }) {
    return (
        <Link
            href={`/communities/${community.slug}`}
            className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px]"
        >
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {community.coverImageUrl ? (
                    <Image
                        src={community.coverImageUrl}
                        alt={community.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="h-16 w-16 text-foreground/10" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors mb-2">
                    {community.name}
                </h3>

                {community.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {community.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{community.memberCount} member{community.memberCount === 1 ? "" : "s"}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        View <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
