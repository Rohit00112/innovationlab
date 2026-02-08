"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Phone, Users as UsersIcon, User, FileText, CheckCircle, XCircle, Clock, IdCard, ChevronDown, ChevronUp, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EventRegistrationRecord, RegistrationStatus, SubmissionValue } from "@/lib/types/registrations"
import { getEventRegistrations } from "@/lib/http/registrations"

interface TeamMember {
    name: string
    email?: string
    phone?: string
    londonmetId?: string
}

const statusConfig: Record<RegistrationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
    confirmed: { label: "Confirmed", variant: "default", icon: CheckCircle },
    pending: { label: "Pending", variant: "secondary", icon: Clock },
    cancelled: { label: "Cancelled", variant: "destructive", icon: XCircle },
}

export default function EventRegistrationsPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = parseInt(params.id as string)

    const [registrations, setRegistrations] = useState<EventRegistrationRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
    const [actionLoading, setActionLoading] = useState<number | null>(null)

    const toggleRow = (id: number) => {
        setExpandedRows(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const parseTeamMembers = (raw: string | null): TeamMember[] => {
        if (!raw) return []
        try {
            return JSON.parse(raw)
        } catch {
            return []
        }
    }

    const updateRegistrationStatus = async (registrationId: number, status: RegistrationStatus) => {
        setActionLoading(registrationId)
        try {
            const response = await fetch(`/api/events/${eventId}/registrations/${registrationId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.message ?? "Failed to update status")
            }
            setRegistrations(prev =>
                prev.map(r => r.id === registrationId ? { ...r, status } : r)
            )
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Failed to update status")
        } finally {
            setActionLoading(null)
        }
    }

    const deleteRegistration = async (registrationId: number) => {
        if (!confirm("Are you sure you want to delete this registration? This action cannot be undone.")) return
        setActionLoading(registrationId)
        try {
            const response = await fetch(`/api/events/${eventId}/registrations/${registrationId}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.message ?? "Failed to delete registration")
            }
            setRegistrations(prev => prev.filter(r => r.id !== registrationId))
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Failed to delete registration")
        } finally {
            setActionLoading(null)
        }
    }

    useEffect(() => {
        async function fetchRegistrations() {
            try {
                setIsLoading(true)
                const response = await getEventRegistrations(eventId)
                setRegistrations(response.data)
            } catch (err) {
                setError("Failed to load registrations")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        if (!isNaN(eventId)) {
            fetchRegistrations()
        }
    }, [eventId])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Phone", "LondonMet ID", "Type", "Team Name", "Team Members", "Notes", "Status", "Registered At"]
        const rows = registrations.map((reg) => {
            const members = parseTeamMembers(reg.teamMembers)
            const membersStr = members.map(m => `${m.name}${m.email ? ` (${m.email})` : ''}${m.londonmetId ? ` [${m.londonmetId}]` : ''}`).join('; ')
            return [
                reg.participantName,
                reg.participantEmail,
                reg.participantPhone || "-",
                reg.londonmetId || "-",
                reg.registrationType,
                reg.teamName || "-",
                membersStr || "-",
                reg.notes || "-",
                reg.status,
                formatDate(reg.createdAt),
            ]
        })

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.setAttribute("hidden", "")
        a.setAttribute("href", url)
        a.setAttribute("download", `event-${eventId}-registrations.csv`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const individualCount = registrations.filter((r) => r.registrationType === "individual").length
    const teamCount = registrations.filter((r) => r.registrationType === "team").length
    const confirmedCount = registrations.filter((r) => r.status === "confirmed").length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">Event Registrations</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and view all registrations for this event
                    </p>
                </div>
                <Button onClick={exportToCSV} className="rounded-xl" disabled={registrations.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            <Separator />

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="rounded-2xl border-border/50 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
                            <p className="text-2xl font-bold mt-1">{registrations.length}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-2xl border-border/50 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Individuals</p>
                            <p className="text-2xl font-bold mt-1">{individualCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-2xl border-border/50 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Teams</p>
                            <p className="text-2xl font-bold mt-1">{teamCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <UsersIcon className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                </Card>

                <Card className="rounded-2xl border-border/50 shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                            <p className="text-2xl font-bold mt-1">{confirmedCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Registrations Table */}
            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                <div className="border-t border-border/50">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="hover:bg-muted/40 border-border/50">
                                <TableHead className="w-75">Participant</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>LondonMet ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        Loading registrations...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-destructive">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : registrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                        No registrations yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                registrations.map((registration) => {
                                    const StatusIcon = statusConfig[registration.status].icon
                                    const teamMembers = parseTeamMembers(registration.teamMembers)
                                    const hasDetails = !!(registration.notes || teamMembers.length > 0)
                                    const isExpanded = expandedRows.has(registration.id)
                                    return (
                                        <React.Fragment key={registration.id}>
                                            <TableRow className="group hover:bg-muted/20 border-border/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-border/50">
                                                            <AvatarImage src={registration.user?.avatarUrl ?? undefined} />
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {getInitials(registration.participantName)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                                {registration.participantName}
                                                            </span>
                                                            {registration.teamName && (
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <UsersIcon className="h-3 w-3" />
                                                                    {registration.teamName}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {registration.registrationType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Mail className="h-3 w-3" />
                                                            {registration.participantEmail}
                                                        </div>
                                                        {registration.participantPhone && (
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Phone className="h-3 w-3" />
                                                                {registration.participantPhone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {registration.londonmetId ? (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span className="font-mono">{registration.londonmetId}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusConfig[registration.status].variant} className="capitalize gap-1">
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusConfig[registration.status].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(registration.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {/* Legacy proposalLink support */}
                                                        {registration.proposalLink && !registration.submissions?.length && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="h-8 text-muted-foreground hover:text-primary"
                                                            >
                                                                <Link href={registration.proposalLink} target="_blank">
                                                                    <FileText className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
                                                        {/* New submissions array */}
                                                        {registration.submissions && (registration.submissions as SubmissionValue[]).map((sub, idx) => (
                                                            <Button
                                                                key={idx}
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="h-8 text-muted-foreground hover:text-primary"
                                                                title={sub.fieldId}
                                                            >
                                                                <Link href={sub.value} target="_blank">
                                                                    <FileText className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        ))}
                                                        {hasDetails && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-muted-foreground hover:text-primary"
                                                                onClick={() => toggleRow(registration.id)}
                                                            >
                                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                            </Button>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                                    disabled={actionLoading === registration.id}
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {registration.status !== "confirmed" && (
                                                                    <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "confirmed")}>
                                                                        <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                                                                        Mark Confirmed
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {registration.status !== "pending" && (
                                                                    <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "pending")}>
                                                                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                                                        Mark Pending
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {registration.status !== "cancelled" && (
                                                                    <DropdownMenuItem onClick={() => updateRegistrationStatus(registration.id, "cancelled")}>
                                                                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                                                        Mark Cancelled
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteRegistration(registration.id)}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {/* Expandable details row */}
                                            {isExpanded && hasDetails && (
                                                <TableRow className="bg-muted/10 border-border/50">
                                                    <TableCell colSpan={7} className="py-4 px-6">
                                                        <div className="space-y-4">
                                                            {/* Notes */}
                                                            {registration.notes && (
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                                        Notes
                                                                    </div>
                                                                    <p className="text-sm text-foreground pl-5.5">
                                                                        {registration.notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {/* Team Members */}
                                                            {teamMembers.length > 0 && (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                                        <UsersIcon className="h-3.5 w-3.5" />
                                                                        Team Members ({teamMembers.length})
                                                                    </div>
                                                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pl-5.5">
                                                                        {teamMembers.map((member, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background"
                                                                            >
                                                                                <Avatar className="h-8 w-8 border border-border/50 mt-0.5">
                                                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                                                        {getInitials(member.name || '?')}
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <div className="flex flex-col gap-0.5 min-w-0">
                                                                                    <span className="text-sm font-medium truncate">
                                                                                        {member.name || 'Unnamed'}
                                                                                    </span>
                                                                                    {member.email && (
                                                                                        <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                                                                            <Mail className="h-3 w-3 shrink-0" />
                                                                                            {member.email}
                                                                                        </span>
                                                                                    )}
                                                                                    {member.phone && (
                                                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                                            <Phone className="h-3 w-3 shrink-0" />
                                                                                            {member.phone}
                                                                                        </span>
                                                                                    )}
                                                                                    {member.londonmetId && (
                                                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                                            <IdCard className="h-3 w-3 shrink-0" />
                                                                                            {member.londonmetId}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card >
        </div >
    )
}
