"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Edit, Plus, Trash2, Users } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
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
    createTeamMember,
    deleteTeamMember,
    listTeamMembers,
    updateTeamMember
} from "@/lib/http/team";
import {
    TEAM_MEMBER_CATEGORIES,
    type TeamMemberCategory,
    type TeamMemberRecord,
    type CreateTeamMemberPayload,
    type UpdateTeamMemberPayload
} from "@/lib/types/team";

interface FormState {
    name: string;
    position: string;
    bio: string;
    photoUrl: string;
    email: string;
    linkedinUrl: string;
    githubUrl: string;
    websiteUrl: string;
    category: TeamMemberCategory;
    displayOrder: number;
    isActive: boolean;
}

const emptyForm: FormState = {
    name: "",
    position: "",
    bio: "",
    photoUrl: "",
    email: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    category: "core",
    displayOrder: 0,
    isActive: true
};

function toFormState(record: TeamMemberRecord): FormState {
    return {
        name: record.name,
        position: record.position,
        bio: record.bio ?? "",
        photoUrl: record.photoUrl ?? "",
        email: record.email ?? "",
        linkedinUrl: record.linkedinUrl ?? "",
        githubUrl: record.githubUrl ?? "",
        websiteUrl: record.websiteUrl ?? "",
        category: record.category,
        displayOrder: record.displayOrder,
        isActive: record.isActive
    };
}

const categoryLabel: Record<TeamMemberCategory, string> = {
    head: "Innovation Lab Head",
    core: "Core Member",
    mentor: "Mentor"
};

const categoryBadgeVariant: Record<TeamMemberCategory, "default" | "secondary" | "destructive" | "outline"> = {
    head: "default",
    core: "secondary",
    mentor: "outline"
};

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
}

