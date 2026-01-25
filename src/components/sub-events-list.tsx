'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'

interface SubEvent {
    id: number
    title: string
    slug: string
    summary: string | null
    image: string | null
    location: string | null
    isVirtual: boolean
    startsAt: string
    status: string
}

interface SubEventsListProps {
    parentEventId: number
}

export function SubEventsList({ parentEventId }: SubEventsListProps) {
    const [subEvents, setSubEvents] = useState<SubEvent[]>([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSubEvents() {
            try {
                const response = await fetch(`/api/events/${parentEventId}/sub-events`)
                if (response.ok) {
                    const data = await response.json()
                    setSubEvents(data.data)
                }
            } catch (err) {
                console.error('[sub-events]', err)
            } finally {
                setLoading(false)
            }
        }
        fetchSubEvents()
    }, [parentEventId])

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Loading sessions...</p>
            </div>
        )
    }

    if (subEvents.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            <div className="inline-flex border border-foreground/20 px-4 py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                    Sessions & Sub-Events
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {subEvents.map((event) => (
                    <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="block border border-foreground/20 p-4 hover:bg-foreground/5 transition-colors group"
                    >
                        <div className="flex gap-4">
                            {event.image && (
                                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium line-clamp-1 group-hover:underline">
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <CalendarDays className="h-3 w-3" />
                                    <span>
                                        {new Date(event.startsAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{event.isVirtual ? 'Online' : event.location || 'TBA'}</span>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground self-center group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
