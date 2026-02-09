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
        <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Sessions & Sub-Events
                </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
                {subEvents.map((event) => {
                    const dateStr = new Date(event.startsAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'Asia/Kathmandu',
                    })
                    const timeStr = new Date(event.startsAt).toLocaleTimeString(undefined, {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZone: 'Asia/Kathmandu',
                    })

                    return (
                        <Link
                            key={event.id}
                            href={`/events/${event.slug}`}
                            className="group relative flex gap-4 bg-card rounded-2xl p-4 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:translate-y-[-2px] transition-all duration-300 overflow-hidden"
                        >
                            {event.image ? (
                                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            ) : (
                                <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center">
                                    <CalendarDays className="w-8 h-8 text-primary/20" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                                <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <CalendarDays className="h-3 w-3 text-primary/60" />
                                    <span>{dateStr}, {timeStr}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3 text-primary/60" />
                                    <span className="line-clamp-1">{event.isVirtual ? 'Online' : event.location || 'TBA'}</span>
                                </div>
                            </div>
                            <div className="flex items-center self-center pl-2">
                                <div className="w-8 h-8 rounded-full bg-secondary/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
