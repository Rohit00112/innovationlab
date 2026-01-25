'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface ProfileFormProps {
    initialData: {
        name: string | null;
        avatarUrl: string | null;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const router = useRouter()
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(event.currentTarget)
        const payload = {
            name: String(formData.get("name") ?? "").trim() || null,
            avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
        }

        try {
            const response = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setError(data?.message ?? "Unable to update profile")
                setSubmitting(false)
                return
            }

            setSuccess(true)
            router.refresh()
        } catch (err) {
            console.error("[profile-update]", err)
            setError("Unexpected error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                defaultValue={initialData.name ?? ""}
                                autoComplete="name"
                                disabled={isSubmitting}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="avatarUrl">Avatar URL</FieldLabel>
                            <Input
                                id="avatarUrl"
                                name="avatarUrl"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                defaultValue={initialData.avatarUrl ?? ""}
                                disabled={isSubmitting}
                            />
                        </Field>
                    </FieldGroup>
                    {error && (
                        <FieldError>{error}</FieldError>
                    )}
                    {success && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Profile updated successfully!
                        </p>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
