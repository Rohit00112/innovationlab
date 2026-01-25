import Image from "next/image";
import { Users } from "lucide-react";

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";

export const revalidate = 60;

interface TeamMember {
    id: number;
    name: string;
    avatarUrl: string | null;
    role: "admin" | "editor" | "author";
}

interface TeamResponse {
    data: TeamMember[];
}

const roleLabels: Record<TeamMember["role"], string> = {
    admin: "Administrator",
    editor: "Editor",
    author: "Author",
};

async function fetchTeamMembers(): Promise<TeamMember[]> {
    const baseUrl = resolveApiBaseUrl();

    const response = await fetch(`${baseUrl}/api/team`, {
        next: { revalidate },
        cache: "force-cache",
    });

    if (!response.ok) {
        return [];
    }

    const data: TeamResponse = await response.json();
    return data.data;
}

export default async function TeamPage() {
    const members = await fetchTeamMembers();

    const admins = members.filter((m) => m.role === "admin");
    const editors = members.filter((m) => m.role === "editor");
    const authors = members.filter((m) => m.role === "author");

    return (
        <main className="w-full bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 border-b border-foreground/10">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 mb-6">
                        <Users className="h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Our Team
                    </h1>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Meet the people behind Innovation Lab who make it all happen.
                    </p>
                </div>
            </section>

            {/* Team Members */}
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6 lg:px-8 space-y-16">
                    {admins.length > 0 && (
                        <TeamSection title="Leadership" members={admins} />
                    )}

                    {editors.length > 0 && (
                        <TeamSection title="Editors" members={editors} />
                    )}

                    {authors.length > 0 && (
                        <TeamSection title="Authors" members={authors} />
                    )}

                    {members.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">No team members to display.</p>
                        </div>
                    )}
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
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8">
                {title}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    );
}

function MemberCard({ member }: { member: TeamMember }) {
    return (
        <div className="text-center">
            <div className="relative mb-4">
                {member.avatarUrl ? (
                    <Image
                        src={member.avatarUrl}
                        alt={member.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover mx-auto border-2 border-foreground/10"
                    />
                ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-foreground/10 flex items-center justify-center text-3xl font-medium mx-auto">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{roleLabels[member.role]}</p>
        </div>
    );
}
