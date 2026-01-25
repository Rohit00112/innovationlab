"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { HttpError } from "@/lib/http/api-client";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial
} from "@/lib/http/testimonials";
import {
  TESTIMONIAL_STATUSES,
  type TestimonialRecord,
  type TestimonialStatus
} from "@/lib/types/testimonials";

interface FormState {
  headline: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
  isFeatured: boolean;
  status: TestimonialStatus;
}

const emptyForm: FormState = {
  headline: "",
  quote: "",
  author: "",
  role: "",
  company: "",
  avatarUrl: "",
  isFeatured: false,
  status: "draft"
};

function toFormState(record: TestimonialRecord): FormState {
  return {
    headline: record.headline ?? "",
    quote: record.quote,
    author: record.author,
    role: record.role ?? "",
    company: record.company ?? "",
    avatarUrl: record.avatarUrl ?? "",
    isFeatured: record.isFeatured,
    status: record.status
  };
}

function nullIfEmpty(value: string) {
  return value.trim().length === 0 ? null : value.trim();
}

const statusLabel: Record<TestimonialStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived"
};

const statusBadgeVariant: Record<TestimonialStatus, "default" | "secondary" | "destructive" | "outline"> = {
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
  } catch (error) {
    return "—";
  }
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export default function TestimonialsDashboard() {
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<TestimonialStatus>("published");
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [activeTestimonial, setActiveTestimonial] = useState<TestimonialRecord | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filters = useMemo(() => {
    return {
      status: statusFilter,
      search: searchValue ? searchValue : undefined
    };
  }, [statusFilter, searchValue]);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await listTestimonials(filters);
      setTestimonials(data);
      setError(null);
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Failed to load testimonials";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchValue(searchInput.trim());
  };

  const handleResetFilters = () => {
    setStatusFilter("published");
    setSearchInput("");
    setSearchValue("");
  };

  const openCreateDialog = () => {
    setDialogMode("create");
    setActiveTestimonial(null);
    setFormState(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  };

  const openEditDialog = (record: TestimonialRecord) => {
    setDialogMode("edit");
    setActiveTestimonial(record);
    setFormState(toFormState(record));
    setFormError(null);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);

    if (!open) {
      setActiveTestimonial(null);
      setFormState(emptyForm);
      setFormError(null);
    }
  };

  const handleDelete = async (record: TestimonialRecord) => {
    const confirmed = window.confirm(`Delete testimonial from ${record.author}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(record.id);

    try {
      await deleteTestimonial(record.id);
      await loadTestimonials();
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Failed to delete testimonial";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.author.trim() || !formState.quote.trim()) {
      setFormError("Author name and testimonial body are required.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      headline: nullIfEmpty(formState.headline),
      body: formState.quote.trim(),
      authorName: formState.author.trim(),
      authorTitle: nullIfEmpty(formState.role),
      company: nullIfEmpty(formState.company),
      avatarUrl: nullIfEmpty(formState.avatarUrl),
      isFeatured: formState.isFeatured,
      status: formState.status
    };

    try {
      if (dialogMode === "create") {
        await createTestimonial(payload);
      } else if (activeTestimonial) {
        await updateTestimonial(activeTestimonial.id, payload);
      }

      await loadTestimonials();
      handleDialogOpenChange(false);
    } catch (err) {
      const message = err instanceof HttpError ? err.message : "Unable to save testimonial";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full space-y-8 p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">Review, publish, and curate user testimonials.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Testimonial
        </Button>
      </div>

      <Separator />

      <Card className="border border-border !w-[80vw]">
        <CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>All Testimonials</CardTitle>
            <CardDescription>Filter by status or keywords to find submissions quickly.</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as TestimonialStatus)}
              >
                <SelectTrigger id="status-filter" className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TESTIMONIAL_STATUSES.map((status) => (
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
                placeholder="Search body copy"
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
              <AlertTitle>Unable to load testimonials</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TestimonialsTable
            data={testimonials}
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
            <DialogTitle>{dialogMode === "create" ? "Create Testimonial" : "Edit Testimonial"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Capture a new testimonial from a customer or learner."
                : `Update the testimonial from ${activeTestimonial?.author ?? ""}.`}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author-name">Author name</Label>
                <Input
                  id="author-name"
                  value={formState.author}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, author: event.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author-title">Author role / title</Label>
                  <Input
                    id="author-title"
                    value={formState.role}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, role: event.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formState.company}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, company: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={formState.headline}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, headline: event.target.value }))
                  }
                  maxLength={200}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="body">Testimonial</Label>
                <Textarea
                  id="body"
                  value={formState.quote}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, quote: event.target.value }))
                  }
                  required
                  rows={5}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formState.avatarUrl}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, avatarUrl: event.target.value }))
                  }
                  placeholder="https://example.com/avatar.jpg"
                  type="url"
                  maxLength={2048}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-dashed border-border px-3 py-2">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={formState.status}
                    onValueChange={(value) =>
                      setFormState((prev) => ({ ...prev, status: value as TestimonialStatus }))
                    }
                  >
                    <SelectTrigger id="status" className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TESTIMONIAL_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabel[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formState.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                  <Label htmlFor="featured" className="text-sm">
                    Featured testimonial
                  </Label>
                </div>
              </div>
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>Unable to save testimonial</AlertTitle>
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
  data: TestimonialRecord[];
  isLoading: boolean;
  deletingId: number | null;
  onEdit: (testimonial: TestimonialRecord) => void;
  onDelete: (testimonial: TestimonialRecord) => void;
}

function TestimonialsTable({ data, isLoading, deletingId, onEdit, onDelete }: TableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <Table>
        {/* <TableCaption>Most recent testimonials appear first.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">Author</TableHead>
            <TableHead>Headline</TableHead>
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
                  Loading testimonials…
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                No testimonials match the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="min-w-[220px]">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={item.avatarUrl ?? undefined} alt={item.author} />
                      <AvatarFallback>{getInitials(item.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium leading-none">{item.author}</span>
                      {(item.role || item.company) && (
                        <span className="text-xs text-muted-foreground">
                          {[item.role, item.company].filter(Boolean).join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[360px] space-y-1">
                    <p className="font-medium leading-tight">
                      {item.headline ? item.headline : "Untitled testimonial"}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.quote}</p>
                    {item.isFeatured && <Badge variant="secondary">Featured</Badge>}
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
