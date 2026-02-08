-- Add min/max participant limits to events
ALTER TABLE "events" ADD COLUMN "min_participants" integer;
ALTER TABLE "events" ADD COLUMN "max_participants" integer;

-- Add LondonMet ID to event registrations
ALTER TABLE "event_registrations" ADD COLUMN "londonmet_id" text;
