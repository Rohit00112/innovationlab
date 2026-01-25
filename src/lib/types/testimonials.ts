export const TESTIMONIAL_STATUSES = [
  "draft",
  "published",
  "archived"
] as const;

export type TestimonialStatus = (typeof TESTIMONIAL_STATUSES)[number];

export interface TestimonialRecord {
  id: number;
  headline: string | null;
  quote: string;
  author: string;
  role: string | null;
  company: string | null;
  avatarUrl: string | null;
  isFeatured: boolean;
  status: TestimonialStatus;
  publishedAt: string | null;
  submittedById: number | null;
  createdAt: string;
  updatedAt: string;
  submittedBy?: {
    id: number;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    role: string;
  } | null;
}

export interface CreateTestimonialPayload {
  headline?: string | null;
  body: string;
  authorName: string;
  authorTitle?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  isFeatured?: boolean;
  status?: TestimonialStatus;
  publishedAt?: string | null;
}

export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>;

export interface PaginatedTestimonialsResponse {
  data: TestimonialRecord[];
}
