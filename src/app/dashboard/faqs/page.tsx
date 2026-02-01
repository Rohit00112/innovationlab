"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FaqDialog } from "@/components/faqs/faq-dialog";
import { deleteFaq, fetchFaqs } from "@/lib/http/faqs";
import { Faq } from "@/lib/types/faqs";

export default function FaqsPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);

    const loadFaqs = async () => {
        try {
            setIsLoading(true);
            const data = await fetchFaqs(undefined, true);
            setFaqs(data);
        } catch (error) {
            toast.error("Failed to load FAQs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFaqs();
    }, []);

    const filteredFaqs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        setSelectedFaq(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (faq: Faq) => {
        setSelectedFaq(faq);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            await deleteFaq(id);
            toast.success("FAQ deleted successfully");
            loadFaqs();
        } catch (error) {
            toast.error("Failed to delete FAQ");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">FAQs</h2>
                    <p className="text-muted-foreground">
                        Manage your frequently asked questions.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>All Questions</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search FAQs..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-muted/5">
                                    <TableHead className="w-[400px]">Question</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredFaqs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No FAQs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFaqs.map((faq) => (
                                        <TableRow key={faq.id} className="hover:bg-muted/5">
                                            <TableCell className="font-medium">
                                                {faq.question}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {faq.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={faq.isActive ? "default" : "secondary"}
                                                    className={faq.isActive ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20" : ""}
                                                >
                                                    {faq.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{faq.displayOrder}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(faq)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(faq.id)}
                                                            className="text-red-500 focus:text-red-500"
                                                        >
                                                            <Trash className="mr-2 h-4 w-4" /> Delete
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
                </CardContent>
            </Card>

            <FaqDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                faq={selectedFaq}
                onSuccess={loadFaqs}
            />
        </div>
    );
}
