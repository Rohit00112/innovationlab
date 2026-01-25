"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, Edit, MapPin, Plus, Trash2, Video, FileText, Link as LinkIcon, X } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { SerializedEditorState } from "lexical"

import { Editor } from "@/components/blocks/editor-x/editor"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator"
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
import { HttpError } from "@/lib/http/api-client"
import { createEvent, deleteEvent, listEvents, updateEvent } from "@/lib/http/events"
import {
  EVENT_STATUSES,
  type EventRecord,
  type EventStatus,
} from "@/lib/types/events"

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
    })
  } catch (error) {
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
  } catch (error) {
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

  const form = useForm<any>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultFormValues,
  })

  // Document fields array
  const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
    control: form.control,
    name: "documents",
  })

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
    <section className="w-full space-y-8 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">Schedule and publish Innovation Lab happenings.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <Separator />

      <Card className="border border-border !w-[80vw] max-w-full">
        <CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>Event Program</CardTitle>
            <CardDescription>Filter by status, search by title, or focus on virtual sessions.</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EventStatus | "all")}>
                <SelectTrigger id="status-filter" className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {EVENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="format-filter" className="text-sm font-medium">
                Format
              </Label>
              <Select
                value={String(eventFilters.isVirtual ?? "all")}
                onValueChange={(value) =>
                  setEventFilters({ isVirtual: value === "all" ? "all" : value === "true" })
                }
              >
                <SelectTrigger id="format-filter" className="w-[150px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All formats</SelectItem>
                  <SelectItem value="true">Virtual</SelectItem>
                  <SelectItem value="false">In person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 md:w-auto">
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search title"
                className="md:w-64"
                type="search"
              />
              <Button type="submit" variant="outline">
                Apply
              </Button>
            </form>

            <Button type="button" variant="ghost" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Unable to load events</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <EventsTable
            data={eventItems}
            isLoading={isLoading}
            deletingId={deletingId}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="flex !max-w-none !w-screen !h-screen flex-col overflow-hidden p-0 sm:max-w-none !border-none !rounded-none">
          <div className="border-b px-6 py-4">
            <DialogHeader>
              <DialogTitle>{dialogMode === "create" ? "Create Event" : "Edit Event"}</DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Publish workshops, demos, and other community gatherings."
                  : `Update details for "${activeEvent?.title ?? ""}".`}
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form className="flex flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit((onSubmit as any))}>
              <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                <div className="w-full shrink-0 space-y-5 overflow-y-auto border-b px-6 py-6 md:max-w-md md:border-b-0 md:border-r">
                  <FormField
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="AI Innovation Summit" />
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
                          <Input {...field} placeholder="ai-innovation-summit" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Give attendees a quick reason to join the event"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Innovation Lab Auditorium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="space-y-0.5">
                      <Label>External Registration Link</Label>
                      <p className="text-sm text-muted-foreground">
                        Use an external site (e.g. Eventbrite, Zoom) for registration.
                      </p>
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

                  {hasExternalRegistration && (
                    <FormField
                      name="registrationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration URL</FormLabel>
                          <FormControl>
                            <Input {...field} type="url" placeholder="https://tickets.example.com/event" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover image URL</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" placeholder="https://images.example.com/event-cover.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Event Resources</Label>
                        <p className="text-sm text-muted-foreground">Add handbooks, slides, or other links.</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendDocument({ title: "", url: "" })}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Resource
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {documentFields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-3">
                          <FormField
                            control={form.control}
                            name={`documents.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <div className="relative">
                                    <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input {...field} className="pl-9" placeholder="Resource Title (e.g. Handbook)" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`documents.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <div className="relative">
                                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input {...field} className="pl-9" type="url" placeholder="https://..." />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeDocument(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                      {documentFields.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No resources added yet.</p>
                      )}
                    </div>
                  </div>

                  <FormField
                    name="parentEventId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Event (optional)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                          value={field.value?.toString() ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent event (for sub-events)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No parent (standalone event)</SelectItem>
                            {eventItems
                              .filter((e) => e.id !== activeEvent?.id) // Can't be parent of itself
                              .map((event) => (
                                <SelectItem key={event.id} value={event.id.toString()}>
                                  {event.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          Select a parent event to make this a sub-event/session.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="isVirtual"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5">
                          <FormLabel>Virtual session</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Toggle if attendees will join remotely.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="hasRegistration"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Registration</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Turn off for announcement-only events.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="enableProposalSubmission"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-md border px-3 py-2">
                        <div className="space-y-0.5">
                          <FormLabel>Enable Proposal Submission</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Users can submit a proposal link during registration.
                          </p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                    <FormField
                      name="startsAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Starts at</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="endsAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ends at</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                    <FormField
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
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
                          <FormLabel>Publish at</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" value={field.value ?? ""} onChange={field.onChange} step={60} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <FormField
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex h-full flex-col">
                        <div className="border-b px-6 py-4">
                          <FormLabel>Agenda and details</FormLabel>
                        </div>
                        <div className="flex-1 overflow-auto px-6 py-4">
                          <div className="h-full min-h-[400px]">
                            <Editor
                              key={editorKey}
                              editorSerializedState={editorState}
                              onSerializedChange={(value) => {
                                setEditorState(value)
                                field.onChange(JSON.stringify(value))
                              }}
                            />
                          </div>
                        </div>
                        <div className="px-6 pb-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {formError && (
                <div className="border-t px-6 py-4">
                  <Alert variant="destructive">
                    <AlertTitle>Unable to save event</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                </div>
              )}

              <DialogFooter className="border-t px-6 py-4">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </section >
  )
}

interface EventsTableProps {
  data: EventRecord[]
  isLoading: boolean
  deletingId: number | null
  onEdit: (record: EventRecord) => void
  onDelete: (record: EventRecord) => void
}

function EventsTable({ data, isLoading, deletingId, onEdit, onDelete }: EventsTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[240px]">Title</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="size-5" />
                  Loading events...
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No events match the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium leading-tight">{item.title}</span>
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {item.summary ?? "No summary provided"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDateRange(item.startsAt, item.endsAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[item.status]}>{statusLabel[item.status]}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    {item.isVirtual ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                    {item.isVirtual ? "Virtual" : item.location ?? "On site"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.organizer?.name ?? item.organizer?.email ?? "-"}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(item)} className="px-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(item)}
                    className="px-2"
                    disabled={deletingId === item.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
