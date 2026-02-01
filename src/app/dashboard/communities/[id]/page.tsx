"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";

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
    addCommunityMember,
    getCommunity,
    listCommunityMembers,
    removeCommunityMember,
    updateCommunityMember
} from "@/lib/http/communities";
import type { CommunityRecord } from "@/lib/types/communities";
import {
    COMMUNITY_MEMBER_ROLES,
    type CommunityMemberRecord,
    type CommunityMemberRole,
    type CreateCommunityMemberPayload,
    type UpdateCommunityMemberPayload
} from "@/lib/types/community-members";

interface FormState {
    name: string;
    title: string;
    email: string;
    bio: string;
    avatarUrl: string;
    role: CommunityMemberRole;
    linkedinUrl: string;
    githubUrl: string;
    websiteUrl: string;
    displayOrder: number;
    isActive: boolean;
}

const emptyForm: FormState = {
    name: "",
    title: "",
    email: "",
    bio: "",
    avatarUrl: "",
    role: "member",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    displayOrder: 0,
    isActive: true
};

function toFormState(record: CommunityMemberRecord): FormState {
    return {
        name: record.name,
        title: record.title ?? "",
        email: record.email ?? "",
        bio: record.bio ?? "",
        avatarUrl: record.avatarUrl ?? "",
        role: record.role,
        linkedinUrl: record.linkedinUrl ?? "",
        githubUrl: record.githubUrl ?? "",
        websiteUrl: record.websiteUrl ?? "",
        displayOrder: record.displayOrder,
        isActive: record.isActive
    };
}

const roleLabel: Record<CommunityMemberRole, string> = {
    lead: "Lead",
    member: "Member",
    advisor: "Advisor"
};

const roleBadgeVariant: Record<CommunityMemberRole, "default" | "secondary" | "destructive" | "outline"> = {
    lead: "default",
    member: "secondary",
    advisor: "outline"
};

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2);
}

