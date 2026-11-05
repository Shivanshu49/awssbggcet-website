ALTER TYPE "public"."registration_status" ADD VALUE 'payment_submitted' BEFORE 'approved';--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "utr" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "payer_name" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "utr_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "seat_held_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "deadline_reminded_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_event_id_utr_key" ON "registrations" USING btree ("event_id","utr") WHERE "registrations"."utr" IS NOT NULL;--> statement-breakpoint
-- Every row holding an unpaid seat needs a deadline, or it would escape the 48-hour clock.
UPDATE "registrations" SET "seat_held_at" = now() WHERE "status" = 'pending';
