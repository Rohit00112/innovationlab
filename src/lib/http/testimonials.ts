import { apiRequest } from "@/lib/http/api-client";
import {
  type CreateTestimonialPayload,
  type PaginatedTestimonialsResponse,
  type TestimonialRecord,
  type TestimonialStatus,
  type UpdateTestimonialPayload
} from "@/lib/types/testimonials";

export interface TestimonialListFilters {
  status?: TestimonialStatus | "all";
  isFeatured?: boolean;
  submittedById?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(params: TestimonialListFilters) {
  const query = new URLSearchParams();

  if (params.status && params.status !== "all") {
    query.set("status", params.status);
  }

  if (typeof params.isFeatured === "boolean") {
    query.set("isFeatured", String(params.isFeatured));
  }

  if (typeof params.submittedById === "number") {
    query.set("submittedById", String(params.submittedById));
  }

  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }

  if (typeof params.limit === "number") {
    query.set("limit", String(params.limit));
  }

  if (typeof params.offset === "number") {
    query.set("offset", String(params.offset));
  }

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export async function listTestimonials(
  params: TestimonialListFilters = {}
): Promise<TestimonialRecord[]> {
  const response = await apiRequest<PaginatedTestimonialsResponse>(
    `/api/testimonials${buildQuery(params)}`
  );

  return response.data;
}

export async function createTestimonial(payload: CreateTestimonialPayload) {
  const response = await apiRequest<{ data: TestimonialRecord }>(`/api/testimonials`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export async function updateTestimonial(
  id: number,
  payload: UpdateTestimonialPayload
) {
  const response = await apiRequest<{ data: TestimonialRecord }>(`/api/testimonials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  return response.data;
}

export async function deleteTestimonial(id: number) {
  await apiRequest(`/api/testimonials/${id}`, { method: "DELETE" });
}
