"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Edit, Trash2, Search, Filter, MoreHorizontal, Calendar, ArrowRight } from "lucide-react"
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
    CardFooter,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">News Articles</h2>
                    <p className="text-muted-foreground mt-1">
                        Create, manage, and publish news coverage.
                    </p>
                </div>
                <Button onClick={openCreateDialog} className="rounded-full shadow-md hover:shadow-lg transition-all">
                    <Plus className="mr-2 h-4 w-4" />
                    New Article
                </Button>
            </div>

            <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 border-b border-border/50">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <form onSubmit={handleSearchSubmit}>
                            <Input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search articles..."
                                className="pl-9 rounded-xl bg-background border-border/50"
                                type="search"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as NewsStatus | "all")}
                        >
                            <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-background">
                                <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {NEWS_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {statusLabel[status]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {(statusFilter !== "published" || searchValue) && (
                            <Button variant="ghost" onClick={handleResetFilters} size="sm" className="h-10 px-3 rounded-xl text-muted-foreground hover:text-foreground">
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-0">
                    {error && (
                        <div className="p-6">
                            <Alert variant="destructive">
                                <AlertTitle>Unable to load news</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <NewsTable
                        data={newsItems}
                        isLoading={isLoading}
                        deletingId={deletingId}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
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
                            <DialogTitle>{dialogMode === "create" ? "Create Article" : "Edit Article"}</DialogTitle>
                            <DialogDescription>
                                {dialogMode === "create"
                                    ? "Write and publish a new article for the platform."
                                    : "Make changes to the existing article."}
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
                                    <div className="w-[400px] flex-shrink-0 overflow-y-auto p-6 border-r border-border/50 space-y-6">
                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="Enter article title" className="rounded-lg" />
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
                                                            <Input {...field} placeholder="article-url-slug" className="rounded-lg" />
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
                                                                placeholder="Brief summary for list views..."
                                                                className="resize-none rounded-lg"
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
                                                        <FormLabel>Cover Image URL</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="url"
                                                                placeholder="https://..."
                                                                className="rounded-lg"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Status</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-lg">
                                                                    <SelectValue placeholder="Select status" />
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
                                                        <FormLabel>Publish Date</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="datetime-local"
                                                                value={field.value ?? ""}
                                                                onChange={field.onChange}
                                                                step={60}
                                                                className="rounded-lg"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {formError && (
                                                <Alert variant="destructive">
                                                    <AlertTitle>Error saving article</AlertTitle>
                                                    <AlertDescription>{formError}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Panel - Editor */}
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="p-6 border-b border-border/50">
                                            <h3 className="font-semibold text-lg">Content</h3>
                                            <p className="text-sm text-muted-foreground mt-1">Write your article content below</p>
                                        </div>
                                        <div className="flex-1 overflow-hidden p-6">
                                            <FormField
                                                control={form.control}
                                                name="content"
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

interface NewsTableProps {
    data: NewsRecord[]
    isLoading: boolean
    deletingId: number | null
    onEdit: (record: NewsRecord) => void
    onDelete: (record: NewsRecord) => void
}

function NewsTable({ data, isLoading, deletingId, onEdit, onDelete }: NewsTableProps) {
    return (
        <div className="border-t border-border/50">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-muted/40 border-border/50">
                        <TableHead className="w-[400px]">Article</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="size-5" />
                                    Loading articles...
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                No articles match the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/20 border-border/50 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col gap-1 py-1">
                                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[350px]">
                                            {item.excerpt ?? "No excerpt provided"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusBadgeVariant[item.status]} className="capitalize shadow-none">
                                        {statusLabel[item.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-foreground/80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                                            {(item.author?.name || item.author?.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <span className="whitespace-nowrap">{item.author?.name ?? item.author?.email ?? "-"}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    <div className="flex flex-col">
                                        <span>{formatTimestamp(item.publishedAt)}</span>
                                        {/* <span className="text-[10px] text-muted-foreground/60">Updated: {formatTimestamp(item.updatedAt)}</span> */}
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
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
        </div>
    )
}
