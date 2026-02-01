import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { faqs } from "@/lib/db/schema";

export type Faq = InferSelectModel<typeof faqs>;
export type NewFaq = InferInsertModel<typeof faqs>;
export type FaqCategory = "general" | "membership" | "events" | "support";

export interface FaqWithMetadata extends Faq {
    categoryLabel?: string;
}
