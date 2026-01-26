import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";

import { LexicalRenderer } from "@/components/blocks/editor-x/viewer";
import { estimateReadingTime, normalizeLexicalState } from "@/lib/editor/lexical-utils";
import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import type { NewsRecord } from "@/lib/types/news";

export const revalidate = 60;

interface NewsApiResponse {
  data: NewsRecord[];
}

interface NewsArticlePageProps {
  params: { slug: string };
}

interface PublishedMeta {
  label: string;
  iso?: string;
}

function getAuthorLabel(record: NewsRecord) {
  if (record.author?.name && record.author.name.trim()) {
    return record.author.name.trim();
  }

  if (record.author?.email && record.author.email.trim()) {
    return record.author.email.trim();
  }

  return "Innovation Lab";
}

function resolvePublishedMeta(record: NewsRecord): PublishedMeta {
  const source = record.publishedAt ?? record.createdAt;
  const date = new Date(source);

  if (Number.isNaN(date.getTime())) {
    return { label: "Publication date coming soon" };
  }

  return {
    label: date.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    iso: date.toISOString(),
  };
}

async function fetchNewsBySlug(slug: string): Promise<NewsRecord | null> {
  const baseUrl = resolveApiBaseUrl();
  const url = new URL("/api/news", baseUrl);
  url.searchParams.set("slug", slug);
  url.searchParams.set("status", "published");
  url.searchParams.set("limit", "1");

  const response = await fetch(url.toString(), {
    next: { revalidate },
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to load news article: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as NewsApiResponse;
  return payload.data[0] ?? null;
}

export async function generateStaticParams() {
  try {
    const baseUrl = resolveApiBaseUrl();
    const url = new URL("/api/news", baseUrl);
    url.searchParams.set("status", "published");
    url.searchParams.set("limit", "50");

    const response = await fetch(url.toString(), {
      next: { revalidate },
      cache: "force-cache",
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as NewsApiResponse;
    return payload.data.map((article) => ({ slug: article.slug }));
  } catch (_error) {
    return [];
  }
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const article = await fetchNewsBySlug(params.slug.toLowerCase());

  if (!article) {
    return {
      title: "News entry not found — Innovation Lab",
      description: "The story you were looking for does not exist or is no longer available.",
    };
  }

  const normalized = normalizeLexicalState(article.content);
  const summary = article.excerpt?.trim() ?? normalized.paragraphs[0] ?? "Read the latest story from the Innovation Lab.";

  const coverImage = article.coverImageUrl?.trim() || undefined;

  return {
    title: `${article.title} — Innovation Lab`,
    description: summary,
    openGraph: {
      title: `${article.title} — Innovation Lab`,
      description: summary,
      images: coverImage ? [{ url: coverImage }] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const slug = params.slug.toLowerCase();
  const article = await fetchNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const author = getAuthorLabel(article);
  const publishedMeta = resolvePublishedMeta(article);
  const normalizedContent = normalizeLexicalState(article.content);
  const excerpt = article.excerpt?.trim() ?? normalizedContent.paragraphs[0] ?? "More details arriving soon.";
  const readingTime = estimateReadingTime(normalizedContent.plainText || excerpt);
  const coverImage = article.coverImageUrl?.trim() ? article.coverImageUrl.trim() : null;
  const chips = article.author?.role ? [article.author.role] : [];
  const publishedDateTime = publishedMeta.iso ?? undefined;

  return (
    <main className="w-full bg-background text-foreground">
      {/* Header Section */}
      <section className="relative py-20 border-b border-foreground/10">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <Link
              href="/news"
              className="inline-flex w-fit items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-wider text-foreground/70 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </Link>
            
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-foreground/50">
                <span>{author}</span>
                <span>•</span>
                <span>{publishedMeta.label}</span>
                <span>•</span>
                <span>{readingTime}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {article.title}
              </h1>
              
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {chips.map((chip) => (
                    <span 
                      key={chip} 
                      className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-wider text-foreground/60"
                    >
                      <Tag className="h-3 w-3" />
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image Section */}
      <section className="relative py-16 border-b border-foreground/10">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden border border-foreground/10">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-foreground/5">
                <p className="text-sm uppercase tracking-wider text-foreground/40">No cover image</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {excerpt && (
            <div className="space-y-4 text-lg leading-relaxed text-foreground/80 mb-12 pb-12 border-b border-foreground/10">
              <p className="font-medium">{excerpt}</p>
            </div>
          )}

          {normalizedContent.serialized ? (
            <div className="prose-custom">
              <LexicalRenderer
                state={normalizedContent.serialized}
                contentClassName="space-y-6 text-base leading-relaxed text-foreground/80 [&_strong]:font-semibold [&_strong]:text-foreground [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4"
              />
            </div>
          ) : normalizedContent.paragraphs.length > 0 ? (
            <div className="space-y-6 text-base leading-relaxed text-foreground/80">
              {normalizedContent.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wider text-foreground/50">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              <time dateTime={publishedDateTime}>{publishedMeta.label}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
