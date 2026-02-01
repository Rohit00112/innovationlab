import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { createFaq, getFaqs, getFaqsByCategory } from "@/lib/api/resources/faqs";
import { createFaqSchema } from "@/lib/api/validation/faqs";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get("category");
        const includeInactive = url.searchParams.get("includeInactive") === "true";

        // Admin check for viewing inactive FAQs
        if (includeInactive) {
            try {
                await requireUser({ roles: ["admin"] });
            } catch {
                throw new ApiError(403, "Forbidden: Admin access required for inactive FAQs");
            }
        }

        let items;
        if (category) {
            // If category is provided, fetch just that category (publicly active ones usually)
            // Note: getFaqsByCategory currently doesn't support inactive filter, let's stick to active for public
            // Modify getFaqs to handle filtering if needed more robustly later.
            // For now, if category is specific, we use the specific helper.
            // But wait, the helper `getFaqsByCategory` doesn't filter by active.
            // Let's use getFaqs and filter in JS or update query if needed.
            // Actually, for simplicity and since the list is small, fetching all active and filtering in JS
            // or reusing `getFaqs` with params is better.
            // Let's rely on basic getFaqs and maybe filter.

            // Re-evaluating: getFaqsByCategory is created but might need refinement.
            // Let's just use getFaqs and if category is there filter it.
            // Or use the helper if it fits.
            // Let's check getFaqsByCategory implementation again.
            items = await getFaqsByCategory(category);
            if (!includeInactive) {
                items = items.filter(f => f.isActive);
            }
        } else {
            items = await getFaqs(!includeInactive);
        }

        return NextResponse.json({ data: items });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        await requireUser({ roles: ["admin"] });
        const body = await request.json().catch(() => null);

        const parsed = createFaqSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const newFaq = await createFaq(parsed.data);

        return NextResponse.json({ data: newFaq }, { status: 201 });
    } catch (error) {
        return toErrorResponse(error);
    }
}
