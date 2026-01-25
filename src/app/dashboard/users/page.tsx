"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

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
import { HttpError } from "@/lib/http/api-client";
import { createUser, deleteUser, listUsers, updateUser } from "@/lib/http/users";
import {
	USER_ROLES,
	USER_STATUSES,
	type CreateUserPayload,
	type UpdateUserPayload,
	type UserRecord,
	type UserRole,
	type UserStatus
} from "@/lib/types/users";

interface FormState {
	email: string;
	password: string;
	name: string;
	avatarUrl: string;
	role: UserRole;
	status: UserStatus;
	revokeSessions: boolean;
}

const emptyForm: FormState = {
	email: "",
	password: "",
	name: "",
	avatarUrl: "",
	role: "viewer",
	status: "active",
	revokeSessions: false
};

function toFormState(record: UserRecord): FormState {
	return {
		email: record.email,
		password: "",
		name: record.name ?? "",
		avatarUrl: record.avatarUrl ?? "",
		role: record.role,
		status: record.status,
		revokeSessions: false
	};
}

function nullIfEmpty(value: string) {
	return value.trim().length === 0 ? null : value.trim();
}

const roleLabel: Record<UserRole, string> = {
	admin: "Admin",
	editor: "Editor",
	author: "Author",
	viewer: "Viewer"
};

const statusLabel: Record<UserStatus, string> = {
	active: "Active",
	invited: "Invited",
	disabled: "Disabled"
};

const roleBadgeVariant: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
	admin: "default",
	editor: "secondary",
	author: "outline",
	viewer: "outline"
};

const statusBadgeVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
	active: "default",
	invited: "secondary",
	disabled: "destructive"
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

function getInitials(nameOrEmail: string) {
	const source = nameOrEmail.trim().length > 0 ? nameOrEmail : "User";
	return source
		.split(/\s+|@/)
		.filter(Boolean)
		.map(part => part[0]?.toUpperCase() ?? "")
		.join("")
		.slice(0, 2);
}

