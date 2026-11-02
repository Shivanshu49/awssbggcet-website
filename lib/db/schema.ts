import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Mirrors docs/backend-plan.md section 3. stats_summary (materialized view)
// is added as raw SQL in a later migration.
//
// Every table has RLS enabled with no policies: Supabase's Data API (anon /
// authenticated roles) sees nothing, while the app connects as `postgres`,
// which bypasses RLS. Columns with a default are NOT NULL so an explicit null
// can't sneak past `WHERE published = true`.

export const profileRole = pgEnum("profile_role", [
  "member",
  "core",
  "lead",
  "admin",
]);
export const eventMode = pgEnum("event_mode", ["online", "offline", "hybrid"]);
export const teamGroupType = pgEnum("team_group_type", [
  "lead",
  "core",
  "volunteer",
  "mentor",
]);
export const submissionType = pgEnum("submission_type", [
  "contact",
  "problem",
  "membership",
]);
export const registrationStatus = pgEnum("registration_status", [
  "pending",
  "approved",
  "waitlisted",
  "rejected",
  "cancelled",
]);
export const mealPref = pgEnum("meal_pref", ["veg", "non_veg", "jain"]);
export const yearOfStudy = pgEnum("year_of_study", [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "other",
]);

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  role: profileRole("role").notNull().default("member"),
  branch: text("branch"),
  year: integer("year"),
  admissionNo: text("admission_no"),
  avatarKey: text("avatar_key"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  createdAt: createdAt(),
}).enableRLS();

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    description: text("description"),
    agenda:
      jsonb("agenda").$type<
        { time: string; title: string; speaker?: string }[]
      >(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    mode: eventMode("mode").notNull(),
    venue: text("venue"),
    coverKey: text("cover_key"),
    capacity: integer("capacity"),
    seatsTaken: integer("seats_taken").notNull().default(0), // = pending + approved, changed atomically
    registrationOpen: boolean("registration_open").notNull().default(true),
    published: boolean("published").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("events_starts_at_idx").on(t.startsAt.desc())],
).enableRLS();

export const registrations = pgTable(
  "registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    college: text("college").notNull(),
    branch: text("branch"),
    yearOfStudy: yearOfStudy("year_of_study").notNull(),
    admissionNo: text("admission_no"),
    certificateKey: text("certificate_key"),
    status: registrationStatus("status").notNull().default("pending"),
    passCode: text("pass_code").notNull().unique(), // randomBytes(16) base64url; opens /pass/<code>
    checkinCode: text("checkin_code").notNull().unique(), // randomBytes(16) base64url; inside the QR
    ticketNo: text("ticket_no").notNull().unique(), // 6 chars, A–Z/2–9 minus look-alikes; help desk
    mealPref: mealPref("meal_pref"),
    interests: text("interests").array().notNull().default([]),
    interestsNote: text("interests_note"),
    builderId: text("builder_id"), // Builder Center alias, lowercase; required before approval
    consentVersion: text("consent_version").notNull(),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    approvedBy: text("approved_by"),
    checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
    checkedInBy: text("checked_in_by"),
    linkSentAt: timestamp("link_sent_at", { withTimezone: true }), // rate limit for "find my pass"
    remindedAt: timestamp("reminded_at", { withTimezone: true }), // rate limit for the Builder ID reminder
    createdAt: createdAt(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Kills duplicate signups — the register action relies on this. Its index
    // also serves event_id lookups (leftmost column), so no separate index.
    unique("registrations_event_id_email_key").on(t.eventId, t.email),
    index("registrations_event_id_status_idx").on(t.eventId, t.status),
    // One Builder ID, one pass. Saving one relies on this to refuse duplicates.
    uniqueIndex("registrations_event_id_builder_id_key")
      .on(t.eventId, t.builderId)
      .where(sql`${t.builderId} IS NOT NULL`),
  ],
).enableRLS();

export const albums = pgTable("albums", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  coverPhotoId: uuid("cover_photo_id"),
  published: boolean("published").notNull().default(false),
  createdAt: createdAt(),
}).enableRLS();

export const galleryPhotos = pgTable(
  "gallery_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    albumId: uuid("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    s3Key: text("s3_key").notNull(),
    derivedPrefix: text("derived_prefix").notNull(),
    width: integer("width"),
    height: integer("height"),
    blurDataUrl: text("blur_data_url"),
    caption: text("caption"),
    sortOrder: integer("sort_order").notNull().default(0),
    processed: boolean("processed").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    index("gallery_photos_album_id_sort_order_idx").on(t.albumId, t.sortOrder),
  ],
).enableRLS();

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  groupType: teamGroupType("group_type").notNull(),
  photoKey: text("photo_key"),
  bio: text("bio"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
}).enableRLS();

export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  logoKey: text("logo_key").notNull(),
  websiteUrl: text("website_url"),
  tier: text("tier"),
  active: boolean("active").notNull().default(true),
}).enableRLS();

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: submissionType("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  payload: jsonb("payload").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: createdAt(),
}).enableRLS();

export const pageViews = pgTable(
  "page_views",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    path: text("path").notNull(),
    sessionHash: text("session_hash"), // hashed IP+UA, never the raw IP
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("page_views_viewed_at_idx").on(t.viewedAt.desc())],
).enableRLS();

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;
// "Row" suffix: `Event` would collide with lib/events.ts and the DOM global.
export type EventRow = InferSelectModel<typeof events>;
export type NewEventRow = InferInsertModel<typeof events>;
export type Registration = InferSelectModel<typeof registrations>;
export type NewRegistration = InferInsertModel<typeof registrations>;
export type Album = InferSelectModel<typeof albums>;
export type NewAlbum = InferInsertModel<typeof albums>;
export type GalleryPhoto = InferSelectModel<typeof galleryPhotos>;
export type NewGalleryPhoto = InferInsertModel<typeof galleryPhotos>;
export type TeamMember = InferSelectModel<typeof teamMembers>;
export type NewTeamMember = InferInsertModel<typeof teamMembers>;
export type Sponsor = InferSelectModel<typeof sponsors>;
export type NewSponsor = InferInsertModel<typeof sponsors>;
export type Submission = InferSelectModel<typeof submissions>;
export type NewSubmission = InferInsertModel<typeof submissions>;
export type PageView = InferSelectModel<typeof pageViews>;
export type NewPageView = InferInsertModel<typeof pageViews>;
