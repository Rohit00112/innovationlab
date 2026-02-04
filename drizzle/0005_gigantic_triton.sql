ALTER TABLE "team_members" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "category" SET DEFAULT 'core'::text;--> statement-breakpoint
DROP TYPE "public"."team_member_category";--> statement-breakpoint
CREATE TYPE "public"."team_member_category" AS ENUM('head', 'core', 'mentor');--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "category" SET DEFAULT 'core'::"public"."team_member_category";--> statement-breakpoint
ALTER TABLE "team_members" ALTER COLUMN "category" SET DATA TYPE "public"."team_member_category" USING "category"::"public"."team_member_category";