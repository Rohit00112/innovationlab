CREATE TYPE "public"."allowed_registration_types" AS ENUM('individual', 'team', 'both');--> statement-breakpoint
CREATE TYPE "public"."community_member_role" AS ENUM('lead', 'member', 'advisor');--> statement-breakpoint
CREATE TYPE "public"."community_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."registration_type" AS ENUM('individual', 'team');--> statement-breakpoint
CREATE TABLE "communities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"content" text,
	"cover_image_url" text,
	"status" "community_status" DEFAULT 'draft' NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"name" text NOT NULL,
	"title" text,
	"email" text,
	"bio" text,
	"avatar_url" text,
	"role" "community_member_role" DEFAULT 'member' NOT NULL,
	"linkedin_url" text,
	"github_url" text,
	"website_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"registration_type" "registration_type" DEFAULT 'individual' NOT NULL,
	"team_name" text,
	"participant_name" text NOT NULL,
	"participant_email" text NOT NULL,
	"participant_phone" text,
	"notes" text,
	"team_members" text,
	"proposal_link" text,
	"status" "registration_status" DEFAULT 'confirmed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "has_registration" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "allowed_registration_types" "allowed_registration_types" DEFAULT 'both' NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "enable_proposal_submission" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "parent_event_id" integer;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "documents" json;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "communities_slug_unique" ON "communities" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "communities_status_idx" ON "communities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "communities_display_order_idx" ON "communities" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "community_members_community_idx" ON "community_members" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "community_members_role_idx" ON "community_members" USING btree ("role");--> statement-breakpoint
CREATE INDEX "community_members_display_order_idx" ON "community_members" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "community_members_is_active_idx" ON "community_members" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "event_registrations_user_event_unique" ON "event_registrations" USING btree ("user_id","event_id");--> statement-breakpoint
CREATE INDEX "event_registrations_user_idx" ON "event_registrations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_registrations_event_idx" ON "event_registrations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_registrations_status_idx" ON "event_registrations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "event_registrations_type_idx" ON "event_registrations" USING btree ("registration_type");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_unique" ON "password_reset_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "password_reset_tokens_user_idx" ON "password_reset_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "events_parent_event_idx" ON "events" USING btree ("parent_event_id");