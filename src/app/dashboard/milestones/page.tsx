"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Edit, Plus, Trash2, Milestone as MilestoneIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { HttpError } from "@/lib/http/api-client";
import {
    listMilestones,
    createMilestone,
    updateMilestone,
    deleteMilestone,
} from "@/lib/http/milestones";
import type { MilestoneRecord } from "@/lib/types/milestones";

interface FormState {
    year: string;
    title: string;
    description: string;
    displayOrder: number;
}

const emptyForm: FormState = {
    year: "",
    title: "",
    description: "",
    displayOrder: 0,
};

function toFormState(record: MilestoneRecord): FormState {
    return {
        year: record.year,
        title: record.title,
        description: record.description ?? "",
        displayOrder: record.displayOrder,
    };
}

export default function MilestonesDashboard() {
    const [milestones, setMilestones] = useState<MilestoneRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [activeMilestone, setActiveMilestone] = useState<MilestoneRecord | null>(null);
    const [formState, setFormState] = useState<FormState>(emptyForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadMilestones = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await listMilestones();
            setMilestones(data);
            setError(null);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to load milestones";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMilestones();
    }, [loadMilestones]);

    const openCreateDialog = () => {
        setDialogMode("create");
        setActiveMilestone(null);
        setFormState(emptyForm);
        setFormError(null);
        setDialogOpen(true);
    };

    const openEditDialog = (record: MilestoneRecord) => {
        setDialogMode("edit");
        setActiveMilestone(record);
        setFormState(toFormState(record));
        setFormError(null);
        setDialogOpen(true);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setActiveMilestone(null);
            setFormState(emptyForm);
            setFormError(null);
        }
    };

    const handleDelete = async (record: MilestoneRecord) => {
        const confirmed = window.confirm(`Delete milestone "${record.title}" (${record.year})?`);
        if (!confirmed) return;

        setDeletingId(record.id);
        try {
            await deleteMilestone(record.id);
            await loadMilestones();
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Failed to delete milestone";
            setError(message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const year = formState.year.trim();
        const title = formState.title.trim();

        if (!year) {
            setFormError("Year is required.");
            return;
        }

        if (!title) {
            setFormError("Title is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                year,
                title,
                description: formState.description.trim() || null,
                displayOrder: formState.displayOrder,
            };

            if (dialogMode === "create") {
                await createMilestone(payload);
            } else if (activeMilestone) {
                await updateMilestone(activeMilestone.id, payload);
            }

            await loadMilestones();
            handleDialogOpenChange(false);
        } catch (err) {
            const message = err instanceof HttpError ? err.message : "Unable to save milestone";
            setFormError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full space-y-8 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Milestones</h2>
                    <p className="text-muted-foreground">
                        Manage the key moments displayed on the About page timeline.
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                </Button>
            </div>

            <Separator />

            <Card className="border border-border">
                <CardHeader>
                    <CardTitle>All Milestones</CardTitle>
                    <CardDescription>
                        These milestones appear on the About page in display order.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="w-full overflow-hidden rounded-xl border border-border">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Order</TableHead>
                                    <TableHead className="w-[100px]">Year</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            <div className="flex items-center justify-center gap-2">
                                                <Spinner className="size-5" />
                                                Loading milestones…
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : milestones.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                            <MilestoneIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                            No milestones yet. Click &quot;Add Milestone&quot; to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    milestones.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant="outline">{item.displayOrder}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{item.year}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[300px] truncate text-muted-foreground text-sm">
                                                {item.description || "—"}
                                            </TableCell>
                                            <TableCell className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditDialog(item)}
                                                    className="px-2"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(item)}
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
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogMode === "create" ? "Add Milestone" : "Edit Milestone"}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogMode === "create"
                                ? "Add a new milestone to the About page timeline."
                                : `Update "${activeMilestone?.title ?? "milestone"}".`}
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="year">Year *</Label>
                                    <Input
                                        id="year"
                                        value={formState.year}
                                        onChange={(e) =>
                                            setFormState((prev) => ({ ...prev, year: e.target.value }))
                                        }
                                        required
                                        maxLength={20}
                                        placeholder="e.g., 2024"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formState.title}
                                        onChange={(e) =>
                                            setFormState((prev) => ({ ...prev, title: e.target.value }))
                                        }
                                        required
                                        maxLength={200}
                                        placeholder="e.g., Foundation"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formState.description}
                                    onChange={(e) =>
                                        setFormState((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    rows={3}
                                    maxLength={2000}
                                    placeholder="Milestone details..."
                                />
                            </div>

                            <div className="grid gap-2 md:w-1/2">
                                <Label htmlFor="displayOrder">Display Order</Label>
                                <Input
                                    id="displayOrder"
                                    type="number"
                                    min={0}
                                    value={formState.displayOrder}
                                    onChange={(e) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            displayOrder: Number.parseInt(e.target.value, 10) || 0,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {formError && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving…" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
