import { NextResponse } from "next/server";
import { and, desc, eq, ilike } from "drizzle-orm";

import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { testimonialSelection, getTestimonialById } from "@/lib/api/resources/testimonials";
import {
  createTestimonialSchema,
  resolveTestimonialPublishedAt,
  type TestimonialStatus
} from "@/lib/api/validation/testimonials";
import { db } from "@/lib/db";
import { testimonialStatusEnum, testimonials, users } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const featuredParam = url.searchParams.get("isFeatured");
    const submitterParam = url.searchParams.get("submittedById");
    const searchParam = url.searchParams.get("search");
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    let statusFilter: TestimonialStatus = "published";

    if (statusParam) {
      if (!testimonialStatusEnum.enumValues.includes(statusParam as TestimonialStatus)) {
        throw new ApiError(400, "Invalid status filter");
      }

      statusFilter = statusParam as TestimonialStatus;
    }

    let featuredFilter: boolean | undefined;

    if (featuredParam) {
      if (featuredParam !== "true" && featuredParam !== "false") {
        throw new ApiError(400, "isFeatured must be 'true' or 'false'");
      }

      featuredFilter = featuredParam === "true";
    }

    let submitterFilter: number | undefined;

    if (submitterParam) {
      const parsed = Number.parseInt(submitterParam, 10);

      if (Number.isNaN(parsed)) {
        throw new ApiError(400, "submittedById must be a number");
      }

      submitterFilter = parsed;
    }

    const limit = limitParam ? Math.min(100, Math.max(1, Number.parseInt(limitParam, 10))) : 20;
    const offset = offsetParam ? Math.max(0, Number.parseInt(offsetParam, 10) || 0) : 0;

    const filters: Array<ReturnType<typeof eq>> = [eq(testimonials.status, statusFilter)];

    if (featuredFilter !== undefined) {
      filters.push(eq(testimonials.isFeatured, featuredFilter));
    }

    if (submitterFilter !== undefined) {
      filters.push(eq(testimonials.submittedById, submitterFilter));
    }

    if (searchParam) {
      filters.push(ilike(testimonials.body, `%${searchParam}%`));
    }

    const baseQuery = db
      .select(testimonialSelection)
      .from(testimonials)
      .leftJoin(users, eq(testimonials.submittedById, users.id));

    const query = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery;

    const items = await query
      .orderBy(desc(testimonials.createdAt))
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

    const parsed = createTestimonialSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(400, "Validation failed", parsed.error.flatten());
    }

    const payload = parsed.data;
    const status: TestimonialStatus = payload.status ?? "draft";

    const publishedAt = resolveTestimonialPublishedAt({
      incoming: payload.publishedAt,
      status,
      mode: "create"
    });

    const [created] = await db
      .insert(testimonials)
      .values({
        headline: payload.headline?.trim() ?? null,
        body: payload.body,
        authorName: payload.authorName.trim(),
        authorTitle: payload.authorTitle?.trim() ?? null,
        company: payload.company?.trim() ?? null,
        avatarUrl: payload.avatarUrl?.trim() ?? null,
        isFeatured: payload.isFeatured ?? false,
        status,
        publishedAt,
        submittedById: session.user.id
      })
      .returning({ id: testimonials.id });

    const record = await getTestimonialById(created.id);

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
