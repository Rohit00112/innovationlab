import { CreateFaqInput, UpdateFaqInput } from "@/lib/api/validation/faqs";
import { Faq } from "@/lib/types/faqs";

export const fetchFaqs = async (category?: string, includeInactive = false): Promise<Faq[]> => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (includeInactive) params.append("includeInactive", "true");

    const response = await fetch(`/api/faqs?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch FAQs");
    const json = await response.json();
    return json.data;
};

export const createFaq = async (data: CreateFaqInput): Promise<Faq> => {
    const response = await fetch("/api/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create FAQ");
    }

    const json = await response.json();
    return json.data;
};

export const updateFaq = async (id: number, data: UpdateFaqInput): Promise<Faq> => {
    const response = await fetch(`/api/faqs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update FAQ");
    }

    const json = await response.json();
    return json.data;
};

export const deleteFaq = async (id: number): Promise<void> => {
    const response = await fetch(`/api/faqs/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete FAQ");
    }
};
