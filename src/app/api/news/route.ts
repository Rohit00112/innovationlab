import { NextResponse } from "next/server";
import { and, desc, eq, ilike } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { newsSelection, getNewsById } from "@/lib/api/resources/news";
import { db } from "@/lib/db";
import { news, newsStatusEnum, users } from "@/lib/db/schema";
import {
  createNewsSchema,
  resolvePublishedAt,
  type NewsStatus
} from "@/lib/api/validation/news";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const authorParam = url.searchParams.get("authorId");
    const searchParam = url.searchParams.get("search");
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");
    const slugParam = url.searchParams.get("slug");

    let statusFilter: NewsStatus | undefined;

    if (statusParam) {
      if (!newsStatusEnum.enumValues.includes(statusParam as NewsStatus)) {
        throw new ApiError(400, "Invalid status filter");
      }

      statusFilter = statusParam as NewsStatus;
    }

    let authorFilter: number | undefined;

    if (authorParam) {
      const parsed = Number.parseInt(authorParam, 10);

      if (Number.isNaN(parsed)) {
        throw new ApiError(400, "authorId must be a number");
      }

      authorFilter = parsed;
    }

    const limit = limitParam ? Math.min(100, Math.max(1, Number.parseInt(limitParam, 10))) : 20;
    const offset = offsetParam ? Math.max(0, Number.parseInt(offsetParam, 10) || 0) : 0;

    let slugFilter: string | undefined;

    if (slugParam && slugParam.trim()) {
      slugFilter = slugParam.trim().toLowerCase();
    }

    const filters: Array<ReturnType<typeof eq>> = [];

    if (statusFilter) {
      filters.push(eq(news.status, statusFilter));
    }

    if (authorFilter !== undefined) {
      filters.push(eq(news.authorId, authorFilter));
    }

    if (searchParam) {
      filters.push(ilike(news.title, `%${searchParam}%`));
    }

    if (slugFilter) {
      filters.push(eq(news.slug, slugFilter));
    }

    const baseQuery = db
      .select(newsSelection)
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id));

    const filteredQuery = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery;

    const items = await filteredQuery
      .orderBy(desc(news.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data: items });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireUser({ roles: ["admin", "editor", "author"] });
    const body = await request.json().catch(() => null);

    const parsed = createNewsSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const status: NewsStatus = payload.status ?? "draft";
    const slug = payload.slug.trim().toLowerCase();

    const existingSlug = await db
      .select({ id: news.id })
      .from(news)
      .where(eq(news.slug, slug))
      .limit(1);

    if (existingSlug.length > 0) {
      throw new ApiError(409, "Slug already exists");
    }

    const publishedAt = resolvePublishedAt({
      incoming: payload.publishedAt,
      status,
      mode: "create"
    });

    const [created] = await db
      .insert(news)
      .values({
        title: payload.title.trim(),
        slug,
        excerpt: payload.excerpt?.trim() ?? null,
        content: payload.content,
        coverImageUrl: payload.coverImageUrl?.trim() ?? null,
        status,
        publishedAt,
        authorId: session.user.id
      })
      .returning({ id: news.id });

    const record = await getNewsById(created.id);

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
