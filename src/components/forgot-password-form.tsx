'use client'

import { useState } from "react"
import Link from "next/link"
import { Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,

} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const payload = {
            email: String(formData.get("email") ?? "").trim(),
        }

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setError(data?.message ?? "Unable to process request")
                setSubmitting(false)
                return
            }

            setSuccess(true)
        } catch (err) {
            console.error("[forgot-password]", err)
            setError("Unexpected error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <CardTitle>Check your email</CardTitle>
                        </div>
                        <CardDescription>
                            If an account exists with that email, we&apos;ve sent password reset instructions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button variant="outline" className="w-full">
                                Back to login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                />
                            </Field>
                        </FieldGroup>
                        {error ? (
                            <p className="text-sm font-medium text-destructive" role="alert">
                                {error}
                            </p>
                        ) : null}
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </span>
                            ) : (
                                "Send reset link"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
