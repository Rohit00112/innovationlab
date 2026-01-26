"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Phone, Users as UsersIcon, User, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

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
import type { EventRegistrationRecord, RegistrationStatus } from "@/lib/types/registrations"
import { getEventRegistrations } from "@/lib/http/registrations"

const statusConfig: Record<RegistrationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
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
        const headers = ["Name", "Email", "Phone", "Type", "Team Name", "Status", "Registered At"]
        const rows = registrations.map((reg) => [
            reg.participantName,
            reg.participantEmail,
            reg.participantPhone || "-",
            reg.registrationType,
            reg.teamName || "-",
            reg.status,
            formatDate(reg.createdAt),
        ])

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
                                <TableHead className="w-[300px]">Participant</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registered</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Loading registrations...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-destructive">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : registrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No registrations yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                registrations.map((registration) => {
                                    const StatusIcon = statusConfig[registration.status].icon
                                    return (
                                        <TableRow key={registration.id} className="group hover:bg-muted/20 border-border/50">
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
                                                <Badge variant={statusConfig[registration.status].variant} className="capitalize gap-1">
                                                    <StatusIcon className="h-3 w-3" />
                                                    {statusConfig[registration.status].label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(registration.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {registration.proposalLink && (
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
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
