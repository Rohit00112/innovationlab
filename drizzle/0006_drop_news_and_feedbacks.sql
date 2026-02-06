DROP TABLE "feedbacks" CASCADE;--> statement-breakpoint
DROP TABLE "news" CASCADE;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "submissions" json;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "submission_fields" json;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "proposal_submission_title";--> statement-breakpoint
DROP TYPE "public"."feedback_category";--> statement-breakpoint
DROP TYPE "public"."news_status";