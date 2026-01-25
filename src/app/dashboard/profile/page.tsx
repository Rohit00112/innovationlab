import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { getSessionUser } from "@/lib/auth/service";
import { ProfileForm } from "@/components/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect("/login?redirect=/dashboard/profile");
    }

    const { user } = session;

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account information
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center text-center space-y-4">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name ?? "Profile"}
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-foreground/10 flex items-center justify-center text-3xl font-medium">
                                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-lg">{user.name ?? "No name set"}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <span className="inline-flex mt-2 px-2 py-1 text-xs font-medium rounded-full bg-foreground/10 capitalize">
                                    {user.role}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <ProfileForm initialData={{ name: user.name, avatarUrl: user.avatarUrl }} />
                </div>
            </div>
        </div>
    );
}
