import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionUser } from "@/lib/auth/service"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowUpRight,
    Calendar,
    Plus,
    Settings,
    Sparkles,
    UserCircle,
    Users2,
    TrendingUp,
    TrendingDown,
    CalendarCheck,
} from "lucide-react"

import { db } from "@/lib/db";
import { communities, events, eventRegistrations, users, testimonials } from "@/lib/db/schema";
import { count, eq, gte, lt, and } from "drizzle-orm";

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await getSessionUser(cookieStore)

    if (!session) {
        redirect("/login")
    }

    const { user } = session

    // Date calculations for comparisons
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Parallel queries for performance
    const [
        [userCount],
        , // eventCount intentionally unused
        [communityCount],
        [registrationCount],
        [testimonialCount],
        [recentUsers],
        [recentRegistrations],
        [prevRegistrations],
        [publishedEvents],
        [upcomingEvents],
    ] = await Promise.all([
        db.select({ value: count() }).from(users),
        db.select({ value: count() }).from(events),
        db.select({ value: count() }).from(communities),
        db.select({ value: count() }).from(eventRegistrations),
        db.select({ value: count() }).from(testimonials),
        // Recent users (last 30 days)
        db.select({ value: count() }).from(users).where(gte(users.createdAt, thirtyDaysAgo)),
        // Recent registrations (last 30 days)
        db.select({ value: count() }).from(eventRegistrations).where(gte(eventRegistrations.createdAt, thirtyDaysAgo)),
        // Previous period registrations
        db.select({ value: count() }).from(eventRegistrations).where(and(gte(eventRegistrations.createdAt, sixtyDaysAgo), lt(eventRegistrations.createdAt, thirtyDaysAgo))),
        // Published events
        db.select({ value: count() }).from(events).where(eq(events.status, "published")),
        // Upcoming events
        db.select({ value: count() }).from(events).where(and(eq(events.status, "published"), gte(events.startsAt, now))),
    ])

    // Calculate trends
    const registrationTrend = prevRegistrations.value > 0
        ? Math.round(((recentRegistrations.value - prevRegistrations.value) / prevRegistrations.value) * 100)
        : recentRegistrations.value > 0 ? 100 : 0

    const stats = [
        {
            title: "Total Users",
            value: userCount.value,
            subtitle: `+${recentUsers.value} this month`,
            icon: Users2,
            color: "text-blue-500 dark:text-blue-400",
            bgColor: "bg-blue-500/10 dark:bg-blue-500/15"
        },
        {
            title: "Event Registrations",
            value: registrationCount.value,
            trend: registrationTrend,
            icon: CalendarCheck,
            color: "text-green-500 dark:text-green-400",
            bgColor: "bg-green-500/10 dark:bg-green-500/15"
        },
        {
            title: "Published Events",
            value: publishedEvents.value,
            subtitle: `${upcomingEvents.value} upcoming`,
            icon: Calendar,
            color: "text-purple-500 dark:text-purple-400",
            bgColor: "bg-purple-500/10 dark:bg-purple-500/15"
        },
        {
            title: "Communities",
            value: communityCount.value,
            icon: Users2,
            color: "text-orange-500 dark:text-orange-400",
            bgColor: "bg-orange-500/10 dark:bg-orange-500/15"
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user.name?.split(' ')[0]}! Here&apos;s what&apos;s happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Link href="/dashboard/events">
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="rounded-2xl border-border/50 dark:border-border/30 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5 transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                {stat.trend !== undefined && (
                                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {stat.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {Math.abs(stat.trend)}%
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                                {stat.subtitle && (
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">{stat.subtitle}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Summary Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-pink-500/10 dark:bg-pink-500/15">
                            <Sparkles className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{testimonialCount.value}</p>
                            <p className="text-sm text-muted-foreground">Testimonials</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15">
                            <Users2 className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{communityCount.value}</p>
                            <p className="text-sm text-muted-foreground">Communities</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6">
                <Card className="rounded-2xl border-border/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>Manage your content and platform</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                        <Link href="/dashboard/events" className="group flex items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-all">
                            <div className="p-2 rounded-full bg-purple-500/10 dark:bg-purple-500/15">
                                <Calendar className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Events</h3>
                                <p className="text-xs text-muted-foreground">Schedule and manage events</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>

                        <Link href="/dashboard/team" className="group flex items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-all">
                            <div className="p-2 rounded-full bg-orange-500/10 dark:bg-orange-500/15">
                                <UserCircle className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Team</h3>
                                <p className="text-xs text-muted-foreground">Manage team members</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>

                        <Link href="/dashboard/communities" className="group flex items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-all">
                            <div className="p-2 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15">
                                <Users2 className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Communities</h3>
                                <p className="text-xs text-muted-foreground">Manage community labs</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>

                        <Link href="/dashboard/settings" className="group flex items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-all">
                            <div className="p-2 rounded-full bg-slate-500/10 dark:bg-slate-400/10">
                                <Settings className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">Settings</h3>
                                <p className="text-xs text-muted-foreground">Platform configuration</p>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}