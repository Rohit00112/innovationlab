"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, Edit, MapPin, Plus, Trash2, Video, X, Search, Filter, MoreHorizontal, Users, User } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { SerializedEditorState } from "lexical"

import { Editor } from "@/components/blocks/editor-x/editor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileOrLinkInput } from "@/components/ui/file-or-link-input"
import { HttpError } from "@/lib/http/api-client"
import { createEvent, deleteEvent, listEvents, updateEvent, bulkDeleteEvents, bulkUpdateEventStatus } from "@/lib/http/events"
import {
  EVENT_STATUSES,
  ALLOWED_REGISTRATION_TYPES,
  type EventRecord,
  type EventStatus,
} from "@/lib/types/events"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BulkActionsBar,
  SelectableCheckbox,
  SelectAllCheckbox,
  type BulkAction,
} from "@/components/dashboard/bulk-actions"

const eventFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.union([z.string().max(600, "Summary must be 600 characters or less"), z.literal("")]).optional(),
  location: z.union([z.string().max(400, "Location must be 400 characters or less"), z.literal("")]).optional(),
  registrationUrl: z
    .union([z.string().trim().url("Enter a valid URL").max(2048), z.literal("")])
    .optional(),
  image: z.union([z.string().trim().url("Enter a valid URL").max(2048), z.literal("")]).optional(),
  isVirtual: z.boolean().default(false),
  hasRegistration: z.boolean().default(true),
  enableProposalSubmission: z.boolean().default(false),
  minParticipants: z.union([z.coerce.number().int().min(1), z.literal(""), z.null()]).optional(),
  maxParticipants: z.union([z.coerce.number().int().min(1), z.literal(""), z.null()]).optional(),
  submissionFields: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1, "Title is required").max(200),
        required: z.boolean(),
      })
    )
    .optional(),
  allowedRegistrationTypes: z.enum(ALLOWED_REGISTRATION_TYPES),
  startsAt: z.string().min(1, "Start date and time is required"),
  endsAt: z.union([z.string(), z.literal(""), z.null()]).optional(),
  status: z.enum(EVENT_STATUSES),
  publishedAt: z.union([z.string(), z.literal(""), z.null()]).optional(),
  description: z.string().min(1, "Description cannot be empty"),
  parentEventId: z.union([z.string(), z.literal(""), z.null()]).optional(),
  documents: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        url: z.string().url("Must be a valid URL"),
      })
    )
    .optional(),
})

const EMPTY_EDITOR_STATE = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

type EventFormValues = z.infer<typeof eventFormSchema>

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const statusLabel: Record<EventStatus, string> = {
  draft: "Draft",
  published: "Published",
  cancelled: "Cancelled",
}

const statusBadgeVariant: Record<EventStatus, BadgeVariant> = {
  draft: "secondary",
  published: "default",
  cancelled: "destructive",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return "-"
  }

  try {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return "-"
    }

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kathmandu",
    })
  } catch {
    return "-"
  }
}

function formatDateRange(startsAt: string, endsAt: string | null) {
  const start = formatTimestamp(startsAt)
  const end = endsAt ? formatTimestamp(endsAt) : null

  if (!end || end === "-") {
    return start
  }

  return `${start} to ${end}`
}

