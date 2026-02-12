ALTER TABLE "events" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;
CREATE INDEX "events_display_order_idx" ON "events" USING btree ("display_order");
