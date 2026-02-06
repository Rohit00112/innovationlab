CREATE TABLE "milestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "feedbacks" CASCADE;--> statement-breakpoint
DROP TABLE "news" CASCADE;--> statement-breakpoint
DROP TABLE "site_content" CASCADE;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "submissions" json;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "submission_fields" json;--> statement-breakpoint
CREATE INDEX "milestones_display_order_idx" ON "milestones" USING btree ("display_order");--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "proposal_submission_title";--> statement-breakpoint
DROP TYPE "public"."feedback_category";--> statement-breakpoint
DROP TYPE "public"."news_status";