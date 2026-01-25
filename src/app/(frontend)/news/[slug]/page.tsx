import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { normalizeLexicalState, estimateReadingTime } from "@/lib/editor/lexical-utils"
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url"
import type { NewsRecord } from "@/lib/types/news"

// Force dynamic rendering since we don't have generateStaticParams implemented yet
export const dynamic = "force-dynamic"

interface NewsApiResponse {
    data: NewsRecord[]
}

async function fetchNewsBySlug(slug: string): Promise<NewsRecord | null> {
    const baseUrl = resolveApiBaseUrl()
    const url = new URL("/api/news", baseUrl)
    url.searchParams.set("slug", slug)

    try {
        const response = await fetch(url.toString(), {
            cache: "no-store",
        })

        if (!response.ok) {
            // If the API returns 404 or other errors, return null to trigger notFound()
            return null
        }

        const payload = (await response.json()) as NewsApiResponse
        // The API returns an array, so we take the first item
        return payload.data[0] || null
    } catch (error) {
        console.error("Error fetching news by slug:", error)
        return null
    }
}

function formatPublishedDate(record: NewsRecord) {
    const source = record.publishedAt ?? record.createdAt
    const date = new Date(source)

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable"
    }

    return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

function getAuthorLabel(record: NewsRecord) {
    if (record.author?.name && record.author.name.trim()) {
        return record.author.name.trim()
    }
    return "Innovation Lab"
}

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function NewsArticlePage({ params }: PageProps) {
    const { slug } = await params
    const article = await fetchNewsBySlug(slug)

    if (!article) {
        notFound()
    }

    const normalized = normalizeLexicalState(article.content)
    const readTime = estimateReadingTime(normalized.plainText)
    const author = getAuthorLabel(article)
    const publishedDate = formatPublishedDate(article)
    const coverImage = article.coverImageUrl?.trim() ? article.coverImageUrl.trim() : null

    // A simple renderer for the normalized plain text paragraphs
    // In a real app, you might want to use a Lexical renderer or a Markdown renderer
    // if the content is stored as serialized Lexical JSON. 
    // For now, we'll render the paragraphs.

    return (
        <main className="w-full bg-background text-foreground min-h-screen">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
                <Link
                    href="/news"
                    className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to News
                </Link>

                <article className="space-y-8">
                    <header className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-wider text-foreground/50">
                                <span>{author}</span>
                                <span>•</span>
                                <span>{publishedDate}</span>
                                <span>•</span>
                                <span>{readTime}</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                {article.title}
                            </h1>
                        </div>

                        {coverImage && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                                <Image
                                    src={coverImage}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 900px"
                                    priority
                                />
                            </div>
                        )}
                    </header>

                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {/* Render paragraphs as simple text blocks for now content is Lexical JSON */}
                        {normalized.paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-foreground/80 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}

                        {/* 
                   If normalized.paragraphs is empty but there is serialized content, 
                   it might mean normalization failed or it's complex content.
                   For redundancy, if paragraphs are empty, we show the excerpt or raw content 
                 */}
                        {normalized.paragraphs.length === 0 && (
                            <p className="text-foreground/80 leading-relaxed">
                                {article.excerpt || article.content}
                            </p>
                        )}
                    </div>
                </article>
            </div>
        </main>
    )
}
