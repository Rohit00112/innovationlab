import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react"

import { normalizeLexicalState, estimateReadingTime } from "@/lib/editor/lexical-utils"
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url"
import type { NewsRecord } from "@/lib/types/news"
import { Button } from "@/components/ui/button"

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

    return (
        <main className="w-full bg-background text-foreground min-h-screen">
            {/* Header / Hero */}
            <header className="relative py-20 lg:py-28 border-b border-border/50 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -z-10"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                    <Button variant="ghost" className="rounded-full hover:bg-background/50 hover:text-primary mb-4" asChild>
                        <Link href="/news">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to News
                        </Link>
                    </Button>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3" />
                                <span>{author}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-3 h-3" />
                                <span>{publishedDate}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                <span>{readTime}</span>
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
                            {article.title}
                        </h1>
                    </div>
                </div>
            </header>

            <article className="relative">
                {/* Decorative background for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background -z-10"></div>

                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
                    {coverImage && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl border border-border/50 mb-16 group">
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10"></div>
                            <Image
                                src={coverImage}
                                alt={article.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 900px"
                                priority
                            />
                        </div>
                    )}

                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl">
                        {/* Render paragraphs as simple text blocks for now content is Lexical JSON */}
                        {normalized.paragraphs.map((paragraph, index) => (
                            <p key={index} className="leading-8 text-foreground/80">
                                {paragraph}
                            </p>
                        ))}

                        {/* 
                   If normalized.paragraphs is empty but there is serialized content, 
                   it might mean normalization failed or it's complex content.
                   For redundancy, if paragraphs are empty, we show the excerpt or raw content 
                 */}
                        {normalized.paragraphs.length === 0 && (
                            <p className="leading-8 text-foreground/80">
                                {article.excerpt || article.content}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-border/50 mt-16 pt-10 flex flex-col items-center text-center space-y-6">
                        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Share this story</p>
                        <p className="text-lg font-bold">Innovation Lab</p>
                        <Button variant="outline" className="rounded-full" asChild>
                            <Link href="/news">Read More Stories</Link>
                        </Button>
                    </div>
                </div>
            </article>
        </main>
    )
}
