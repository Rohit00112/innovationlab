"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Share2,
    Twitter,
    Facebook,
    Linkedin,
    Link2,
    Mail,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title: string;
    description?: string;
    url?: string;
    className?: string;
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export function ShareButton({
    title,
    description,
    url,
    className,
    variant = "outline",
    size = "default",
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    // Use current URL if not provided
    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || "");

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: description,
                    url: shareUrl,
                });
            } catch {
                // User cancelled or error occurred
            }
        }
    };

    // Check if native share is available (mobile browsers)
    const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className={cn("gap-2", className)}>
                    <Share2 className="h-4 w-4" />
                    {size !== "icon" && "Share"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {hasNativeShare && (
                    <DropdownMenuItem onClick={handleNativeShare} className="gap-3 cursor-pointer">
                        <Share2 className="h-4 w-4" />
                        Share...
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer"
                    >
                        <Twitter className="h-4 w-4" />
                        Twitter / X
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer"
                    >
                        <Facebook className="h-4 w-4" />
                        Facebook
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-3 cursor-pointer"
                    >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={shareLinks.email} className="gap-3 cursor-pointer">
                        <Mail className="h-4 w-4" />
                        Email
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyToClipboard} className="gap-3 cursor-pointer">
                    {copied ? (
                        <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Link2 className="h-4 w-4" />
                            Copy link
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface ShareButtonsInlineProps {
    title: string;
    description?: string;
    url?: string;
    className?: string;
}

export function ShareButtonsInline({
    title,
    description,
    url,
    className,
}: ShareButtonsInlineProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || "");

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className="text-sm text-muted-foreground mr-1">Share:</span>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
            >
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Twitter"
                >
                    <Twitter className="h-4 w-4" />
                </a>
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
            >
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on Facebook"
                >
                    <Facebook className="h-4 w-4" />
                </a>
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
            >
                <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                >
                    <Linkedin className="h-4 w-4" />
                </a>
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                asChild
            >
                <a
                    href={`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`}
                    title="Share via Email"
                >
                    <Mail className="h-4 w-4" />
                </a>
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={copyToClipboard}
                title={copied ? "Copied!" : "Copy link"}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                ) : (
                    <Link2 className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
