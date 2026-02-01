import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { ApiError, toErrorResponse } from "@/lib/api/errors";
import { deleteFaq, getFaqById, updateFaq } from "@/lib/api/resources/faqs";
import { updateFaqSchema } from "@/lib/api/validation/faqs";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireUser({ roles: ["admin"] });
        // Correctly await params before accessing id
        const { id } = await params;
        const faqId = Number.parseInt(id);

        if (Number.isNaN(faqId)) {
            throw new ApiError(400, "Invalid ID");
        }

        const body = await request.json().catch(() => null);
        const parsed = updateFaqSchema.safeParse(body);

        if (!parsed.success) {
            throw new ApiError(400, "Validation failed", parsed.error.flatten());
        }

        const existing = await getFaqById(faqId);
        if (!existing) {
            throw new ApiError(404, "FAQ not found");
        }

        const updated = await updateFaq(faqId, parsed.data);

        return NextResponse.json({ data: updated });
    } catch (error) {
        return toErrorResponse(error);
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireUser({ roles: ["admin"] });
        // Correctly await params
        const { id } = await params;
        const faqId = Number.parseInt(id);

        if (Number.isNaN(faqId)) {
            throw new ApiError(400, "Invalid ID");
        }

        const existing = await getFaqById(faqId);
        if (!existing) {
            throw new ApiError(404, "FAQ not found");
        }

        await deleteFaq(faqId);

        return NextResponse.json({ data: { success: true } });
    } catch (error) {
        return toErrorResponse(error);
    }
}
