import Image from "next/image";
import { Users, Sparkles, ArrowRight, Linkedin, Github, Globe, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface TeamMember {
    id: number;
    name: string;
    position: string;
    bio: string | null;
    photoUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    category: "head" | "core" | "mentor";
}

interface TeamResponse {
    data: TeamMember[];
}

async function fetchTeamMembers(): Promise<TeamMember[]> {
    const baseUrl = resolveApiBaseUrl();

    const response = await fetch(`${baseUrl}/api/team`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        return [];
    }

    const data: TeamResponse = await response.json();
    return data.data;
}

export default async function TeamPage() {
    const members = await fetchTeamMembers();

    const heads = members.filter((m) => m.category === "head");
    const coreMembers = members.filter((m) => m.category === "core");
    const mentors = members.filter((m) => m.category === "mentor");

    return (
        <main className="w-full bg-background text-foreground">
            {/* Animated Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-background z-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-xs font-semibold tracking-wide uppercase text-foreground/80 mb-8">
                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                        Our People
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Builders</span>
                    </h1>

                    <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                        The strategists, creators, and mentors behind Innovation Lab who make it all happen.
                    </p>
                </div>
            </section>

            {/* Team Members */}
            <section className="py-24 bg-muted/30">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-24">
                    {/* Innovation Lab Head - Highlighted Section */}
                    {heads.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-12">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                                        Innovation Lab Head
                                    </h2>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 justify-center">
                                {heads.map((member) => (
                                    <HeadMemberCard key={member.id} member={member} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Core Members */}
                    {coreMembers.length > 0 && (
                        <TeamSection title="Core Members" members={coreMembers} />
                    )}

                    {/* Mentors */}
                    {mentors.length > 0 && (
                        <TeamSection title="Mentors" members={mentors} />
                    )}

                    {members.length === 0 && (
                        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border/50">
                            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground font-medium">No team members to display.</p>
                            <p className="text-sm text-muted-foreground/70 mt-2">Check back later as we update our roster.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-24 border-t border-border/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
                <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Join the Lab</h2>
                    <p className="text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                        Are you passionate about innovation and mentorship? We&apos;re always looking for new collaborators.
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

function TeamSection({
    title,
    members,
}: {
    title: string;
    members: TeamMember[];
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

// Special highlighted card for Innovation Lab Head
function HeadMemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="group relative bg-gradient-to-br from-primary/10 via-card to-card rounded-3xl p-8 border-2 border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:translate-y-[-4px] text-center">
            {/* Crown badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                <Crown className="w-3 h-3 inline-block mr-1" />
                Lab Head
            </div>

            <div className="relative mt-4 mb-6 mx-auto w-40 h-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                {member.photoUrl ? (
                    <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover border-4 border-primary/30 shadow-lg relative z-10 group-hover:border-primary transition-colors"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border-4 border-primary/30 shadow-lg relative z-10">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
            <p className="text-sm text-primary/80 font-medium mt-1">{member.position}</p>

            {member.bio && (
                <p className="text-sm text-foreground/70 mt-4 leading-relaxed">{member.bio}</p>
            )}

            {(member.linkedinUrl || member.githubUrl || member.websiteUrl) && (
                <div className="flex items-center justify-center gap-4 mt-6">
                    {member.linkedinUrl && (
                        <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    )}
                    {member.githubUrl && (
                        <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                    )}
                    {member.websiteUrl && (
                        <a
                            href={member.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                        >
                            <Globe className="h-5 w-5" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

function MemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="group relative bg-card rounded-3xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px] text-center">
            <div className="relative mb-6 mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {member.photoUrl ? (
                    <Image
                        src={member.photoUrl}
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
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{member.position}</p>

            {member.bio && (
                <p className="text-xs text-foreground/60 mt-3 line-clamp-2">{member.bio}</p>
            )}

            {(member.linkedinUrl || member.githubUrl || member.websiteUrl) && (
                <div className="flex items-center justify-center gap-3 mt-4">
                    {member.linkedinUrl && (
                        <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    )}
                    {member.githubUrl && (
                        <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                    )}
                    {member.websiteUrl && (
                        <a
                            href={member.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Globe className="h-4 w-4" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
