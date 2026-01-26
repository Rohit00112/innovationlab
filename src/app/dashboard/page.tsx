import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionUser } from "@/lib/auth/service"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Activity,
    ArrowUpRight,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    MoreHorizontal,
    Plus,
    Users,
    TrendingUp,
    TrendingDown,
    Clock,
    Zap,
    ArrowRight
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await getSessionUser(cookieStore)

    if (!session) {
        redirect("/login")
    }

    const { user } = session

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user.name?.split(' ')[0]}! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild className="rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Link href="/dashboard/news/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Article
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Main Content Area: Quick Actions */}
            <Card className="rounded-[2rem] border-border/50 shadow-sm bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                        Manage your content and platform settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link href="/dashboard/news" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">News Articles</h3>
                        <p className="text-sm text-muted-foreground">Manage and publish news stories.</p>
                    </Link>

                    <Link href="/dashboard/events" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Events</h3>
                        <p className="text-sm text-muted-foreground">Schedule and manage upcoming events.</p>
                    </Link>

                    <Link href="/dashboard/users" className="group relative overflow-hidden rounded-xl border bg-background p-6 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Users</h3>
                        <p className="text-sm text-muted-foreground">Manage platform users and roles.</p>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}