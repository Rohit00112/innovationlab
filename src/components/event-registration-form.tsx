'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, X, Users, User, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

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
    londonmetId: string
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
    minParticipants?: number | null
    maxParticipants?: number | null
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
    minParticipants,
    maxParticipants,
}: EventRegistrationFormProps) {
    const router = useRouter()
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submissions, setSubmissions] = useState<Record<string, string>>({})
    const [registrationType, setRegistrationType] = useState<'individual' | 'team'>(
        allowedRegistrationTypes === 'team' ? 'team' : 'individual'
    )
    // Calculate team member limits (total participants = 1 leader + N members)
    const minMembers = minParticipants ? Math.max(minParticipants - 1, 1) : 1
    const maxMembers = maxParticipants ? maxParticipants - 1 : undefined

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
        const initialCount = minMembers
        return Array.from({ length: initialCount }, () => ({ name: '', email: '', phone: '', londonmetId: '' }))
    })

    // LondonMet ID duplicate checking
    const [leaderLondonmetId, setLeaderLondonmetId] = useState('')
    const [londonmetErrors, setLondonmetErrors] = useState<Record<string, string>>({})
    const [londonmetChecking, setLondonmetChecking] = useState<Record<string, boolean>>({})
    const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

    const checkLondonmetId = useCallback(async (id: string, fieldKey: string) => {
        if (!id.trim()) {
            setLondonmetErrors(prev => {
                const next = { ...prev }
                delete next[fieldKey]
                return next
            })
            setLondonmetChecking(prev => ({ ...prev, [fieldKey]: false }))
            return
        }

        // First check locally — within the form itself
        const allIds: { key: string; value: string }[] = []
        if (leaderLondonmetId.trim() && fieldKey !== 'leader') {
            allIds.push({ key: 'leader', value: leaderLondonmetId.trim() })
        }
        teamMembers.forEach((m, i) => {
            const k = `member-${i}`
            if (m.londonmetId.trim() && k !== fieldKey) {
                allIds.push({ key: k, value: m.londonmetId.trim() })
            }
        })
        if (fieldKey === 'leader') {
            // check leader against current state
        }
        const localDup = allIds.find(a => a.value === id.trim())
        if (localDup) {
            setLondonmetErrors(prev => ({ ...prev, [fieldKey]: 'This LondonMet ID is already used in this registration form' }))
            setLondonmetChecking(prev => ({ ...prev, [fieldKey]: false }))
            return
        }

        // Then check server
        setLondonmetChecking(prev => ({ ...prev, [fieldKey]: true }))
        try {
            const res = await fetch(`/api/events/${eventId}/check-londonmet?londonmetId=${encodeURIComponent(id.trim())}`)
            if (res.ok) {
                const data = await res.json()
                if (data.exists) {
                    setLondonmetErrors(prev => ({ ...prev, [fieldKey]: data.message }))
                } else {
                    setLondonmetErrors(prev => {
                        const next = { ...prev }
                        delete next[fieldKey]
                        return next
                    })
                }
            }
        } catch {
            // silently fail
        } finally {
            setLondonmetChecking(prev => ({ ...prev, [fieldKey]: false }))
        }
    }, [eventId, leaderLondonmetId, teamMembers])

    const debouncedCheck = useCallback((id: string, fieldKey: string) => {
        if (debounceTimers.current[fieldKey]) {
            clearTimeout(debounceTimers.current[fieldKey])
        }
        if (!id.trim()) {
            setLondonmetErrors(prev => {
                const next = { ...prev }
                delete next[fieldKey]
                return next
            })
            return
        }
        setLondonmetChecking(prev => ({ ...prev, [fieldKey]: true }))
        debounceTimers.current[fieldKey] = setTimeout(() => {
            checkLondonmetId(id, fieldKey)
        }, 500)
    }, [checkLondonmetId])

    // Cleanup timers
    useEffect(() => {
        return () => {
            Object.values(debounceTimers.current).forEach(clearTimeout)
        }
    }, [])

    const hasLondonmetError = Object.keys(londonmetErrors).length > 0

    // Email domain validation (@iic.edu.np)
    const [emailErrors, setEmailErrors] = useState<Record<string, string>>({})
    const [leaderEmail, setLeaderEmail] = useState(userEmail)

    const validateEmailDomain = (email: string, fieldKey: string) => {
        if (!email.trim()) {
            setEmailErrors(prev => {
                const next = { ...prev }
                delete next[fieldKey]
                return next
            })
            return
        }
        if (!email.trim().toLowerCase().endsWith('@iic.edu.np')) {
            setEmailErrors(prev => ({ ...prev, [fieldKey]: 'Email must end with @iic.edu.np' }))
        } else {
            setEmailErrors(prev => {
                const next = { ...prev }
                delete next[fieldKey]
                return next
            })
        }
    }

    const hasEmailError = Object.keys(emailErrors).length > 0

    // Normalize submission fields to always be an array
    const submissionFields = Array.isArray(rawSubmissionFields) ? rawSubmissionFields : []
    const hasSubmissionFields = enableProposalSubmission && submissionFields.length > 0

    const updateSubmission = (fieldId: string, value: string) => {
        setSubmissions(prev => ({ ...prev, [fieldId]: value }))
    }

    const canAddMember = maxMembers === undefined || teamMembers.length < maxMembers
    const canRemoveMember = teamMembers.length > minMembers

    const addTeamMember = () => {
        if (!canAddMember) return
        setTeamMembers([...teamMembers, { name: '', email: '', phone: '', londonmetId: '' }])
    }

    const removeTeamMember = (index: number) => {
        if (!canRemoveMember) return
        setTeamMembers(teamMembers.filter((_, i) => i !== index))
    }

    const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...teamMembers]
        updated[index] = { ...updated[index], [field]: value }
        setTeamMembers(updated)
        if (field === 'londonmetId') {
            debouncedCheck(value, `member-${index}`)
        }
        if (field === 'email') {
            validateEmailDomain(value, `member-email-${index}`)
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        // Check for email domain errors
        if (hasEmailError) {
            setError('All email addresses must end with @iic.edu.np')
            setSubmitting(false)
            return
        }

        // Check for LondonMet ID errors
        if (hasLondonmetError) {
            setError('Please resolve LondonMet ID issues before submitting')
            setSubmitting(false)
            return
        }

        // Validate team member required fields
        if (registrationType === 'team') {
            for (let i = 0; i < teamMembers.length; i++) {
                const m = teamMembers[i]
                if (!m.name.trim() || !m.email.trim() || !m.phone?.trim() || !m.londonmetId.trim()) {
                    setError(`All fields are required for Member ${i + 1}`)
                    setSubmitting(false)
                    return
                }
            }
        }

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
            londonmetId: String(formData.get('londonmetId') ?? '').trim() || null,
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
                setError(data?.message ?? 'Unable to complete registration')
                setSubmitting(false)
                return
            }

            toast.success('Registration Successful!', {
                description: registrationType === 'team'
                    ? 'Your team has been registered. Confirmation emails have been sent to all team members.'
                    : 'You have been registered. A confirmation email has been sent to your email address.',
                duration: 6000,
            })

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
                    {maxParticipants && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Limited to <span className="font-semibold text-foreground">{maxParticipants}</span> participants
                            {minParticipants ? ` (minimum ${minParticipants})` : ''}
                        </p>
                    )}
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
                                        placeholder="john@iic.edu.np"
                                        required
                                        value={leaderEmail}
                                        onChange={(e) => {
                                            setLeaderEmail(e.target.value)
                                            validateEmailDomain(e.target.value, 'leader-email')
                                        }}
                                        disabled={isSubmitting}
                                        className={emailErrors['leader-email'] ? 'border-destructive' : ''}
                                    />
                                    {emailErrors['leader-email'] && (
                                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {emailErrors['leader-email']}
                                        </p>
                                    )}
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
                                <Field>
                                    <FieldLabel htmlFor="londonmetId">LondonMet ID *</FieldLabel>
                                    <Input
                                        id="londonmetId"
                                        name="londonmetId"
                                        type="text"
                                        placeholder="e.g. 23045678"
                                        required
                                        disabled={isSubmitting}
                                        value={leaderLondonmetId}
                                        onChange={(e) => {
                                            setLeaderLondonmetId(e.target.value)
                                            debouncedCheck(e.target.value, 'leader')
                                        }}
                                        className={londonmetErrors['leader'] ? 'border-destructive' : ''}
                                    />
                                    {londonmetChecking['leader'] && (
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Checking...
                                        </p>
                                    )}
                                    {londonmetErrors['leader'] && (
                                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {londonmetErrors['leader']}
                                        </p>
                                    )}
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
                                    <div>
                                        <h3 className="font-medium">Team Members</h3>
                                        {(minParticipants || maxParticipants) && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {minParticipants && maxParticipants
                                                    ? `${minParticipants} to ${maxParticipants} total participants (including team leader)`
                                                    : minParticipants
                                                        ? `At least ${minParticipants} total participants (including team leader)`
                                                        : `Up to ${maxParticipants} total participants (including team leader)`}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTeamMember}
                                        disabled={isSubmitting || !canAddMember}
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
                                            {canRemoveMember && (
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
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <Input
                                                placeholder="Name"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                disabled={isSubmitting}
                                                required
                                            />
                                            <div>
                                                <Input
                                                    type="email"
                                                    placeholder="Email (@iic.edu.np)"
                                                    value={member.email}
                                                    onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                                    disabled={isSubmitting}
                                                    required
                                                    className={emailErrors[`member-email-${index}`] ? 'border-destructive' : ''}
                                                />
                                                {emailErrors[`member-email-${index}`] && (
                                                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {emailErrors[`member-email-${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                            <Input
                                                type="tel"
                                                placeholder="Phone"
                                                value={member.phone ?? ''}
                                                onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                                                disabled={isSubmitting}
                                                required
                                            />
                                            <Input
                                                placeholder="LondonMet ID"
                                                value={member.londonmetId}
                                                onChange={(e) => updateTeamMember(index, 'londonmetId', e.target.value)}
                                                disabled={isSubmitting}
                                                required
                                                className={londonmetErrors[`member-${index}`] ? 'border-destructive' : ''}
                                            />
                                        </div>
                                        {londonmetChecking[`member-${index}`] && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Checking...
                                            </p>
                                        )}
                                        {londonmetErrors[`member-${index}`] && (
                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {londonmetErrors[`member-${index}`]}
                                            </p>
                                        )}
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
