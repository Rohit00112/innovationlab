"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { HttpError } from "@/lib/http/api-client"
import {
    createNews,
    deleteNews,
    listNews,
    updateNews,
} from "@/lib/http/news"
import {
    NEWS_STATUSES,
    type NewsRecord,
    type NewsStatus,
} from "@/lib/types/news"

const newsFormSchema = z.object({
    title: z.string().min(3, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    excerpt: z
        .union([z.string().max(600, "Excerpt must be 600 characters or less"), z.literal("")])
        .optional(),
    coverImageUrl: z
        .union([z.string().trim().url("Enter a valid URL").max(2048), z.literal("")])
        .optional(),
    content: z.string().min(1, "Content cannot be empty"),
    status: z.enum(NEWS_STATUSES),
    publishedAt: z.union([z.string(), z.literal(""), z.null()]).optional(),
})

const EMPTY_EDITOR_STATE: any = {
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
}

type NewsFormValues = z.infer<typeof newsFormSchema>

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const statusLabel: Record<NewsStatus, string> = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published",
    archived: "Archived",
}

const statusBadgeVariant: Record<NewsStatus, BadgeVariant> = {
    draft: "secondary",
    scheduled: "outline",
    published: "default",
    archived: "destructive",
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

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

const defaultFormValues: NewsFormValues = {
    title: "",
    slug: "",
    excerpt: "",
    coverImageUrl: "",
    content: JSON.stringify(EMPTY_EDITOR_STATE),
    status: "draft",
    publishedAt: "",
}

export default function NewsDashboard() {
    const [newsItems, setNewsItems] = useState<NewsRecord[]>([])
    const [statusFilter, setStatusFilter] = useState<NewsStatus | "all">("published")
    const [searchInput, setSearchInput] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
    const [activeNews, setActiveNews] = useState<NewsRecord | null>(null)
    const [formError, setFormError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [editorState, setEditorState] = useState<SerializedEditorState>(EMPTY_EDITOR_STATE)
    const [editorKey, setEditorKey] = useState(0)

    const form = useForm<NewsFormValues>({
        resolver: zodResolver(newsFormSchema),
        defaultValues: defaultFormValues,
    })

    const filters = useMemo(
        () => ({
            status: statusFilter,
            search: searchValue || undefined,
        }),
        [statusFilter, searchValue],
    )

    const loadNews = useCallback(async () => {
        setIsLoading(true)

        try {
            const data = await listNews(filters)
            setNewsItems(data)
            setError(null)
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to load news"
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }, [filters])

    useEffect(() => {
        loadNews()
    }, [loadNews])

    const watchedTitle = form.watch("title")
    const slugDirty = form.formState.dirtyFields.slug

    useEffect(() => {
        if (!dialogOpen) {
            return
        }

        if (dialogMode !== "create" || activeNews !== null) {
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
    }, [watchedTitle, slugDirty, dialogMode, activeNews, dialogOpen, form])

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSearchValue(searchInput.trim())
    }

    const handleResetFilters = () => {
        setStatusFilter("published")
        setSearchInput("")
        setSearchValue("")
    }

    const openCreateDialog = () => {
        setDialogMode("create")
        setActiveNews(null)
        setFormError(null)
        form.reset(defaultFormValues)
        setEditorState(EMPTY_EDITOR_STATE)
        setEditorKey((key) => key + 1)
        setDialogOpen(true)
    }

    const openEditDialog = (record: NewsRecord) => {
        setDialogMode("edit")
        setActiveNews(record)
        setFormError(null)

        form.reset({
            title: record.title,
            slug: record.slug,
            excerpt: record.excerpt ?? "",
            coverImageUrl: record.coverImageUrl ?? "",
            content: record.content,
            status: record.status,
            publishedAt: toDatetimeLocal(record.publishedAt),
        })

        setEditorState(parseEditorContent(record.content))
        setEditorKey((key) => key + 1)
        setDialogOpen(true)
    }

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open)

        if (!open) {
            setActiveNews(null)
            setFormError(null)
            setEditorState(EMPTY_EDITOR_STATE)
            form.reset(defaultFormValues)
        }
    }

    const handleDelete = async (record: NewsRecord) => {
        const confirmed = window.confirm(`Delete news entry "${record.title}"?`)

        if (!confirmed) {
            return
        }

        setDeletingId(record.id)

        try {
            await deleteNews(record.id)
            await loadNews()
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to delete news"
            setError(message)
        } finally {
            setDeletingId(null)
        }
    }

    const onSubmit = async (values: NewsFormValues) => {
        setIsSubmitting(true)
        setFormError(null)

        const payload = {
            title: values.title.trim(),
            slug: values.slug.trim().toLowerCase(),
            excerpt: values.excerpt && values.excerpt.trim() ? values.excerpt.trim() : null,
            content: values.content,
            coverImageUrl:
                values.coverImageUrl && values.coverImageUrl.trim().length > 0
                    ? values.coverImageUrl.trim()
                    : null,
            status: values.status,
            publishedAt: fromDatetimeLocal(values.publishedAt ?? null),
        }

        try {
            if (dialogMode === "create") {
                await createNews(payload)
            } else if (activeNews) {
                await updateNews(activeNews.id, payload)
            }

            await loadNews()
            handleDialogOpenChange(false)
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Unable to save news entry"
            setFormError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="w-full space-y-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">News</h2>
                    <p className="text-muted-foreground">
                        Create and manage Innovation Lab announcements.
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Article
                </Button>
            </div>

            <Separator />

            <Card className="border border-border !w-[80vw] max-w-full">
                <CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
                    <div>
                        <CardTitle>Articles</CardTitle>
                        <CardDescription>Filter and edit published content.</CardDescription>
                    </div>
                    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="status-filter" className="text-sm font-medium">
                                Status
                            </Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => setStatusFilter(value as NewsStatus | "all")}
                            >
                                <SelectTrigger id="status-filter" className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {NEWS_STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {statusLabel[status]}
                                        </SelectItem>
                                    ))}
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
                            <AlertTitle>Unable to load news</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <NewsTable
                        data={newsItems}
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
                            <DialogTitle>{dialogMode === "create" ? "Create Article" : "Edit Article"}</DialogTitle>
                            <DialogDescription>
                                {dialogMode === "create"
                                    ? "Publish new stories and updates for the Innovation Lab."
                                    : `Update details for "${activeNews?.title ?? ""}".`}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <Form {...form}>
                        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                                <div className="w-full shrink-0 space-y-5 overflow-y-auto border-b px-6 py-6 md:max-w-md md:border-b-0 md:border-r">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="Generative AI Bootcamp kickoff" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="generative-ai-bootcamp" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="excerpt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Excerpt</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        rows={3}
                                                        placeholder="Summarize the announcement in a few sentences"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="coverImageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cover image URL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="url"
                                                        placeholder="https://cdn.example.com/news/cover.jpg"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                                        <FormField
                                            control={form.control}
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
                                                            {NEWS_STATUSES.map((status) => (
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
                                            control={form.control}
                                            name="publishedAt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Publish at</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="datetime-local"
                                                            value={field.value ?? ""}
                                                            onChange={field.onChange}
                                                            step={60}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="flex h-full flex-col">
                                                <div className="border-b px-6 py-4">
                                                    <FormLabel>Body</FormLabel>
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
                                        <AlertTitle>Unable to save article</AlertTitle>
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
        </section>
    )
}

interface NewsTableProps {
    data: NewsRecord[]
    isLoading: boolean
    deletingId: number | null
    onEdit: (record: NewsRecord) => void
    onDelete: (record: NewsRecord) => void
}

function NewsTable({ data, isLoading, deletingId, onEdit, onDelete }: NewsTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[260px]">Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="size-5" />
                                    Loading articles...
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                No articles match the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium leading-tight">{item.title}</span>
                                        <span className="text-sm text-muted-foreground line-clamp-2">
                                            {item.excerpt ?? "No excerpt provided"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusBadgeVariant[item.status]}>{statusLabel[item.status]}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatTimestamp(item.publishedAt)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatTimestamp(item.updatedAt)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {item.author?.name ?? item.author?.email ?? "-"}
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
