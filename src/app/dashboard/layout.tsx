import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSessionUser } from "@/lib/auth/service";
import { ThemeProvider } from "@/providers/theme-provider";
import { DashboardLogout } from "@/components/dashboard-logout";

import { Calendar, Home, Inbox, Settings, UsersIcon } from "lucide-react";

import "../globals.css";

export default async function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect("/login");
    }

    return (
        <html suppressHydrationWarning>
            <head>
                <title>IVLABS ADMIN DASHBOARD</title>
            </head>
            <body>
                <SidebarProvider>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}

export function AppSidebar() {
    const items = [
        { title: "Home", url: "/dashboard", icon: Home },
        { title: "News", url: "/dashboard/news", icon: Inbox },
        { title: "Events", url: "/dashboard/events", icon: Calendar },
        //{ title: "About", url: "#", icon: UsersIcon },
        { title: "Testimonials", url: "/dashboard/testimonials", icon: UsersIcon },
        { title: "Users", url: "/dashboard/users", icon: UsersIcon },
        //{ title: "Settings", url: "#", icon: Settings },
    ];

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>MENU</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DashboardLogout />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </ThemeProvider>
    );
}