'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

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

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
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
            email: String(formData.get("email") ?? "").trim(),
            password,
            name: String(formData.get("name") ?? "").trim() || undefined,
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                if (data?.errors?.fieldErrors) {
                    const errors: Record<string, string> = {}
                    for (const [key, messages] of Object.entries(data.errors.fieldErrors)) {
                        if (Array.isArray(messages) && messages.length > 0) {
                            errors[key] = messages[0] as string
                        }
                    }
                    setFieldErrors(errors)
                } else {
                    setError(data?.message ?? "Unable to create account")
                }
                setSubmitting(false)
                return
            }

            router.replace("/dashboard")
            router.refresh()
        } catch (err) {
            console.error("[register]", err)
            setError("Unexpected error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name (optional)</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                />
                                {fieldErrors.name && (
                                    <FieldError>{fieldErrors.name}</FieldError>
                                )}
                            </Field>
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
                                {fieldErrors.email && (
                                    <FieldError>{fieldErrors.email}</FieldError>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                                    Creating account...
                                </span>
                            ) : (
                                "Create account"
                            )}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
