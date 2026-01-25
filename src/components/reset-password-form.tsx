'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

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
    FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token")
        }
    }, [token])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!token) {
            setError("Invalid or missing reset token")
            return
        }

        setSubmitting(true)
        setError(null)
        setFieldErrors({})

        const formData = new FormData(event.currentTarget)
        const password = String(formData.get("password") ?? "")
        const confirmPassword = String(formData.get("confirmPassword") ?? "")

        if (password !== confirmPassword) {
            setFieldErrors({ confirmPassword: "Passwords do not match" })
            setSubmitting(false)
            return
        }

        const payload = {
            token,
            password,
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setError(data?.message ?? "Unable to reset password")
                setSubmitting(false)
                return
            }

            setSuccess(true)
            setTimeout(() => {
                router.replace("/login")
            }, 3000)
        } catch (err) {
            console.error("[reset-password]", err)
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
                            <CardTitle>Password reset successful</CardTitle>
                        </div>
                        <CardDescription>
                            Your password has been reset. Redirecting to login...
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button variant="outline" className="w-full">
                                Go to login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!token) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card className="shadow-none">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <CardTitle>Invalid link</CardTitle>
                        </div>
                        <CardDescription>
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/forgot-password">
                            <Button variant="outline" className="w-full">
                                Request new reset link
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
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="password">New Password</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                />
                                {fieldErrors.password && (
                                    <FieldError>{fieldErrors.password}</FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                />
                                {fieldErrors.confirmPassword && (
                                    <FieldError>{fieldErrors.confirmPassword}</FieldError>
                                )}
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
                                    Resetting...
                                </span>
                            ) : (
                                "Reset password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
