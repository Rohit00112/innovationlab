"use client"

import { useState, useRef } from "react"
import { Upload, Link as LinkIcon, X, FileText, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FileOrLinkInputProps {
    value: string
    onChange: (value: string) => void
    accept?: string
    placeholder?: string
    label?: string
    type?: "image" | "document"
    folder?: string
    className?: string
}

interface UploadResponse {
    success: boolean
    data?: {
        url: string
        publicId: string
        format: string
        width?: number
        height?: number
        bytes: number
        resourceType: string
    }
    error?: string
}

export function FileOrLinkInput({
    value,
    onChange,
    accept = "*/*",
    placeholder = "https://...",
    label,
    type = "document",
    folder = "uploads",
    className,
}: FileOrLinkInputProps) {
    const isCloudinaryUrl = value?.includes("cloudinary.com")
    const [mode, setMode] = useState<"link" | "upload">(isCloudinaryUrl || !value ? "link" : "link")
    const [fileName, setFileName] = useState<string>("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        const file = files[0]
        setFileName(file.name)
        setIsUploading(true)
        setUploadError(null)
        setUploadSuccess(false)

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", folder)
            formData.append("resourceType", type === "image" ? "image" : "auto")

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            const result: UploadResponse = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Upload failed")
            }

            if (result.data?.url) {
                onChange(result.data.url)
                setUploadSuccess(true)
                setTimeout(() => setUploadSuccess(false), 3000)
            }
        } catch (error) {
            console.error("[upload] Error:", error)
            setUploadError(error instanceof Error ? error.message : "Upload failed")
            setFileName("")
        } finally {
            setIsUploading(false)
        }
    }

    const clearFile = () => {
        onChange("")
        setFileName("")
        setUploadError(null)
        setUploadSuccess(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const hasValue = !!value

    return (
        <div className={cn("space-y-2", className)}>
            {label && <Label className="text-sm">{label}</Label>}

            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg w-fit">
                <button
                    type="button"
                    onClick={() => {
                        setMode("link")
                        setUploadError(null)
                    }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        mode === "link"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <LinkIcon className="h-3.5 w-3.5" />
                    Link
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMode("upload")
                        setUploadError(null)
                    }}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                        mode === "upload"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Upload className="h-3.5 w-3.5" />
                    Upload
                </button>
            </div>

            {/* Input Area */}
            {mode === "link" ? (
                <Input
                    type="url"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="rounded-lg"
                />
            ) : (
                <div className="space-y-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                    />

                    {hasValue ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                uploadSuccess ? "bg-green-500/10" : "bg-primary/10"
                            )}>
                                {uploadSuccess ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : type === "image" ? (
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                ) : (
                                    <FileText className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {fileName || "Uploaded file"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {uploadSuccess ? "Upload complete!" : value}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={clearFile}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-20 rounded-lg border-dashed flex flex-col gap-1"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                    <span className="text-xs text-muted-foreground">
                                        Uploading to cloud...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        Click to upload
                                    </span>
                                </>
                            )}
                        </Button>
                    )}

                    {/* Error Message */}
                    {uploadError && (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-xs">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{uploadError}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Preview for images */}
            {type === "image" && hasValue && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none"
                        }}
                    />
                </div>
            )}
        </div>
    )
}