export default function UsersDashboard() {
	const [users, setUsers] = useState<UserRecord[]>([]);
	const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
	const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
	const [searchInput, setSearchInput] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
	const [activeUser, setActiveUser] = useState<UserRecord | null>(null);
	const [formState, setFormState] = useState<FormState>(emptyForm);
	const [formError, setFormError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const filters = useMemo(() => {
		return {
			role: roleFilter,
			status: statusFilter,
			search: searchValue ? searchValue : undefined
		};
	}, [roleFilter, statusFilter, searchValue]);

	const loadUsers = useCallback(async () => {
		setIsLoading(true);

		try {
			const data = await listUsers(filters);
			setUsers(data);
			setError(null);
		} catch (err) {
			const message = err instanceof HttpError ? err.message : "Failed to load users";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSearchValue(searchInput.trim());
	};

	const handleResetFilters = () => {
		setRoleFilter("all");
		setStatusFilter("all");
		setSearchInput("");
		setSearchValue("");
	};

	const openCreateDialog = () => {
		setDialogMode("create");
		setActiveUser(null);
		setFormState(emptyForm);
		setFormError(null);
		setDialogOpen(true);
	};

	const openEditDialog = (record: UserRecord) => {
		setDialogMode("edit");
		setActiveUser(record);
		setFormState(toFormState(record));
		setFormError(null);
		setDialogOpen(true);
	};

	const handleDialogOpenChange = (open: boolean) => {
		setDialogOpen(open);

		if (!open) {
			setActiveUser(null);
			setFormState(emptyForm);
			setFormError(null);
		}
	};

	const handleDelete = async (record: UserRecord) => {
		const confirmed = window.confirm(`Disable user ${record.email}?`);

		if (!confirmed) {
			return;
		}

		setDeletingId(record.id);

		try {
			await deleteUser(record.id);
			await loadUsers();
		} catch (err) {
			const message = err instanceof HttpError ? err.message : "Failed to disable user";
			setError(message);
		} finally {
			setDeletingId(null);
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const email = formState.email.trim().toLowerCase();
		const password = formState.password.trim();

		if (!email) {
			setFormError("Email is required.");
			return;
		}

		if (dialogMode === "create" && password.length < 8) {
			setFormError("Password must be at least 8 characters long.");
			return;
		}

		if (password && password.length < 8) {
			setFormError("Password must be at least 8 characters long.");
			return;
		}

		setIsSubmitting(true);

		const sharedFields = {
			email,
			name: nullIfEmpty(formState.name),
			avatarUrl: nullIfEmpty(formState.avatarUrl),
			role: formState.role,
			status: formState.status
		};

		try {
			if (dialogMode === "create") {
				const payload: CreateUserPayload = {
					...sharedFields,
					password
				};

				await createUser(payload);
			} else if (activeUser) {
				const payload: UpdateUserPayload = {
					...sharedFields,
					...(password ? { password } : {}),
					revokeSessions: formState.revokeSessions || undefined
				};

				await updateUser(activeUser.id, payload);
			}

			await loadUsers();
			handleDialogOpenChange(false);
		} catch (err) {
			const message = err instanceof HttpError ? err.message : "Unable to save user";
			setFormError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="w-full space-y-8 p-8">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">Manage access, roles, and account status.</p>
				</div>
				<Button onClick={openCreateDialog}>
					<Plus className="mr-2 h-4 w-4" />
					New User
				</Button>
			</div>

			<Separator />

			<Card className="border border-border">
				<CardHeader className="gap-6 md:flex md:flex-row md:items-end md:justify-between">
					<div>
						<CardTitle>User Directory</CardTitle>
						<CardDescription>Filter by role, status, or email to find specific members.</CardDescription>
					</div>
					<div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
						<div className="flex items-center gap-2">
							<Label htmlFor="role-filter" className="text-sm font-medium">
								Role
							</Label>
							<Select
								value={roleFilter}
								onValueChange={value => setRoleFilter(value as UserRole | "all")}
							>
								<SelectTrigger id="role-filter" className="w-[160px]">
									<SelectValue placeholder="All roles" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All roles</SelectItem>
									{USER_ROLES.map(role => (
										<SelectItem key={role} value={role}>
											{roleLabel[role]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center gap-2">
							<Label htmlFor="status-filter" className="text-sm font-medium">
								Status
							</Label>
							<Select
								value={statusFilter}
								onValueChange={value => setStatusFilter(value as UserStatus | "all")}
							>
								<SelectTrigger id="status-filter" className="w-[160px]">
									<SelectValue placeholder="All statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All statuses</SelectItem>
									{USER_STATUSES.map(status => (
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
								onChange={event => setSearchInput(event.target.value)}
								placeholder="Search email"
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
							<AlertTitle>Unable to load users</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<UsersTable
						data={users}
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
						<DialogTitle>{dialogMode === "create" ? "Create User" : "Edit User"}</DialogTitle>
						<DialogDescription>
							{dialogMode === "create"
								? "Invite a new teammate with the appropriate role and status."
								: `Update ${activeUser?.email ?? "the selected user"}.`}
						</DialogDescription>
					</DialogHeader>

					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									value={formState.email}
									onChange={event =>
										setFormState(prev => ({ ...prev, email: event.target.value }))
									}
									type="email"
									required
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={formState.name}
									onChange={event =>
										setFormState(prev => ({ ...prev, name: event.target.value }))
									}
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
									maxLength={2048}
									type="url"
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									value={formState.password}
									onChange={event =>
										setFormState(prev => ({ ...prev, password: event.target.value }))
									}
									type="password"
									placeholder={dialogMode === "edit" ? "Leave blank to keep current password" : undefined}
									required={dialogMode === "create"}
									minLength={dialogMode === "create" ? 8 : undefined}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="grid gap-2">
									<Label htmlFor="role">Role</Label>
									<Select
										value={formState.role}
										onValueChange={value =>
											setFormState(prev => ({ ...prev, role: value as UserRole }))
										}
									>
										<SelectTrigger id="role" className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{USER_ROLES.map(role => (
												<SelectItem key={role} value={role}>
													{roleLabel[role]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="status">Status</Label>
									<Select
										value={formState.status}
										onValueChange={value =>
											setFormState(prev => ({ ...prev, status: value as UserStatus }))
										}
									>
										<SelectTrigger id="status" className="w-full">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{USER_STATUSES.map(status => (
												<SelectItem key={status} value={status}>
													{statusLabel[status]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							{dialogMode === "edit" && (
								<div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed border-border px-3 py-2">
									<div>
										<p className="text-sm font-medium">Revoke active sessions</p>
										<p className="text-xs text-muted-foreground">Force sign-out after saving changes.</p>
									</div>
									<Switch
										id="revoke-sessions"
										checked={formState.revokeSessions}
										onCheckedChange={checked =>
											setFormState(prev => ({ ...prev, revokeSessions: checked }))
										}
									/>
								</div>
							)}
						</div>

						{formError && (
							<Alert variant="destructive">
								<AlertTitle>Unable to save user</AlertTitle>
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
	data: UserRecord[];
	isLoading: boolean;
	deletingId: number | null;
	onEdit: (record: UserRecord) => void;
	onDelete: (record: UserRecord) => void;
}

function UsersTable({ data, isLoading, deletingId, onEdit, onDelete }: TableProps) {
	return (
		<div className="w-full overflow-hidden rounded-xl border border-border">
			<Table className="w-[75vw]">
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[240px]">User</TableHead>
						<TableHead>Role</TableHead>
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
									Loading users…
								</div>
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
								No users match the selected filters.
							</TableCell>
						</TableRow>
					) : (
						data.map(item => (
							<TableRow key={item.id}>
								<TableCell className="min-w-[240px]">
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src={item.avatarUrl ?? undefined} alt={item.email} />
											<AvatarFallback>{getInitials(item.name ?? item.email)}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col gap-0.5">
											<span className="font-medium leading-none">
												{item.name ? item.name : item.email}
											</span>
											<span className="text-xs text-muted-foreground">{item.email}</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={roleBadgeVariant[item.role]}>{roleLabel[item.role]}</Badge>
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
