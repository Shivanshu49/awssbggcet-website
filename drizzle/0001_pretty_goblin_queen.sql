CREATE TYPE "public"."meal_pref" AS ENUM('veg', 'non_veg', 'jain');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('pending', 'approved', 'waitlisted', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."year_of_study" AS ENUM('1st', '2nd', '3rd', '4th', 'other');--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "seats_taken" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "college" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "year_of_study" "year_of_study" NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "status" "registration_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "pass_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "checkin_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "ticket_no" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "meal_pref" "meal_pref";--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "interests" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "interests_note" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "builder_id" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "consent_version" text NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "consented_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "approved_by" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "checked_in_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "checked_in_by" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "link_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "reminded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "registrations_event_id_status_idx" ON "registrations" USING btree ("event_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "registrations_event_id_builder_id_key" ON "registrations" USING btree ("event_id","builder_id") WHERE "registrations"."builder_id" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" DROP COLUMN "year";--> statement-breakpoint
ALTER TABLE "registrations" DROP COLUMN "attended";--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_pass_code_unique" UNIQUE("pass_code");--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_checkin_code_unique" UNIQUE("checkin_code");--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_ticket_no_unique" UNIQUE("ticket_no");