'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EventRegisterButtonProps {
    eventId: number
    eventSlug: string
    hasRegistration?: boolean
}

export function EventRegisterButton({ eventId, eventSlug, hasRegistration = true }: EventRegisterButtonProps) {
    const router = useRouter()
    const [isLoading, setLoading] = useState(true)
    const [isRegistered, setRegistered] = useState(false)
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Skip checking registration status if registration is disabled
        if (!hasRegistration) {
            setLoading(false)
            return
        }

        async function checkStatus() {
            try {
                const response = await fetch(`/api/events/${eventId}/register`)
                if (response.ok) {
                    const data = await response.json()
                    setRegistered(data.isRegistered)
                }
            } catch (err) {
                console.error("[check-registration]", err)
            } finally {
                setLoading(false)
            }
        }
        checkStatus()
    }, [eventId, hasRegistration])

    async function handleCancel() {
        setSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`/api/events/${eventId}/register`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                setError(data?.message ?? "Unable to cancel registration")
                setSubmitting(false)
                return
            }

            setRegistered(false)
            router.refresh()
        } catch (err) {
            console.error("[cancel-registration]", err)
            setError("Unexpected error. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    // Don't render anything if registration is disabled
    if (!hasRegistration) {
        return null
    }

    if (isLoading) {
        return (
            <Button disabled className="w-full">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
            </Button>
        )
    }

    return (
        <div className="space-y-2">
            {isRegistered ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">You&apos;re registered!</span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Cancelling...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                <X className="h-4 w-4" />
                                Cancel Registration
                            </span>
                        )}
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={() => router.push(`/events/${eventSlug}/register`)}
                    disabled={isSubmitting}
                    className="w-full"
                >
                    Register for Event
                </Button>
            )}
            {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
            )}
        </div>
    )
}
