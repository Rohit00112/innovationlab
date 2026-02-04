import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Sparkles,
} from "lucide-react";

import { resolveApiBaseUrl } from "@/lib/http/resolve-api-base-url";
import type { NewsRecord } from "@/lib/types/news";
import { estimateReadingTime, normalizeLexicalState } from "@/lib/editor/lexical-utils";
import { Button } from "@/components/ui/button";

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
    return "Coming soon";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
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
  } catch {
    return (
      <main className="w-full bg-background text-foreground">
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 cursor-default pointer-events-none"></div>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">News Unavailable</h1>
            <p className="text-lg text-foreground/70">
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
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 cursor-default pointer-events-none"></div>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Lab Journal
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Fresh Stories Brewing</h1>
            <p className="text-lg text-foreground/70 max-w-xl mx-auto">
              We&apos;re currently working on some exciting updates. Check back soon for the latest news from Innovation Lab.
            </p>
            <Button variant="outline" className="mt-8 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
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
      <section className="relative min-h-[80vh] flex items-center border-b border-border/50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 text-xs font-semibold tracking-wide uppercase text-foreground/80">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                Lab Journal
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  NEWS &
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">INSIGHTS</span>
                </h1>
                <p className="text-xl leading-relaxed text-foreground/80 max-w-xl">
                  Explore field notes from the lab, dispatches from our residencies, and behind-the-scenes experiments.
                </p>
              </div>
            </div>

            {/* Featured Article Card */}
            <article className="group relative bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/50 hover:translate-y-[-4px]">
              {featuredArticle.coverImage && (
                <div className="relative h-80 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-80"></div>
                  <Image
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold uppercase tracking-wider shadow-sm">
                      Featured Story
                    </span>
                  </div>
                </div>
              )}
              <div className="relative p-8 -mt-20 z-20">
                <div className="bg-card/95 backdrop-blur-xl p-6 rounded-2xl border border-border/20 shadow-lg">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{featuredArticle.publishedDate}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">{featuredArticle.title}</h2>
                  <p className="text-sm leading-relaxed text-foreground/70 mb-6 line-clamp-3">{featuredArticle.excerpt}</p>
                  <Button className="w-full sm:w-auto rounded-full font-bold shadow-md shadow-primary/20 hover:scale-105 transition-all" asChild>
                    <Link href={`/news/${featuredArticle.slug}`}>
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                Browse Archive
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Latest Stories
              </h2>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-border/50 ml-12 mb-4"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherArticles.length === 0 ? (
              <div className="col-span-full border border-dashed border-border p-12 text-center rounded-3xl bg-card/50">
                <p className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                  More stories are on the way. Check back soon.
                </p>
              </div>
            ) : (
              otherArticles.map((article) => (
                <article
                  key={article.slug}
                  className="group flex flex-col bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:translate-y-[-4px]"
                >
                  {article.coverImage && (
                    <div className="relative h-56 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-block px-2 py-1 rounded bg-background/90 backdrop-blur text-xs font-bold text-foreground shadow-sm">
                          News
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 p-8 flex flex-col space-y-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      <span>{article.publishedDate}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>

                    <div className="pt-4 mt-auto border-t border-border/50">
                      <Button variant="ghost" className="p-0 h-auto text-sm font-bold hover:bg-transparent hover:text-primary justify-start" asChild>
                        <Link href={`/news/${article.slug}`}>
                          Read Article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
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
