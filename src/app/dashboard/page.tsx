
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/auth/service"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function Dashboard() {
    const cookieStore = await cookies()
    const session = await getSessionUser(cookieStore)

    if (!session) {
        redirect("/login")
    }

    const { user } = session

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Back!</CardTitle>
                            <CardDescription>
                                Overview of your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Name</label>
                                <p className="text-lg font-medium">{user.name || "Not provided"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="text-sm">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="capitalize">
                                    {user.role}
                                </Badge>
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                    {user.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                                <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                <p className="text-sm">{new Date(user.updatedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm text-muted-foreground">
                                    Use the logout button in the sidebar to sign out.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common dashboard actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a 
                                href="/dashboard/users" 
                                className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
                            >
                                <h3 className="font-medium">Manage Users</h3>
                                <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
                            </a>
                            <a 
                                href="/dashboard/news" 
                                className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
                            >
                                <h3 className="font-medium">News</h3>
                                <p className="text-sm text-muted-foreground">Manage news articles</p>
                            </a>
                            <a 
                                href="/dashboard/events" 
                                className="p-4 border rounded-lg hover:bg-muted transition-colors text-center"
                            >
                                <h3 className="font-medium">Events</h3>
                                <p className="text-sm text-muted-foreground">Create and manage events</p>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}