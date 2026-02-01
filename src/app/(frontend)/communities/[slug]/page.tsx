import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, ArrowLeft, Github, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const revalidate = 60;

interface Community {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    content: string | null;
    coverImageUrl: string | null;
    status: string;
}

interface CommunityMember {
    id: number;
    name: string;
    title: string | null;
    bio: string | null;
    avatarUrl: string | null;
    role: "lead" | "member" | "advisor";
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
}

interface CommunityResponse {
    data: Community;
}

interface MembersResponse {
    data: CommunityMember[];
}

const roleLabels: Record<CommunityMember["role"], string> = {
    lead: "Lead",
    member: "Member",
    advisor: "Advisor",
};

async function fetchCommunityBySlug(slug: string): Promise<Community | null> {
    const baseUrl = resolveApiBaseUrl();

    // First fetch all published communities and find by slug
    const response = await fetch(`${baseUrl}/api/communities?status=published`, {
        next: { revalidate },
        cache: "force-cache",
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    const community = data.data.find((c: Community) => c.slug === slug);

    if (!community) {
        return null;
    }

    // Fetch full community details
    const detailResponse = await fetch(`${baseUrl}/api/communities/${community.id}`, {
        next: { revalidate },
        cache: "force-cache",
    });

    if (!detailResponse.ok) {
        return null;
    }

    const detailData: CommunityResponse = await detailResponse.json();
    return detailData.data;
}

async function fetchCommunityMembers(communityId: number): Promise<CommunityMember[]> {
    const baseUrl = resolveApiBaseUrl();

    const response = await fetch(`${baseUrl}/api/communities/${communityId}/members`, {
        next: { revalidate },
        cache: "force-cache",
    });

    if (!response.ok) {
        return [];
    }

    const data: MembersResponse = await response.json();
    return data.data;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CommunityDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const community = await fetchCommunityBySlug(slug);

    if (!community) {
        notFound();
    }

    const members = await fetchCommunityMembers(community.id);

    const leads = members.filter((m) => m.role === "lead");
    const regularMembers = members.filter((m) => m.role === "member");
    const advisors = members.filter((m) => m.role === "advisor");

    return (
        <main className="w-full bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/50">
                {/* Background */}
                <div className="absolute inset-0 bg-background z-0">
                    {community.coverImageUrl ? (
                        <>
                            <Image
                                src={community.coverImageUrl}
                                alt={community.name}
                                fill
                                className="object-cover opacity-20"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
                        </>
                    ) : (
                        <>
                            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-60"></div>
                        </>
                    )}
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
                    <Button variant="ghost" size="sm" className="mb-8" asChild>
                        <Link href="/communities">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            All Communities
                        </Link>
                    </Button>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        {community.name}
                    </h1>

                    {community.description && (
                        <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
                            {community.description}
                        </p>
                    )}

                    <div className="flex items-center gap-2 mt-8 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>{members.length} member{members.length === 1 ? "" : "s"}</span>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            {community.content && (
                <section className="py-16 border-b border-border/50">
                    <div className="mx-auto max-w-3xl px-6 lg:px-8">
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                {community.content}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Members Section */}
            <section className="py-24 bg-muted/30">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-24">
                    {leads.length > 0 && (
                        <MemberSection title="Leadership" members={leads} />
                    )}

                    {regularMembers.length > 0 && (
                        <MemberSection title="Members" members={regularMembers} />
                    )}

                    {advisors.length > 0 && (
                        <MemberSection title="Advisors" members={advisors} />
                    )}

                    {members.length === 0 && (
                        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/50">
                            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground font-medium">No members to display.</p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Check back later as members are added.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

function MemberSection({
    title,
    members,
}: {
    title: string;
    members: CommunityMember[];
}) {
    return (
        <div>
            <div className="flex items-center gap-4 mb-12">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    );
}

function MemberCard({ member }: { member: CommunityMember }) {
    const hasSocialLinks = member.linkedinUrl || member.githubUrl || member.websiteUrl;

    return (
        <div className="group relative bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px] text-center">
            <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {member.avatarUrl ? (
                    <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover border-4 border-background shadow-sm relative z-10"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-secondary/50 flex items-center justify-center text-3xl font-bold text-foreground/40 border-4 border-background shadow-sm relative z-10">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {member.name}
            </h3>

            {member.title && (
                <p className="text-sm text-muted-foreground mt-1">{member.title}</p>
            )}

            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                {roleLabels[member.role]}
            </span>

            {member.bio && (
                <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                    {member.bio}
                </p>
            )}

            {hasSocialLinks && (
                <div className="flex items-center justify-center gap-3 mt-4">
                    {member.linkedinUrl && (
                        <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    )}
                    {member.githubUrl && (
                        <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    )}
                    {member.websiteUrl && (
                        <a
                            href={member.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Globe className="h-5 w-5" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