export default function TeamDashboard() {
    const [members, setMembers] = useState<TeamMemberRecord[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<TeamMemberCategory | "all">("all");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [activeMember, setActiveMember] = useState<TeamMemberRecord | null>(null);
    const [formState, setFormState] = useState<FormState>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadMembers = useCallback(async () => {
        setIsLoading(true);

        try {
            const data = await listTeamMembers({
                category: categoryFilter === "all" ? undefined : categoryFilter,
                activeOnly: false
            });
            setMembers(data);
            setError(null);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to load team members";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [categoryFilter]);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    const openCreateDialog = () => {
        setDialogMode("create");
        setActiveMember(null);
        setFormState(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (record: TeamMemberRecord) => {
        setDialogMode("edit");
        setActiveMember(record);
        setFormState(toFormState(record));
        setFormError(null);
        setDialogOpen(true);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);

        if (!open) {
            setActiveMember(null);
            setFormState(emptyForm);
            setFormError(null);
        }
    };

    const handleDelete = async (record: TeamMemberRecord) => {
        const confirmed = window.confirm(`Delete team member "${record.name}"?`);

        if (!confirmed) {
            return;
        }

        setDeletingId(record.id);

        try {
            await deleteTeamMember(record.id);
            await loadMembers();
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to delete team member";
            setError(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = formState.name.trim();
        const position = formState.position.trim();

        if (!name) {
            setFormError("Name is required.");
            return;
        }

        if (!position) {
            setFormError("Position is required.");
            return;
        }

        setIsSubmitting(true);

        const nullIfEmpty = (value: string) => value.trim() || null;

        try {
            if (dialogMode === "create") {
                const payload: CreateTeamMemberPayload = {
                    name,
                    position,
                    bio: nullIfEmpty(formState.bio),
                    photoUrl: nullIfEmpty(formState.photoUrl),
                    email: nullIfEmpty(formState.email),
                    linkedinUrl: nullIfEmpty(formState.linkedinUrl),
                    githubUrl: nullIfEmpty(formState.githubUrl),
                    websiteUrl: nullIfEmpty(formState.websiteUrl),
                    category: formState.category,
                    displayOrder: formState.displayOrder,
                    isActive: formState.isActive
                };

                await createTeamMember(payload);
            } else if (activeMember) {
                const payload: UpdateTeamMemberPayload = {
                    name,
                    position,
                    bio: nullIfEmpty(formState.bio),
                    photoUrl: nullIfEmpty(formState.photoUrl),
                    email: nullIfEmpty(formState.email),
                    linkedinUrl: nullIfEmpty(formState.linkedinUrl),
                    githubUrl: nullIfEmpty(formState.githubUrl),
                    websiteUrl: nullIfEmpty(formState.websiteUrl),
                    category: formState.category,
                    displayOrder: formState.displayOrder,
                    isActive: formState.isActive
                };

                await updateTeamMember(activeMember.id, payload);
            }

            await loadMembers();
            handleDialogOpenChange(false);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Unable to save team member";
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full space-y-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Team</h2>
                    <p className="text-muted-foreground">Manage your team members and their profiles.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
            </div>

            <Separator />

            <Card className="border border-border">
                <CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
                    <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Filter by category to find specific team members.</CardDescription>
                    </div>
                    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="category-filter" className="text-sm font-medium">
                                Category
                            </Label>
                            <Select
                                value={categoryFilter}
                                onValueChange={value => setCategoryFilter(value as TeamMemberCategory | "all")}
                            >
                                <SelectTrigger id="category-filter" className="w-[160px]">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {TEAM_MEMBER_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>
                                            {categoryLabel[cat]}
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
                            <AlertTitle>Unable to load team members</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <TeamMembersTable
                        data={members}
                        isLoading={isLoading}
                        deletingId={deletingId}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "create" ? "Add Team Member" : "Edit Team Member"}</DialogTitle>
                        <DialogDescription>
                            {dialogMode === "create"
                                ? "Add a new member to your team."
                                : `Update ${activeMember?.name ?? "the selected member"}.`}
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
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
                                    <Label htmlFor="position">Position *</Label>
                                    <Input
                                        id="position"
                                        value={formState.position}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, position: event.target.value }))
                                        }
                                        required
                                        maxLength={200}
                                        placeholder="e.g., Software Engineer"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={formState.bio}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, bio: event.target.value }))
                                    }
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="Short biography"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="photoUrl">Photo URL</Label>
                                    <Input
                                        id="photoUrl"
                                        value={formState.photoUrl}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, photoUrl: event.target.value }))
                                        }
                                        placeholder="https://example.com/photo.jpg"
                                        type="url"
                                        maxLength={2048}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={formState.email}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, email: event.target.value }))
                                        }
                                        type="email"
                                        maxLength={255}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-2">
                                <Label>Social Links</Label>
                                <div className="grid gap-3">
                                    <Input
                                        value={formState.linkedinUrl}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, linkedinUrl: event.target.value }))
                                        }
                                        placeholder="LinkedIn URL"
                                        type="url"
                                        maxLength={500}
                                    />
                                    <Input
                                        value={formState.githubUrl}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, githubUrl: event.target.value }))
                                        }
                                        placeholder="GitHub URL"
                                        type="url"
                                        maxLength={500}
                                    />
                                    <Input
                                        value={formState.websiteUrl}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, websiteUrl: event.target.value }))
                                        }
                                        placeholder="Personal Website URL"
                                        type="url"
                                        maxLength={500}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formState.category}
                                        onValueChange={value =>
                                            setFormState(prev => ({ ...prev, category: value as TeamMemberCategory }))
                                        }
                                    >
                                        <SelectTrigger id="category" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TEAM_MEMBER_CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>
                                                    {categoryLabel[cat]}
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

                            <div className="flex items-center justify-between gap-2 rounded-md border border-dashed border-border px-3 py-2">
                                <div>
                                    <p className="text-sm font-medium">Active</p>
                                    <p className="text-xs text-muted-foreground">Show on public pages</p>
                                </div>
                                <Switch
                                    id="isActive"
                                    checked={formState.isActive}
                                    onCheckedChange={checked =>
                                        setFormState(prev => ({ ...prev, isActive: checked }))
                                    }
                                />
                            </div>
                        </div>

                        {formError && (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to save team member</AlertTitle>
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
    data: TeamMemberRecord[];
    isLoading: boolean;
    deletingId: number | null;
    onEdit: (record: TeamMemberRecord) => void;
    onDelete: (record: TeamMemberRecord) => void;
}

function TeamMembersTable({ data, isLoading, deletingId, onEdit, onDelete }: TableProps) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-border">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[200px]">Member</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner className="size-5" />
                                    Loading team members…
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                No team members yet. Click &quot;Add Member&quot; to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={item.photoUrl ?? undefined} alt={item.name} />
                                            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium leading-none">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.position}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={categoryBadgeVariant[item.category]}>
                                        {categoryLabel[item.category]}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.isActive ? "default" : "outline"}>
                                        {item.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2">
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
