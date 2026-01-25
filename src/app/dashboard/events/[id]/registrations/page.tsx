import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, Phone, Users, User, ChevronDown, ChevronUp } from "lucide-react";

import { getSessionUser } from "@/lib/auth/service";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
    name: string;
    email?: string;
    phone?: string;
}

interface EventRegistration {
    id: number;
    registrationType: "individual" | "team";
    teamName: string | null;
    participantName: string;
    participantEmail: string;
    participantPhone: string | null;
    notes: string | null;
    teamMembers: string | null;
    status: string;
    createdAt: string;
    user: {
        id: number;
        name: string | null;
        email: string;
        avatarUrl: string | null;
    } | null;
}

interface RegistrationsResponse {
    data: EventRegistration[];
    event: {
        id: number;
        title: string;
    };
    total: number;
}

interface PageProps {
    params: Promise<{ id: string }>;
}

async function fetchRegistrations(eventId: string, sessionCookie: string): Promise<RegistrationsResponse | null> {
    const baseUrl = resolveApiBaseUrl();

    const response = await fetch(`${baseUrl}/api/events/${eventId}/registrations`, {
        headers: {
            Cookie: sessionCookie ? `session_token=${sessionCookie}` : "",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
}

function RegistrationCard({ registration }: { registration: EventRegistration }) {
    const isTeam = registration.registrationType === "team";
    const teamMembers: TeamMember[] = registration.teamMembers
        ? JSON.parse(registration.teamMembers)
        : [];

    return (
        <div className="border border-foreground/20 p-4 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isTeam ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                        {isTeam ? (
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                                {isTeam ? registration.teamName : registration.participantName}
                            </h3>
                            <Badge variant={isTeam ? "default" : "secondary"}>
                                {isTeam ? "Team" : "Individual"}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Registered {format(new Date(registration.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                    </div>
                </div>
                <Badge
                    variant={registration.status === "confirmed" ? "default" : "secondary"}
                >
                    {registration.status}
                </Badge>
            </div>

            {/* Primary Contact */}
            <div className="pl-12 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {isTeam ? "Team Leader" : "Contact Info"}
                </p>
                <div className="text-sm space-y-1">
                    <p className="font-medium">{registration.participantName}</p>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <a href={`mailto:${registration.participantEmail}`} className="flex items-center gap-1 hover:underline">
                            <Mail className="h-3 w-3" />
                            {registration.participantEmail}
                        </a>
                        {registration.participantPhone && (
                            <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {registration.participantPhone}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Team Members */}
            {isTeam && teamMembers.length > 0 && (
                <div className="pl-12 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Team Members ({teamMembers.length})
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-sm p-2 bg-foreground/5 rounded">
                                <p className="font-medium">{member.name || "Unnamed"}</p>
                                {member.email && (
                                    <p className="text-muted-foreground text-xs">{member.email}</p>
                                )}
                                {member.phone && (
                                    <p className="text-muted-foreground text-xs">{member.phone}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes */}
            {registration.notes && (
                <div className="pl-12">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-foreground/70">{registration.notes}</p>
                </div>
            )}
        </div>
    );
}

export default async function EventRegistrationsPage({ params }: PageProps) {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;

    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect("/login");
    }

    // Check admin/editor role
    if (!["admin", "editor"].includes(session.user.role)) {
        redirect("/dashboard");
    }

    const sessionCookie = cookieStore.get("session_token");
    const data = await fetchRegistrations(eventId, sessionCookie?.value ?? "");

    if (!data) {
        notFound();
    }

    const teamCount = data.data.filter(r => r.registrationType === "team").length;
    const individualCount = data.data.filter(r => r.registrationType === "individual").length;

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        href="/dashboard/events"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Events
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Registrations for &quot;{data.event.title}&quot;
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                        <span>{data.total} total registrations</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {teamCount} teams
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {individualCount} individuals
                        </span>
                    </div>
                </div>
            </div>

            {data.data.length === 0 ? (
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground">
                            No one has registered for this event yet.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {data.data.map((registration) => (
                        <RegistrationCard key={registration.id} registration={registration} />
                    ))}
                </div>
            )}
        </div>
    );
}
