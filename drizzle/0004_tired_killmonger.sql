CREATE TYPE "public"."team_member_category" AS ENUM('lead', 'core', 'advisor', 'alumni');--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"position" text NOT NULL,
	"bio" text,
	"photo_url" text,
	"email" text,
	"linkedin_url" text,
	"github_url" text,
	"website_url" text,
	"category" "team_member_category" DEFAULT 'core' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "team_members_category_idx" ON "team_members" USING btree ("category");--> statement-breakpoint
CREATE INDEX "team_members_display_order_idx" ON "team_members" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "team_members_is_active_idx" ON "team_members" USING btree ("is_active");