export default function CommunityMembersPage() {
    const params = useParams();
    const communityId = Number.parseInt(params.id as string, 10);

    const [community, setCommunity] = useState<CommunityRecord | null>(null);
    const [members, setMembers] = useState<CommunityMemberRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [activeMember, setActiveMember] = useState<CommunityMemberRecord | null>(null);
    const [formState, setFormState] = useState<FormState>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        if (Number.isNaN(communityId)) {
            setError("Invalid community ID");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const [communityData, membersData] = await Promise.all([
                getCommunity(communityId),
                listCommunityMembers(communityId, { activeOnly: false })
            ]);
            setCommunity(communityData);
            setMembers(membersData);
            setError(null);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to load data";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [communityId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openCreateDialog = () => {
        setDialogMode("create");
        setActiveMember(null);
        setFormState(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (record: CommunityMemberRecord) => {
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

    const handleDelete = async (record: CommunityMemberRecord) => {
        const confirmed = window.confirm(`Remove member "${record.name}" from this community?`);

        if (!confirmed) {
            return;
        }

        setDeletingId(record.id);

        try {
            await removeCommunityMember(communityId, record.id);
            await loadData();
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to remove member";
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

        const nullIfEmpty = (value: string) => value.trim() || null;

        try {
            if (dialogMode === "create") {
                const payload: CreateCommunityMemberPayload = {
                    name,
                    title: nullIfEmpty(formState.title),
                    email: nullIfEmpty(formState.email),
                    bio: nullIfEmpty(formState.bio),
                    avatarUrl: nullIfEmpty(formState.avatarUrl),
                    role: formState.role,
                    linkedinUrl: nullIfEmpty(formState.linkedinUrl),
                    githubUrl: nullIfEmpty(formState.githubUrl),
                    websiteUrl: nullIfEmpty(formState.websiteUrl),
                    displayOrder: formState.displayOrder,
                    isActive: formState.isActive
                };

                await addCommunityMember(communityId, payload);
            } else if (activeMember) {
                const payload: UpdateCommunityMemberPayload = {
                    name,
                    title: nullIfEmpty(formState.title),
                    email: nullIfEmpty(formState.email),
                    bio: nullIfEmpty(formState.bio),
                    avatarUrl: nullIfEmpty(formState.avatarUrl),
                    role: formState.role,
                    linkedinUrl: nullIfEmpty(formState.linkedinUrl),
                    githubUrl: nullIfEmpty(formState.githubUrl),
                    websiteUrl: nullIfEmpty(formState.websiteUrl),
                    displayOrder: formState.displayOrder,
                    isActive: formState.isActive
                };

                await updateCommunityMember(communityId, activeMember.id, payload);
            }

            await loadData();
            handleDialogOpenChange(false);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Unable to save member";
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="w-full p-8 flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner className="size-5" />
                    Loading community...
                </div>
            </section>
        );
    }

    if (!community) {
        return (
            <section className="w-full p-8">
                <Alert variant="destructive">
                    <AlertTitle>Community not found</AlertTitle>
                    <AlertDescription>{error || "The community you're looking for doesn't exist."}</AlertDescription>
                </Alert>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/dashboard/communities">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Communities
                    </Link>
                </Button>
            </section>
        );
    }

    return (
        <section className="w-full space-y-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/communities">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <span className="text-sm text-muted-foreground">Communities</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">{community.name}</h2>
                    <p className="text-muted-foreground">Manage members of this community.</p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                </Button>
            </div>

            <Separator />

            <Card className="border border-border">
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>
                        {members.length} member{members.length === 1 ? "" : "s"} in this community.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <MembersTable
                        data={members}
                        deletingId={deletingId}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === "create" ? "Add Member" : "Edit Member"}</DialogTitle>
                        <DialogDescription>
                            {dialogMode === "create"
                                ? "Add a new member to this community."
                                : `Update ${activeMember?.name ?? "the selected member"}.`}
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

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formState.title}
                                        onChange={event =>
                                            setFormState(prev => ({ ...prev, title: event.target.value }))
                                        }
                                        placeholder="e.g., Research Lead"
                                        maxLength={200}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={formState.role}
                                        onValueChange={value =>
                                            setFormState(prev => ({ ...prev, role: value as CommunityMemberRole }))
                                        }
                                    >
                                        <SelectTrigger id="role" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COMMUNITY_MEMBER_ROLES.map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {roleLabel[role]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
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

                            <div className="grid gap-2">
                                <Label htmlFor="avatar">Avatar URL</Label>
                                <Input
                                    id="avatar"
                                    value={formState.avatarUrl}
                                    onChange={event =>
                                        setFormState(prev => ({ ...prev, avatarUrl: event.target.value }))
                                    }
                                    placeholder="https://example.com/avatar.jpg"
                                    type="url"
                                    maxLength={2048}
                                />
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

                                <div className="flex items-center justify-between gap-2 rounded-md border border-dashed border-border px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">Active</p>
                                        <p className="text-xs text-muted-foreground">Show on public page</p>
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
                        </div>

                        {formError && (
                            <Alert variant="destructive">
                                <AlertTitle>Unable to save member</AlertTitle>
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
    data: CommunityMemberRecord[];
    deletingId: number | null;
    onEdit: (record: CommunityMemberRecord) => void;
    onDelete: (record: CommunityMemberRecord) => void;
}

function MembersTable({ data, deletingId, onEdit, onDelete }: TableProps) {
    if (data.length === 0) {
        return (
            <div className="py-10 text-center text-muted-foreground border border-border rounded-xl">
                No members in this community yet. Click &quot;Add Member&quot; to get started.
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-border">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[200px]">Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(item => (
                        <TableRow key={item.id}>
                            <TableCell className="min-w-[200px]">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={item.avatarUrl ?? undefined} alt={item.name} />
                                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium leading-none">{item.name}</span>
                                        {item.title && (
                                            <span className="text-xs text-muted-foreground">{item.title}</span>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={roleBadgeVariant[item.role]}>{roleLabel[item.role]}</Badge>
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
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
