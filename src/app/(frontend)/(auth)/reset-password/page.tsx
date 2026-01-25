import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/reset-password-form";

function ResetPasswordContent() {
    return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <ResetPasswordContent />
                </Suspense>
            </div>
        </div>
    )
}
