'use client'

import { useState } from "react"
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

export function ChangePasswordForm() {
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(event.currentTarget)
        const newPassword = String(formData.get("newPassword") ?? "")
        const confirmPassword = String(formData.get("confirmPassword") ?? "")

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match")
            setSubmitting(false)
            return
        }

        const payload = {
            currentPassword: String(formData.get("currentPassword") ?? ""),
            newPassword,
        }

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setError(data?.message ?? "Unable to change password")
                setSubmitting(false)
                return
            }

            setSuccess(true)
            // Clear the form
            event.currentTarget.reset()
        } catch (err) {
            console.error("[change-password]", err)
            setError("Unexpected error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                disabled={isSubmitting}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength={8}
                                autoComplete="new-password"
                                disabled={isSubmitting}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
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
                        </Field>
                    </FieldGroup>
                    {error && (
                        <FieldError>{error}</FieldError>
                    )}
                    {success && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Password changed successfully!
                        </p>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
