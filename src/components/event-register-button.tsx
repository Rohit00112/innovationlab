'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, X, Info } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EventRegisterButtonProps {
    eventId: number
    eventSlug: string
    hasRegistration?: boolean
}

function canCancelRegistration(createdAt: string | null): { canCancel: boolean; hoursLeft: number } {
    if (!createdAt) return { canCancel: false, hoursLeft: 0 }
    const registeredAt = new Date(createdAt)
    const now = new Date()
    const hoursSince = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60)
    const hoursLeft = Math.max(0, 24 - hoursSince)
    return { canCancel: hoursSince <= 24, hoursLeft }
}

export function EventRegisterButton({ eventId, eventSlug, hasRegistration = true }: EventRegisterButtonProps) {
    const router = useRouter()
    const [isLoading, setLoading] = useState(true)
    const [isRegistered, setRegistered] = useState(false)
    const [registeredAt, setRegisteredAt] = useState<string | null>(null)
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
                    setRegisteredAt(data.registration?.createdAt ?? null)
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
                    {(() => {
                        const { canCancel, hoursLeft } = canCancelRegistration(registeredAt)
                        return canCancel ? (
                            <>
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
                                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                                    <Info className="h-3 w-3" />
                                    You can cancel within {Math.ceil(hoursLeft)} hour{Math.ceil(hoursLeft) !== 1 ? "s" : ""}
                                </p>
                            </>
                        ) : (
                            <div className="rounded-lg bg-muted/50 border border-border px-3 py-2">
                                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                                    <Info className="h-3 w-3 flex-shrink-0" />
                                    The 24-hour cancellation window has passed. Registration can no longer be cancelled.
                                </p>
                            </div>
                        )
                    })()}
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
