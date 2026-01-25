import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/auth/service";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function SettingsPage() {
    const cookieStore = await cookies();
    const session = await getSessionUser(cookieStore);

    if (!session) {
        redirect("/login?redirect=/dashboard/settings");
    }

    return (
        <div className="container mx-auto py-10 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings and security
                </p>
            </div>

            <div className="max-w-xl">
                <ChangePasswordForm />
            </div>
        </div>
    );
}