function toDatetimeLocal(value: string | null | undefined) {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const pad = (input: number) => String(input).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromDatetimeLocal(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const parsed = new Date(trimmed)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

function parseEditorContent(value: string | null | undefined) {
  if (!value) {
    return EMPTY_EDITOR_STATE
  }

  try {
    const parsed = JSON.parse(value) as SerializedEditorState

    if (parsed && typeof parsed === "object" && "root" in parsed) {
      return parsed
    }
  } catch {
    return EMPTY_EDITOR_STATE
  }

  return EMPTY_EDITOR_STATE
}

const defaultFormValues: EventFormValues = {
  title: "",
  slug: "",
  summary: "",
  location: "",
  registrationUrl: "",
  image: "",
  isVirtual: false,
  hasRegistration: true,
  enableProposalSubmission: false,
  minParticipants: "",
  maxParticipants: "",
  submissionFields: [],
  allowedRegistrationTypes: "both",
  startsAt: "",
  endsAt: "",
  status: "draft",
  publishedAt: "",
  description: JSON.stringify(EMPTY_EDITOR_STATE),
  parentEventId: "",
  documents: [],
}

export default function EventsDashboard() {
  const [eventItems, setEventItems] = useState<EventRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("published")
  const [searchInput, setSearchInput] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [activeEvent, setActiveEvent] = useState<EventRecord | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [editorState, setEditorState] = useState<SerializedEditorState>(EMPTY_EDITOR_STATE)
  const [editorKey, setEditorKey] = useState(0)
  const [eventFilters, setEventFilters] = useState<{ isVirtual?: boolean | "all" }>({ isVirtual: "all" })
  const [hasExternalRegistration, setHasExternalRegistration] = useState(false)

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultFormValues,
  })

  // Document fields array
  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  })

  // Submission fields array
  const { fields: submissionFieldsArray, append: appendSubmissionField, remove: removeSubmissionField } = useFieldArray({
    control: form.control,
    name: "submissionFields",
  })

  const addSubmissionField = () => {
    appendSubmissionField({
      id: `sf_${Date.now()}`,
      title: "",
      required: true,
    })
  }

  const filters = useMemo(
    () => ({
      status: statusFilter,
      search: searchValue || undefined,
      isVirtual:
        eventFilters.isVirtual === "all" || eventFilters.isVirtual === undefined
          ? undefined
          : eventFilters.isVirtual,
    }),
    [statusFilter, searchValue, eventFilters],
  )

  const loadEvents = useCallback(async () => {
    setIsLoading(true)

    try {
      const data = await listEvents(filters)
      setEventItems(data)
      setError(null)
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Failed to load events"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds([])
  }, [statusFilter, searchValue, eventFilters])

  // Bulk action handlers
  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(i => i !== id)
    )
  }

  const handleSelectAll = () => {
    setSelectedIds(eventItems.map(item => item.id))
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  const handleBulkAction = async (action: string, status?: EventStatus) => {
    if (selectedIds.length === 0) return

    setIsBulkProcessing(true)
    try {
      if (action === "delete") {
        await bulkDeleteEvents(selectedIds)
      } else if (action === "updateStatus" && status) {
        await bulkUpdateEventStatus(selectedIds, status)
      }
      setSelectedIds([])
      await loadEvents()
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Bulk action failed"
      setError(message)
    } finally {
      setIsBulkProcessing(false)
    }
  }

  const bulkActions: BulkAction<EventStatus>[] = [
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="h-3.5 w-3.5" />,
      variant: "destructive",
      confirmTitle: "Delete selected events?",
      confirmDescription: `This will permanently delete ${selectedIds.length} event${selectedIds.length > 1 ? "s" : ""}. This action cannot be undone.`,
    },
  ]

  const statusOptions = EVENT_STATUSES.map(status => ({
    value: status,
    label: statusLabel[status],
  }))

  const watchedTitle = form.watch("title")
  const slugDirty = form.formState.dirtyFields.slug

  useEffect(() => {
    if (!dialogOpen) {
      return
    }

    if (dialogMode !== "create" || activeEvent !== null) {
      return
    }

    if (!watchedTitle) {
      form.setValue("slug", "", { shouldDirty: false })
      return
    }

    if (slugDirty) {
      return
    }

    const nextSlug = slugify(watchedTitle)

    form.setValue("slug", nextSlug, { shouldDirty: false })
  }, [watchedTitle, slugDirty, dialogMode, activeEvent, dialogOpen, form])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchValue(searchInput.trim())
  }

  const handleResetFilters = () => {
    setStatusFilter("published")
    setSearchInput("")
    setSearchValue("")
    setEventFilters({ isVirtual: "all" })
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setActiveEvent(null)
    setFormError(null)
    form.reset(defaultFormValues)
    setEditorState(EMPTY_EDITOR_STATE)
    setEditorKey((key) => key + 1)
    setHasExternalRegistration(false)
    setDialogOpen(true)
  }

  const openEditDialog = (record: EventRecord) => {
    setDialogMode("edit")
    setActiveEvent(record)
    setFormError(null)
    setHasExternalRegistration(!!record.registrationUrl)

    form.reset({
      title: record.title,
      slug: record.slug,
      summary: record.summary ?? "",
      location: record.location ?? "",
      registrationUrl: record.registrationUrl ?? "",
      image: record.image ?? "",
      isVirtual: record.isVirtual,
      hasRegistration: record.hasRegistration,
      enableProposalSubmission: record.enableProposalSubmission,
      minParticipants: record.minParticipants ?? "",
      maxParticipants: record.maxParticipants ?? "",
      submissionFields: record.submissionFields ?? [],
      allowedRegistrationTypes: record.allowedRegistrationTypes,
      startsAt: toDatetimeLocal(record.startsAt),
      endsAt: toDatetimeLocal(record.endsAt),
      status: record.status,
      publishedAt: toDatetimeLocal(record.publishedAt),
      description: record.description ?? JSON.stringify(EMPTY_EDITOR_STATE),
      parentEventId: record.parentEventId ? String(record.parentEventId) : "",
      documents: record.documents ?? [],
    })

    setEditorState(parseEditorContent(record.description))
    setEditorKey((key) => key + 1)
    setDialogOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)

    if (!open) {
      setActiveEvent(null)
      setFormError(null)
      setEditorState(EMPTY_EDITOR_STATE)
      form.reset(defaultFormValues)
    }
  }

  const handleDelete = async (record: EventRecord) => {
    const confirmed = window.confirm(`Delete event "${record.title}"?`)

    if (!confirmed) {
      return
    }

    setDeletingId(record.id)

    try {
      await deleteEvent(record.id)
      await loadEvents()
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Failed to delete event"
      setError(message)
    } finally {
      setDeletingId(null)
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true)
    setFormError(null)

    const startsAtIso = fromDatetimeLocal(values.startsAt)

    if (!startsAtIso) {
      setFormError("Start date and time is invalid")
      setIsSubmitting(false)
      return
    }

    const payload = {
      title: values.title.trim(),
      slug: values.slug.trim().toLowerCase(),
      summary: values.summary && values.summary.trim() ? values.summary.trim() : null,
      description: values.description,
      location: values.location && values.location.trim() ? values.location.trim() : null,
      registrationUrl:
        hasExternalRegistration && values.registrationUrl && values.registrationUrl.trim().length > 0
          ? values.registrationUrl.trim()
          : null,
      image:
        values.image && values.image.trim().length > 0 ? values.image.trim() : null,
      isVirtual: values.isVirtual,
      hasRegistration: values.hasRegistration,
      enableProposalSubmission: values.enableProposalSubmission,
      minParticipants: values.minParticipants ? Number(values.minParticipants) : null,
      maxParticipants: values.maxParticipants ? Number(values.maxParticipants) : null,
      submissionFields: values.enableProposalSubmission && values.submissionFields?.length
        ? values.submissionFields.filter((f: { title: string }) => f.title.trim())
        : null,
      allowedRegistrationTypes: values.allowedRegistrationTypes,
      startsAt: startsAtIso,
      endsAt: fromDatetimeLocal(values.endsAt ?? null),
      status: values.status,
      publishedAt: fromDatetimeLocal(values.publishedAt ?? null),
      parentEventId: values.parentEventId && String(values.parentEventId) !== "" ? Number(values.parentEventId) : null,
      documents: values.documents && values.documents.length > 0 ? values.documents : null,
    }

    try {
      if (dialogMode === "create") {
        await createEvent(payload)
      } else if (activeEvent) {
        await updateEvent(activeEvent.id, payload)
      }

      await loadEvents()
      handleDialogOpenChange(false)
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Unable to save event"
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground mt-1">Schedule and publish Innovation Lab happenings.</p>
        </div>
        <Button onClick={openCreateDialog} className="rounded-full shadow-md hover:shadow-lg transition-all">
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <BulkActionsBar
        selectedIds={selectedIds}
        totalCount={eventItems.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBulkAction={handleBulkAction}
        actions={bulkActions}
        statusOptions={statusOptions}
        isProcessing={isBulkProcessing}
      />



      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 border-b border-border/50">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form onSubmit={handleSearchSubmit}>
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search events..."
                className="pl-9 rounded-xl bg-background border-border/50"
                type="search"
              />
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EventStatus | "all")}>
                <SelectTrigger id="status-filter" className="w-[150px] rounded-xl border-border/50 bg-background">
                  <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {EVENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={String(eventFilters.isVirtual ?? "all")}
                onValueChange={(value) =>
                  setEventFilters({ isVirtual: value === "all" ? "all" : value === "true" })
                }
              >
                <SelectTrigger id="format-filter" className="w-[150px] rounded-xl border-border/50 bg-background">
                  <Video className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="true">Virtual</SelectItem>
                  <SelectItem value="false">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="button" variant="ghost" onClick={handleResetFilters} className="rounded-xl">
              Reset
            </Button>
          </div>
        </div>

        <div className="p-0">
          {error && (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertTitle>Unable to load events</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <EventsTable
            data={eventItems}
            isLoading={isLoading}
            deletingId={deletingId}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            selectedIds={selectedIds}
            onSelectItem={handleSelectItem}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
          />
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="!fixed !inset-0 !top-0 !left-0 !w-screen !h-screen !max-w-none !m-0 !p-0 !rounded-none !border-none !translate-x-0 !translate-y-0 data-[state=open]:!zoom-in-100 data-[state=closed]:!zoom-out-100 flex flex-col bg-background shadow-none"
        >
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <DialogHeader>
              <DialogTitle>{dialogMode === "create" ? "Create Event" : "Edit Event"}</DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Publish workshops, demos, and other community gatherings."
                  : `Update details for "${activeEvent?.title ?? ""}".`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => handleDialogOpenChange(false)}>Cancel</Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <Form {...form}>
              <form className="flex-1 flex overflow-hidden" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Panel - Form Fields */}
                  <div className="w-[500px] flex-shrink-0 overflow-y-auto p-6 border-r border-border/50 space-y-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Event Name" className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="event-url-slug" className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="startsAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starts At</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="endsAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ends At</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Summary</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Brief description for cards..."
                                className="resize-none rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g. Main Auditorium" className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="isVirtual"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 mt-7">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm">Virtual Event</FormLabel>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="p-4 rounded-xl border bg-muted/20 space-y-4">
                        <h3 className="font-medium text-sm">Registration & Resources</h3>

                        <FormField
                          control={form.control}
                          name="hasRegistration"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border bg-background p-3">
                              <div className="space-y-0.5">
                                <FormLabel className="text-sm">Enable Registration</FormLabel>
                                <p className="text-xs text-muted-foreground">Allow attendees to register for this event</p>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {form.watch("hasRegistration") && (
                          <>
                            <div className="flex items-center justify-between rounded-lg border bg-background p-3">
                              <div className="space-y-0.5">
                                <Label className="text-sm">External Registration</Label>
                                <p className="text-xs text-muted-foreground">Use Eventbrite, Luma, etc.</p>
                              </div>
                              <Switch
                                checked={hasExternalRegistration}
                                onCheckedChange={(checked) => {
                                  setHasExternalRegistration(checked)
                                  if (!checked) {
                                    form.setValue("registrationUrl", "")
                                  }
                                }}
                              />
                            </div>

                            {!hasExternalRegistration && (
                              <FormField
                                control={form.control}
                                name="allowedRegistrationTypes"
                                render={({ field }) => (
                                  <FormItem className="space-y-3 rounded-lg border bg-background p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <FormLabel className="text-sm font-semibold">Registration Type</FormLabel>
                                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">Internal Form</Badge>
                                    </div>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-3 gap-3"
                                      >
                                        <div className="relative">
                                          <RadioGroupItem
                                            value="individual"
                                            id="individual"
                                            className="peer sr-only"
                                          />
                                          <Label
                                            htmlFor="individual"
                                            className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 h-24 cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all duration-200"
                                          >
                                            <User className="mb-2 h-5 w-5 text-primary" />
                                            <span className="text-[11px] font-bold">Single</span>
                                          </Label>
                                        </div>
                                        <div className="relative">
                                          <RadioGroupItem
                                            value="team"
                                            id="team"
                                            className="peer sr-only"
                                          />
                                          <Label
                                            htmlFor="team"
                                            className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 h-24 cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all duration-200"
                                          >
                                            <Users className="mb-2 h-5 w-5 text-primary" />
                                            <span className="text-[11px] font-bold">Group</span>
                                          </Label>
                                        </div>
                                        <div className="relative">
                                          <RadioGroupItem
                                            value="both"
                                            id="both"
                                            className="peer sr-only"
                                          />
                                          <Label
                                            htmlFor="both"
                                            className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 h-24 cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary transition-all duration-200"
                                          >
                                            <div className="flex -space-x-1 mb-2">
                                              <User className="h-4 w-4 text-primary" />
                                              <Users className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="text-[11px] font-bold">Both</span>
                                          </Label>
                                        </div>
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            {/* Participant Limits */}
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name="minParticipants"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Min Participants</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        placeholder="No minimum"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="rounded-lg"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="maxParticipants"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Max Participants</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        placeholder="No limit"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="rounded-lg"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {hasExternalRegistration && (
                              <FormField
                                name="registrationUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Registration URL</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="url" placeholder="https://..." className="rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="enableProposalSubmission"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border bg-background p-3">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-sm">Require Submission</FormLabel>
                                    <p className="text-xs text-muted-foreground">Ask registrants to submit proposals, files, or links</p>
                                  </div>
                                  <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {form.watch("enableProposalSubmission") && (
                              <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium">Submission Fields</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addSubmissionField}
                                    className="h-7 text-xs"
                                  >
                                    <Plus className="mr-1 h-3 w-3" /> Add Field
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Define what registrants need to submit (e.g., Proposal Link, Project Abstract, Resume)
                                </p>
                                <div className="space-y-2">
                                  {submissionFieldsArray.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2 p-2 rounded-lg border bg-background">
                                      <FormField
                                        name={`submissionFields.${index}.title`}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            placeholder="Field title (e.g., Project Proposal)"
                                            className="h-8 text-sm rounded-md flex-1"
                                          />
                                        )}
                                      />
                                      <FormField
                                        name={`submissionFields.${index}.required`}
                                        render={({ field }) => (
                                          <label className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={field.value}
                                              onChange={field.onChange}
                                              className="rounded border-border"
                                            />
                                            Required
                                          </label>
                                        )}
                                      />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeSubmissionField(index)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  {submissionFieldsArray.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-2">
                                      No submission fields yet. Click &quot;Add Field&quot; to create one.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Resources (Slides, Links)</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => appendDocument({ title: "", url: "" })}
                              className="h-7 text-xs"
                            >
                              <Plus className="mr-1 h-3 w-3" /> Add
                            </Button>
                          </div>
                          <div className="space-y-3">
                            {documentFields.map((field, index) => (
                              <div key={field.id} className="p-3 rounded-lg border bg-background space-y-2">
                                <div className="flex items-center justify-between">
                                  <FormField
                                    name={`documents.${index}.title`}
                                    render={({ field }) => (
                                      <Input {...field} placeholder="Resource title" className="h-8 text-sm rounded-md flex-1" />
                                    )}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 ml-2 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeDocument(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <FormField
                                  name={`documents.${index}.url`}
                                  render={({ field }) => (
                                    <FileOrLinkInput
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      type="document"
                                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                      folder="events/documents"
                                      placeholder="https://example.com/document.pdf"
                                    />
                                  )}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <FormField
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                              <FileOrLinkInput
                                value={field.value || ""}
                                onChange={field.onChange}
                                type="image"
                                accept="image/*"
                                folder="events/covers"
                                placeholder="https://example.com/image.jpg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        name="parentEventId"
                        render={({ field }) => {
                          // Get potential parent events (events without a parent, excluding current event)
                          const potentialParents = eventItems.filter(
                            (e) => !e.parentEventId && e.id !== activeEvent?.id
                          )
                          return (
                            <FormItem>
                              <FormLabel>Parent Event (Optional)</FormLabel>
                              <Select
                                onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                                value={field.value || "none"}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="None (standalone event)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="none">None (standalone event)</SelectItem>
                                  {potentialParents.map((event) => (
                                    <SelectItem key={event.id} value={String(event.id)}>
                                      {event.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                Select a parent to make this a sub-event
                              </p>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {EVENT_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {statusLabel[status]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="publishedAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Publish Date</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} className="rounded-lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {formError && (
                        <Alert variant="destructive">
                          <AlertTitle>Error saving event</AlertTitle>
                          <AlertDescription>{formError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* Right Panel - Editor */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-border/50">
                      <h3 className="font-semibold text-lg">Details & Agenda</h3>
                      <p className="text-sm text-muted-foreground mt-1">Write event details, schedule, and agenda</p>
                    </div>
                    <div className="flex-1 overflow-hidden p-6">
                      <FormField
                        name="description"
                        render={({ field }) => (
                          <FormItem className="h-full flex flex-col">
                            <div className="flex-1 rounded-lg border overflow-hidden">
                              <Editor
                                key={editorKey}
                                editorSerializedState={editorState}
                                onSerializedChange={(value) => {
                                  setEditorState(value)
                                  field.onChange(JSON.stringify(value))
                                }}
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface EventsTableProps {
  data: EventRecord[]
  isLoading: boolean
  deletingId: number | null
  onEdit: (record: EventRecord) => void
  onDelete: (record: EventRecord) => void
  selectedIds: number[]
  onSelectItem: (id: number, checked: boolean) => void
  onSelectAll: () => void
  onClearSelection: () => void
}

function EventsTable({ data, isLoading, deletingId, onEdit, onDelete, selectedIds, onSelectItem, onSelectAll, onClearSelection }: EventsTableProps) {
  return (
    <div className="border-t border-border/50">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-muted/40 border-border/50">
            <TableHead className="w-12">
              <SelectAllCheckbox
                selectedCount={selectedIds.length}
                totalCount={data.length}
                onSelectAll={onSelectAll}
                onClearSelection={onClearSelection}
                disabled={isLoading || data.length === 0}
              />
            </TableHead>
            <TableHead className="w-[350px]">Event</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="size-5" />
                  Loading events...
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                No events match the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                <TableCell>
                  <SelectableCheckbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => onSelectItem(item.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                      {item.parentEventId && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800">
                          Sub-event
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                      {item.summary ?? "No summary provided"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground/70" />
                    <span className="whitespace-nowrap">{formatDateRange(item.startsAt, item.endsAt)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[item.status]} className="capitalize shadow-none">
                    {statusLabel[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {item.isVirtual ? <Video className="h-4 w-4 text-blue-500/70" /> : <MapPin className="h-4 w-4 text-orange-500/70" />}
                    <span>{item.isVirtual ? "Virtual" : item.location ?? "On site"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                      {(item.organizer?.name || item.organizer?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="whitespace-nowrap max-w-[120px] truncate">{item.organizer?.name ?? item.organizer?.email ?? "-"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <a href={`/dashboard/events/${item.id}/registrations`}>
                          <Users className="mr-2 h-4 w-4" /> View Registrations
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(item)}
                        disabled={deletingId === item.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div >
  )
}
