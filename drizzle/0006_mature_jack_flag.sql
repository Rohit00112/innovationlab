CREATE TYPE "public"."faq_category" AS ENUM('general', 'membership', 'events', 'support');--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" "faq_category" DEFAULT 'general' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "faqs_display_order_idx" ON "faqs" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "faqs_is_active_idx" ON "faqs" USING btree ("is_active");