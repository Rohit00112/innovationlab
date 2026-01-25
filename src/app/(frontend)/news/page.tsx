import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import type { NewsRecord } from "@/lib/types/news";
import { estimateReadingTime, normalizeLexicalState } from "@/lib/editor/lexical-utils";

export const revalidate = 60;

interface NewsApiResponse {
  data: NewsRecord[];
}

interface NewsPresentation {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedDate: string;
  author: string;
  readTime: string;
  chips: string[];
}

async function fetchPublishedNews(): Promise<NewsRecord[]> {
  const baseUrl = resolveApiBaseUrl();
  const url = new URL("/api/news", baseUrl);
  url.searchParams.set("status", "published");
  url.searchParams.set("limit", "12");

  const response = await fetch(url.toString(), {
    next: { revalidate },
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error(`Failed to load news: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as NewsApiResponse;
  return payload.data;
}

function formatPublishedDate(record: NewsRecord) {
  const source = record.publishedAt ?? record.createdAt;
  const date = new Date(source);

  if (Number.isNaN(date.getTime())) {
    return "Publication date coming soon";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
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

function toPresentation(record: NewsRecord): NewsPresentation {
  const normalized = normalizeLexicalState(record.content);
  const excerpt = record.excerpt?.trim() ?? normalized.paragraphs[0] ?? "More details arriving soon.";
  const plainText = normalized.plainText || excerpt;

  return {
    slug: record.slug,
    title: record.title,
    excerpt,
    coverImage: record.coverImageUrl?.trim() ? record.coverImageUrl.trim() : null,
    publishedDate: formatPublishedDate(record),
    author: getAuthorLabel(record),
    readTime: estimateReadingTime(plainText),
    chips: record.author?.role ? [record.author.role] : [],
  };
}

function sortNews(records: NewsRecord[]) {
  return [...records].sort((a, b) => {
    const aTime = Date.parse(a.publishedAt ?? a.createdAt);
    const bTime = Date.parse(b.publishedAt ?? b.createdAt);
    const safeATime = Number.isNaN(aTime) ? 0 : aTime;
    const safeBTime = Number.isNaN(bTime) ? 0 : bTime;

    return safeBTime - safeATime;
  });
}

export default async function NewsPage() {
  let records: NewsRecord[] = [];

  try {
    records = await fetchPublishedNews();
  } catch (_error) {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight">News</h1>
            <p className="mt-4 text-base text-foreground/70">
              We couldn&apos;t load the latest stories at the moment. Please refresh and try again shortly.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (records.length === 0) {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-semibold tracking-tight">News</h1>
            <p className="mt-4 text-base text-foreground/70">
              Fresh stories are brewing. Check back soon for updates from the Innovation Lab.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const [featured, ...rest] = sortNews(records);
  const featuredArticle = toPresentation(featured);
  const otherArticles = rest.map(toPresentation);

  return (
    <main className="w-full bg-background text-foreground">
      {/* Hero Section with Featured Article */}
      <section className="relative min-h-[80vh] flex items-center border-b border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 w-full">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs uppercase tracking-widest text-foreground/70">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Lab Journal
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  NEWS &
                  <br />
                  <span className="text-foreground/60">INSIGHTS</span>
                </h1>
                <p className="text-xl leading-relaxed text-foreground/70 max-w-xl">
                  Explore field notes from the lab, dispatches from our residencies, and behind-the-scenes experiments.
                </p>
              </div>
            </div>

            {/* Featured Article Card */}
            <article className="group border border-foreground/10 hover:border-foreground/30 transition-colors">
              {featuredArticle.coverImage && (
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              <div className="space-y-6 p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-foreground/50">
                  <span>{featuredArticle.author}</span>
                  <span>•</span>
                  <span>{featuredArticle.publishedDate}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="text-2xl font-semibold text-foreground/90 leading-tight">{featuredArticle.title}</h2>
                <p className="text-base leading-relaxed text-foreground/75">{featuredArticle.excerpt}</p>
                <Link
                  href={`/news/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  Read Article
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-4 mb-16">
            <p className="text-xs uppercase tracking-widest text-foreground/50">Browse Archive</p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Latest Stories
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.length === 0 ? (
              <div className="col-span-full border border-foreground/10 p-12 text-center">
                <p className="text-sm uppercase tracking-wider text-foreground/60">
                  More stories are on the way. Check back soon.
                </p>
              </div>
            ) : (
              otherArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group border border-foreground/10 hover:border-foreground/30 transition-colors"
                >
                  {article.coverImage && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wider text-foreground/50">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.publishedDate}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground/90 leading-tight group-hover:text-foreground/70 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground/70 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:text-foreground transition-colors"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
