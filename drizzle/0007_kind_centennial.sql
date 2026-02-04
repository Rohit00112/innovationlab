CREATE TYPE "public"."feedback_category" AS ENUM('suggestion', 'issue', 'other');--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"email" text,
	"category" "feedback_category" DEFAULT 'suggestion' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_key" text NOT NULL,
	"section_key" text NOT NULL,
	"content" json NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by_id" integer
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "proposal_submission_title" text;--> statement-breakpoint
ALTER TABLE "site_content" ADD CONSTRAINT "site_content_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedbacks_category_idx" ON "feedbacks" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "site_content_page_section_unique" ON "site_content" USING btree ("page_key","section_key");--> statement-breakpoint
CREATE INDEX "site_content_page_key_idx" ON "site_content" USING btree ("page_key");