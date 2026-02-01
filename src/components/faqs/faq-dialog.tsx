"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Faq } from "@/lib/types/faqs";
import { createFaqSchema, CreateFaqInput } from "@/lib/api/validation/faqs";
import { createFaq, updateFaq } from "@/lib/http/faqs";
import { useEffect } from "react";

interface FaqDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faq?: Faq | null;
    onSuccess: () => void;
}

export function FaqDialog({ open, onOpenChange, faq, onSuccess }: FaqDialogProps) {
    const isEditing = !!faq;

    const form = useForm<any>({
        resolver: zodResolver(createFaqSchema),
        defaultValues: {
            question: "",
            answer: "",
            category: "general",
            displayOrder: 0,
            isActive: true,
        },
    });

    useEffect(() => {
        if (faq) {
            form.reset({
                question: faq.question,
                answer: faq.answer,
                category: faq.category as any,
                displayOrder: faq.displayOrder,
                isActive: faq.isActive,
            });
        } else {
            form.reset({
                question: "",
                answer: "",
                category: "general",
                displayOrder: 0,
                isActive: true,
            });
        }
    }, [faq, form]);

    const onSubmit = async (values: CreateFaqInput) => {
        try {
            if (isEditing && faq) {
                await updateFaq(faq.id, values);
                toast.success("FAQ updated successfully");
            } else {
                await createFaq(values);
                toast.success("FAQ created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the details of the FAQ below."
                            : "Add a new FAQ to the system."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter question..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter answer..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="general">General</SelectItem>
                                                <SelectItem value="membership">Membership</SelectItem>
                                                <SelectItem value="events">Events</SelectItem>
                                                <SelectItem value="support">Support</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="displayOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Active Status</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">
                                {form.formState.isSubmitting
                                    ? "Saving..."
                                    : isEditing
                                        ? "Update FAQ"
                                        : "Create FAQ"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
