"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Eye, Plus, Trash2, Users } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { HttpError } from "@/lib/http/api-client";
import {
    createCommunity,
    deleteCommunity,
    listCommunitiesWithCount,
    updateCommunity
} from "@/lib/http/communities";
import {
    COMMUNITY_STATUSES,
    type CommunityStatus,
    type CommunityWithMemberCount,
    type CreateCommunityPayload,
    type UpdateCommunityPayload
} from "@/lib/types/communities";

interface FormState {
    name: string;
    description: string;
    content: string;
    coverImageUrl: string;
    status: CommunityStatus;
    displayOrder: number;
}

const emptyForm: FormState = {
    name: "",
    description: "",
    content: "",
    coverImageUrl: "",
    status: "draft",
    displayOrder: 0
};

function toFormState(record: CommunityWithMemberCount): FormState {
    return {
        name: record.name,
        description: record.description ?? "",
        content: record.content ?? "",
        coverImageUrl: record.coverImageUrl ?? "",
        status: record.status,
        displayOrder: record.displayOrder
    };
}

const statusLabel: Record<CommunityStatus, string> = {
    draft: "Draft",
    published: "Published",
    archived: "Archived"
};

const statusBadgeVariant: Record<CommunityStatus, "default" | "secondary" | "destructive" | "outline"> = {
    draft: "secondary",
    published: "default",
    archived: "outline"
};

function formatTimestamp(value: string) {
    try {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? "—"
            : date.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
            });
    } catch {
        return "—";
    }
}

export default function CommunitiesDashboard() {
    const [communities, setCommunities] = useState<CommunityWithMemberCount[]>([]);
    const [statusFilter, setStatusFilter] = useState<CommunityStatus | "all">("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [activeCommunity, setActiveCommunity] = useState<CommunityWithMemberCount | null>(null);
    const [formState, setFormState] = useState<FormState>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadCommunities = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await listCommunitiesWithCount({
                status: statusFilter === "all" ? undefined : statusFilter
            });
            setCommunities(data);
            setError(null);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to load communities";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadCommunities();
    }, [loadCommunities]);

    const openCreateDialog = () => {
        setDialogMode("create");
        setActiveCommunity(null);
        setFormState(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (record: CommunityWithMemberCount) => {
        setDialogMode("edit");
        setActiveCommunity(record);
        setFormState(toFormState(record));
        setFormError(null);
        setDialogOpen(true);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);

        if (!open) {
            setActiveCommunity(null);
            setFormState(emptyForm);
            setFormError(null);
        }
    };

    const handleDelete = async (record: CommunityWithMemberCount) => {
        const confirmed = window.confirm(`Delete community "${record.name}"? This will also remove all members.`);

        if (!confirmed) {
            return;
        }

        setDeletingId(record.id);

        try {
            await deleteCommunity(record.id);
            await loadCommunities();
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to delete community";
            setError(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = formState.name.trim();

        if (!name) {
            setFormError("Name is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            if (dialogMode === "create") {
                const payload: CreateCommunityPayload = {
                    name,
                    description: formState.description.trim() || null,
                    content: formState.content.trim() || null,
                    coverImageUrl: formState.coverImageUrl.trim() || null,
                    status: formState.status,
                    displayOrder: formState.displayOrder
                };

                await createCommunity(payload);
            } else if (activeCommunity) {
                const payload: UpdateCommunityPayload = {
                    name,
                    description: formState.description.trim() || null,
                    content: formState.content.trim() || null,
                    coverImageUrl: formState.coverImageUrl.trim() || null,
                    status: formState.status,
                    displayOrder: formState.displayOrder
                };

                await updateCommunity(activeCommunity.id, payload);
            }

            await loadCommunities();
            handleDialogOpenChange(false);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Unable to save community";
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full space-y-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Communities</h2>
                    <p className="text-muted-foreground">Manage community labs and their members.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Community
                </Button>
            </div>

            <Separator />

            <Card className="border border-border">
                <CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
                    <div>
                        <CardTitle>Community Directory</CardTitle>
                        <CardDescription>Filter by status to find specific communities.</CardDescription>
                    </div>
                    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="status-filter" className="text-sm font-medium">
                                Status
                            </Label>
                            <Select
                                value={statusFilter}
                                onValueChange={value => setStatusFilter(value as CommunityStatus | "all")}
                            >
                                <SelectTrigger id="status-filter" className="w-[160px]">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {COMMUNITY_STATUSES.map(status => (
                                        <SelectItem key={status} value={status}>
                                            {statusLabel[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to load communities</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <CommunitiesTable
                        data={communities}
                        isLoading={isLoading}
                        deletingId={deletingId}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "create" ? "Create Community" : "Edit Community"}</DialogTitle>
                        <DialogDescription>
                            {dialogMode === "create"
                                ? "Create a new community lab."
                                : `Update ${activeCommunity?.name ?? "the selected community"}.`}
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={formState.name}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, name: event.target.value }))
                                    }
                                    required
                                    maxLength={200}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formState.description}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, description: event.target.value }))
                                    }
                                    rows={2}
                                    maxLength={500}
                                    placeholder="Short description of the community"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Full Content</Label>
                                <Textarea
                                    id="content"
                                    value={formState.content}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, content: event.target.value }))
                                    }
                                    rows={4}
                                    placeholder="Detailed information about the community"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="coverImage">Cover Image URL</Label>
                                <Input
                                    id="coverImage"
                                    value={formState.coverImageUrl}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, coverImageUrl: event.target.value }))
                                    }
                                    placeholder="https://example.com/image.jpg"
                                    type="url"
                                    maxLength={2048}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formState.status}
                                        onValueChange={value =>
                                            setFormState(prev => ({ ...prev, status: value as CommunityStatus }))
                                        }
                                    >
                                        <SelectTrigger id="status" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COMMUNITY_STATUSES.map(status => (
                                                <SelectItem key={status} value={status}>
                                                    {statusLabel[status]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="displayOrder">Display Order</Label>
                                    <Input
                                        id="displayOrder"
                                        type="number"
                                        min={0}
                                        value={formState.displayOrder}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, displayOrder: Number.parseInt(event.target.value, 10) || 0 }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {formError && (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to save community</AlertTitle>
                                <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving…" : "Save changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}

interface TableProps {
    data: CommunityWithMemberCount[];
    isLoading: boolean;
    deletingId: number | null;
    onEdit: (record: CommunityWithMemberCount) => void;
    onDelete: (record: CommunityWithMemberCount) => void;
}

function CommunitiesTable({ data, isLoading, deletingId, onEdit, onDelete }: TableProps) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-border">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[200px]">Community</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="size-5" />
                                    Loading communities…
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                No communities match the selected filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="min-w-[200px]">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium leading-none">{item.name}</span>
                                        {item.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {item.description}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.memberCount}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusBadgeVariant[item.status]}>{statusLabel[item.status]}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatTimestamp(item.updatedAt)}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        asChild
                                        className="px-2"
                                    >
                                        <Link href={`/dashboard/communities/${item.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(item)}
                                        className="px-2"
                                    >
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
    );
}
