import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { getSessionUser } from "@/lib/auth/service";
import { ThemeProvider } from "@/providers/theme-provider";
import { DashboardLogout } from "@/components/dashboard-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

import {
    Calendar,
    Settings,
    LayoutDashboard,
    FileText,
    Sparkles,
    Bell,
    Users2,
    HelpCircle,
    UserCircle
} from "lucide-react";

import "../globals.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "IVLABS Admin",
};

export default async function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect("/login");
    }

    return (
        <SidebarProvider className="bg-muted/40 min-h-screen font-sans">
            <AppSidebar user={session.user} />
            <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb className="hidden md:flex">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Overview</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">Notifications</span>
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </header>
                <div className="flex-1 p-6 md:p-8 pt-6 max-w-[1600px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

export function AppSidebar({ user }: { user: any }) {
    const items = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "News & Articles", url: "/dashboard/news", icon: FileText },
        { title: "Events", url: "/dashboard/events", icon: Calendar },
        { title: "Team", url: "/dashboard/team", icon: UserCircle },
        { title: "Communities", url: "/dashboard/communities", icon: Users2 },
        { title: "Testimonials", url: "/dashboard/testimonials", icon: Sparkles },
        { title: "FAQs", url: "/dashboard/faqs", icon: HelpCircle },
        { title: "Configuration", url: "/dashboard/settings", icon: Settings },
    ];

    return (
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-card">
            <SidebarHeader className="h-16 border-b border-border/50 flex items-center justify-center px-4">
                <div className="flex items-center gap-2 font-bold text-xl text-foreground w-full overflow-hidden transition-all">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="size-4" />
                    </div>
                    <span className="truncate group-data-[collapsible=icon]:hidden">IVLABS Admin</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-widest px-2 mb-2">Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/10 hover:text-primary transition-colors data-[active=true]:bg-primary/10 data-[active=true]:text-primary rounded-lg my-0.5 font-medium">
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-border/50 p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-muted/40 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                            <Avatar className="h-8 w-8 rounded-lg border border-border">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                                    {user.name?.charAt(0).toUpperCase() || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-semibold">{user.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DashboardLogout />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}