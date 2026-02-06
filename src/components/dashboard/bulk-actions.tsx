"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BulkAction<TStatus extends string = string> {
    id: string;
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "outline";
    confirmTitle?: string;
    confirmDescription?: string;
    status?: TStatus; // For status update actions
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BulkActionsBarProps<T, TStatus extends string = string> {
    selectedIds: number[];
    totalCount: number;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onBulkAction: (action: string, status?: TStatus) => Promise<void>;
    actions: BulkAction<TStatus>[];
    statusOptions?: { value: TStatus; label: string }[];
    isProcessing?: boolean;
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BulkActionsBar<T, TStatus extends string = string>({
    selectedIds,
    totalCount,
    onSelectAll,
    onClearSelection,
    onBulkAction,
    actions,
    statusOptions,
    isProcessing = false,
    className,
}: BulkActionsBarProps<T, TStatus>) {
    const [confirmAction, setConfirmAction] = useState<BulkAction<TStatus> | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<TStatus | "">("");

    const selectedCount = selectedIds.length;
    const hasSelection = selectedCount > 0;

    const handleActionClick = (action: BulkAction<TStatus>) => {
        if (action.confirmTitle) {
            setConfirmAction(action);
        } else {
            onBulkAction(action.id, action.status);
        }
    };

    const handleConfirm = async () => {
        if (confirmAction) {
            await onBulkAction(confirmAction.id, confirmAction.status);
            setConfirmAction(null);
        }
    };

    const handleStatusChange = async () => {
        if (selectedStatus) {
            await onBulkAction("updateStatus", selectedStatus as TStatus);
            setSelectedStatus("");
        }
    };

    if (!hasSelection) {
        return null;
    }

    return (
        <>
            <div
                className={cn(
                    "flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in slide-in-from-top-2",
                    className
                )}
            >
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                        {selectedCount} of {totalCount} selected
                    </span>
                </div>

                <div className="h-4 w-px bg-border" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSelectAll}
                    className="text-xs h-8"
                >
                    Select all
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="text-xs h-8"
                >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                </Button>

                <div className="flex-1" />

                {statusOptions && statusOptions.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => setSelectedStatus(value as TStatus | "")}
                        >
                            <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg">
                                <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleStatusChange}
                            disabled={!selectedStatus || isProcessing}
                            className="h-8 text-xs rounded-lg"
                        >
                            Apply
                        </Button>
                    </div>
                )}

                {actions.map((action) => (
                    <Button
                        key={action.id}
                        size="sm"
                        variant={action.variant || "outline"}
                        onClick={() => handleActionClick(action)}
                        disabled={isProcessing}
                        className="h-8 text-xs rounded-lg gap-1.5"
                    >
                        {action.icon}
                        {action.label}
                    </Button>
                ))}
            </div>

            <AlertDialog
                open={!!confirmAction}
                onOpenChange={(open) => !open && setConfirmAction(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction?.confirmTitle || "Confirm action"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction?.confirmDescription ||
                                `This will affect ${selectedCount} selected item${selectedCount > 1 ? "s" : ""}.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={cn(
                                confirmAction?.variant === "destructive" &&
                                "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            )}
                        >
                            {isProcessing ? "Processing..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

interface SelectableCheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function SelectableCheckbox({
    checked,
    onCheckedChange,
    disabled,
}: SelectableCheckboxProps) {
    return (
        <Checkbox
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
    );
}

interface SelectAllCheckboxProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onClearSelection: () => void;
    disabled?: boolean;
}

export function SelectAllCheckbox({
    selectedCount,
    totalCount,
    onSelectAll,
    onClearSelection,
    disabled,
}: SelectAllCheckboxProps) {
    const isAllSelected = selectedCount > 0 && selectedCount === totalCount;
    const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

    const handleChange = (checked: boolean) => {
        if (checked) {
            onSelectAll();
        } else {
            onClearSelection();
        }
    };

    return (
        <Checkbox
            checked={isAllSelected}
            ref={(el) => {
                if (el) {
                    (el as HTMLButtonElement & { indeterminate: boolean }).indeterminate = isPartiallySelected;
                }
            }}
            onCheckedChange={handleChange}
            disabled={disabled || totalCount === 0}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
    );
}
