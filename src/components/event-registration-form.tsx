'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X, Users, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { FileOrLinkInput } from '@/components/ui/file-or-link-input'
import type { AllowedRegistrationType, SubmissionField } from '@/lib/types/events'

interface TeamMember {
    name: string
    email: string
    phone?: string
}

interface EventRegistrationFormProps {
    eventId: number
    eventSlug: string
    eventTitle: string
    userEmail?: string
    userName?: string
    enableProposalSubmission: boolean
    submissionFields?: SubmissionField[] | null
    allowedRegistrationTypes: AllowedRegistrationType
}

export function EventRegistrationForm({
    eventId,
    eventSlug,
    eventTitle,
    userEmail = '',
    userName = '',
    enableProposalSubmission,
    submissionFields: rawSubmissionFields,
    allowedRegistrationTypes = 'both',
}: EventRegistrationFormProps) {
    const router = useRouter()
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submissions, setSubmissions] = useState<Record<string, string>>({})
    const [registrationType, setRegistrationType] = useState<'individual' | 'team'>(
        allowedRegistrationTypes === 'team' ? 'team' : 'individual'
    )
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', email: '', phone: '' }])

    // Normalize submission fields to always be an array
    const submissionFields = Array.isArray(rawSubmissionFields) ? rawSubmissionFields : []
    const hasSubmissionFields = enableProposalSubmission && submissionFields.length > 0

    const updateSubmission = (fieldId: string, value: string) => {
        setSubmissions(prev => ({ ...prev, [fieldId]: value }))
    }

    const addTeamMember = () => {
        setTeamMembers([...teamMembers, { name: '', email: '', phone: '' }])
    }

    const removeTeamMember = (index: number) => {
        if (teamMembers.length > 1) {
            setTeamMembers(teamMembers.filter((_, i) => i !== index))
        }
    }

    const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...teamMembers]
        updated[index] = { ...updated[index], [field]: value }
        setTeamMembers(updated)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        // Validate required submissions
        if (hasSubmissionFields) {
            for (const field of submissionFields) {
                if (field.required && !submissions[field.id]?.trim()) {
                    setError(`${field.title} is required`)
                    setSubmitting(false)
                    return
                }
            }
        }

        const formData = new FormData(event.currentTarget)

        // Build submissions array from the state
        const submissionsArray = hasSubmissionFields
            ? submissionFields
                .filter(field => submissions[field.id]?.trim())
                .map(field => ({
                    fieldId: field.id,
                    value: submissions[field.id].trim(),
                }))
            : null

        const payload: Record<string, unknown> = {
            registrationType,
            participantName: String(formData.get('participantName') ?? '').trim(),
            participantEmail: String(formData.get('participantEmail') ?? '').trim(),
            participantPhone: String(formData.get('participantPhone') ?? '').trim() || null,
            notes: String(formData.get('notes') ?? '').trim() || null,
            submissions: submissionsArray,
        }

        if (registrationType === 'team') {
            payload.teamName = String(formData.get('teamName') ?? '').trim()
            payload.teamMembers = teamMembers.filter(m => m.name.trim() || m.email.trim())
        }

        try {
            const response = await fetch(`/api/events/${eventId}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                if (response.status === 401) {
                    router.push(`/login?redirect=/events/${eventSlug}/register`)
                    return
                }
                setError(data?.message ?? 'Unable to complete registration')
                setSubmitting(false)
                return
            }

            router.push(`/events/${eventSlug}?registered=true`)
            router.refresh()
        } catch (err) {
            console.error('[registration]', err)
            setError('Unexpected error. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Link
                href={`/events/${eventSlug}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to event
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Register for Event</CardTitle>
                    <CardDescription>
                        {eventTitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Registration Type Toggle */}
                        {allowedRegistrationTypes === 'both' ? (
                            <div className="space-y-3">
                                <FieldLabel>Registration Type</FieldLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRegistrationType('individual')}
                                        className={`flex items-center justify-center gap-2 p-4 border rounded-lg transition-colors ${registrationType === 'individual'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-foreground/20 hover:border-foreground/40'
                                            }`}
                                    >
                                        <User className="h-5 w-5" />
                                        <span className="font-medium">Individual</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRegistrationType('team')}
                                        className={`flex items-center justify-center gap-2 p-4 border rounded-lg transition-colors ${registrationType === 'team'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-foreground/20 hover:border-foreground/40'
                                            }`}
                                    >
                                        <Users className="h-5 w-5" />
                                        <span className="font-medium">Team/Group</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Registration For</p>
                                    <p className="text-lg font-bold capitalize">
                                        {allowedRegistrationTypes === 'individual' ? 'Individual' : 'Team / Group'}
                                    </p>
                                </div>
                                {allowedRegistrationTypes === 'individual' ? (
                                    <User className="h-6 w-6 text-primary" />
                                ) : (
                                    <Users className="h-6 w-6 text-primary" />
                                )}
                            </div>
                        )}

                        {/* Team Name (for team registration) */}
                        {registrationType === 'team' && (
                            <Field>
                                <FieldLabel htmlFor="teamName">Team Name *</FieldLabel>
                                <Input
                                    id="teamName"
                                    name="teamName"
                                    type="text"
                                    placeholder="Enter your team name"
                                    required
                                    disabled={isSubmitting}
                                />
                            </Field>
                        )}

                        {/* Primary Contact / Individual Info */}
                        <div className="space-y-4 p-4 border border-foreground/20 rounded-lg">
                            <h3 className="font-medium">
                                {registrationType === 'team' ? 'Team Leader / Primary Contact' : 'Your Information'}
                            </h3>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="participantName">Full Name *</FieldLabel>
                                    <Input
                                        id="participantName"
                                        name="participantName"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        defaultValue={userName}
                                        disabled={isSubmitting}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="participantEmail">Email *</FieldLabel>
                                    <Input
                                        id="participantEmail"
                                        name="participantEmail"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        defaultValue={userEmail}
                                        disabled={isSubmitting}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="participantPhone">Phone Number</FieldLabel>
                                    <Input
                                        id="participantPhone"
                                        name="participantPhone"
                                        type="tel"
                                        placeholder="+977 98XXXXXXXX"
                                        disabled={isSubmitting}
                                    />
                                </Field>
                            </FieldGroup>
                        </div>

                        {/* Submissions (if enabled) */}
                        {hasSubmissionFields && (
                            <div className="space-y-4">
                                <h3 className="font-medium">Submissions</h3>
                                {submissionFields.map((field) => (
                                    <Field key={field.id}>
                                        <FieldLabel htmlFor={`submission-${field.id}`}>
                                            {field.title} {field.required && '*'}
                                        </FieldLabel>
                                        <FileOrLinkInput
                                            value={submissions[field.id] || ''}
                                            onChange={(value) => updateSubmission(field.id, value)}
                                            type="document"
                                            folder={`submissions/${eventSlug}`}
                                            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                                            placeholder="https://docs.google.com/..."
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Upload a file or provide a shareable link.
                                        </p>
                                    </Field>
                                ))}
                            </div>
                        )}

                        {/* Team Members (for team registration) */}
                        {registrationType === 'team' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Team Members</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTeamMember}
                                        disabled={isSubmitting}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Member
                                    </Button>
                                </div>

                                {teamMembers.map((member, index) => (
                                    <div key={index} className="p-4 border border-foreground/20 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                Member {index + 1}
                                            </span>
                                            {teamMembers.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeTeamMember(index)}
                                                    disabled={isSubmitting}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-3">
                                            <Input
                                                placeholder="Name"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                            <Input
                                                type="email"
                                                placeholder="Email"
                                                value={member.email}
                                                onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                            <Input
                                                type="tel"
                                                placeholder="Phone (optional)"
                                                value={member.phone ?? ''}
                                                onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Additional Notes */}
                        <Field>
                            <FieldLabel htmlFor="notes">Additional Notes (optional)</FieldLabel>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Any special requirements or information..."
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </Field>

                        {error && (
                            <FieldError>{error}</FieldError>
                        )}

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                'Complete Registration'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
