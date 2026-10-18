# AWS Club Website — Backend & Media Plan (Phase 2)

Extends `plan.md`. Nothing here blocks v1 launch.

---

## 1. Stack — final call

| Concern | Choice | Reasoning |
|---|---|---|
| Database | **Supabase (Postgres)** | Free forever tier, no card required, no 12-month cliff. RDS free tier expires and then costs ~$15/mo — nobody in a student club will pay that, and the DB will get deleted. |
| API | **Next.js route handlers** (`app/api/*`) on Amplify | We already deploy Next. A separate NestJS service means a second deploy target, second set of env vars, second thing to break. Split it out only if the API outgrows this, which it won't. |
| Media storage | **S3 + CloudFront** | This is where we stay on-brand, and it's the right tool anyway. ~free at club scale. |
| Image processing | **Lambda + sharp**, triggered by S3 upload | Resizing on the API server blocks the request and Amplify has a payload limit. |
| Auth | **Auth.js (NextAuth) + Google provider**, restricted to the college domain | Admin count is ~6 people. Cognito is the on-brand answer if we want it as a demo, but it's 3x the setup for the same outcome. Roles live in a Postgres column. |
| Email | **AWS SES** | Registration confirmations, certificates. Sandbox mode first, then request production access early — approval takes days. |
| ORM | **Drizzle** | Typed, SQL-shaped, no codegen step in CI. |

**Hybrid Supabase + AWS is the honest answer here.** Supabase for the DB because it's free and won't disappear; AWS for media and email because that's the club's identity and those services are genuinely near-free.

---

## 2. Photo gallery — the actual architecture

**Never store images in Postgres.** No `bytea`, no base64 columns. The DB stores keys and metadata; S3 stores bytes; CloudFront serves them.

### Upload flow

```
Admin picks files in dashboard
  → POST /api/uploads/presign   (auth-checked, returns presigned PUT URLs)
  → Browser PUTs directly to S3   ← bytes never touch our API server
  → S3 ObjectCreated event → Lambda
      · sharp: generate thumb 400w, medium 1200w, full 2000w (WebP + AVIF)
      · extract width/height, generate blur placeholder (base64, ~30 bytes)
      · write derived files to derived/ prefix
      · INSERT row into gallery_photos
  → CloudFront serves everything, bucket stays private (OAC, no public ACLs)
```

Direct-to-S3 via presigned URLs is the part to get right. Routing uploads through the API server is the standard mistake — it breaks on a 40-photo event dump.

### Bucket layout

```
s3://gcet-aws-club-media/
  originals/events/{event_slug}/{uuid}.jpg      ← never served, archival
  derived/events/{event_slug}/{uuid}-400.webp
  derived/events/{event_slug}/{uuid}-1200.webp
  derived/events/{event_slug}/{uuid}-2000.webp
  team/{uuid}-400.webp
  sponsors/{uuid}.webp
```

Rules:
- **Key filenames are UUIDs, not original filenames.** `IMG_20260926_final(2).jpg` will break something eventually.
- Store the **key**, not the full URL. If the CDN domain changes, one env var changes instead of every row.
- Lifecycle rule: `originals/` → S3 Infrequent Access after 90 days. Nobody re-downloads originals.
- CloudFront cache policy: 1 year max-age on `derived/*`. Content is immutable because keys are UUIDs.

### Why three sizes
Gallery grid loads 400w, lightbox loads 1200w, download button gets 2000w. Serving one 4MB original into a grid of 30 photos is a 120MB page.

---

## 3. Schema

```sql
-- members / admins
create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null default 'member',  -- member | core | lead | admin
  branch text, year int, admission_no text,
  avatar_key text,
  github_url text, linkedin_url text,
  created_at timestamptz default now()
);

-- events
create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  agenda jsonb,                          -- [{time, title, speaker}]
  starts_at timestamptz not null,
  ends_at timestamptz,
  mode text not null,                    -- online | offline | hybrid
  venue text,
  cover_key text,
  capacity int,
  registration_open boolean default true,
  published boolean default false,
  created_at timestamptz default now()
);
create index on events (starts_at desc);

-- registrations
create table registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  branch text, year int, admission_no text,
  attended boolean default false,
  certificate_key text,
  created_at timestamptz default now(),
  unique (event_id, email)               -- kills duplicate signups
);
create index on registrations (event_id);

-- gallery
create table albums (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  slug text unique not null,
  cover_photo_id uuid,
  published boolean default false,
  created_at timestamptz default now()
);

create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  s3_key text not null,                  -- originals/ key
  derived_prefix text not null,          -- derived/events/slug/uuid
  width int, height int,
  blur_data_url text,                    -- next/image placeholder
  caption text,
  sort_order int default 0,
  processed boolean default false,       -- Lambda flips this
  created_at timestamptz default now()
);
create index on gallery_photos (album_id, sort_order);

-- content tables
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null, role text not null,
  group_type text not null,              -- lead | core | volunteer | mentor
  photo_key text, bio text,
  linkedin_url text, github_url text,
  sort_order int default 0,
  active boolean default true
);

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null, logo_key text not null,
  website_url text, tier text, active boolean default true
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null,                    -- contact | problem | membership
  name text not null, email text not null,
  payload jsonb not null,
  handled boolean default false,
  created_at timestamptz default now()
);

-- public stats (the live counter from the brainstorm list)
create table page_views (
  id bigserial primary key,
  path text not null,
  session_hash text,                     -- hashed IP+UA, not raw IP
  viewed_at timestamptz default now()
);
create index on page_views (viewed_at desc);

create materialized view stats_summary as
select
  (select count(*) from page_views) as total_views,
  (select count(distinct session_hash) from page_views) as unique_visitors,
  (select count(*) from events where published) as total_events,
  (select count(*) from registrations) as total_registrations;
-- refresh hourly via cron; never count live on page load
```

`page_views` grows unbounded — add a cron that rolls rows older than 90 days into a daily-totals table.

---

## 4. API routes

```
GET  /api/events                 published, paginated
GET  /api/events/[slug]
POST /api/events/[slug]/register rate-limited, honeypot + Turnstile
GET  /api/albums/[slug]          photos with derived URLs
POST /api/submissions            contact / problem / membership

-- admin, auth required
POST   /api/uploads/presign
POST   /api/admin/events
PATCH  /api/admin/events/[id]
POST   /api/admin/albums/[id]/photos
PATCH  /api/admin/registrations/[id]   mark attended
POST   /api/admin/certificates/[eventId]  bulk generate
```

Validate every body with **Zod**. Rate-limit the public POST routes — an open registration endpoint on a college site gets spammed within a week.

---

## 5. Certificates

Highest-actual-value feature for members, and it's straightforward:

1. Design an SVG template with placeholder text nodes.
2. Lambda: inject name + event + date → render to PDF (`@resvg/resvg-js` or Puppeteer).
3. Upload to `s3://.../certificates/{event_slug}/{registration_id}.pdf`.
4. Email via SES with a presigned download link (7-day expiry).
5. Store `certificate_key` on the registration row.

Trigger it in bulk from the admin dashboard once attendance is marked.

---

## 6. Migration off Google Forms

Because v1 keeps content in `/content/*.json`, this is a small change:

1. Point `lib/events.ts` at the API instead of the JSON import. Component code doesn't change.
2. Export existing Forms responses to CSV, import into `registrations`.
3. Run both for one event — Forms as fallback while the new endpoint proves itself.
4. Drop Forms once one event completes cleanly.

---

## 7. Cost

| Service | Club-scale usage | Cost |
|---|---|---|
| Supabase | 500MB DB, 2GB egress | ₹0 |
| S3 | ~5GB media | ~₹10/mo |
| CloudFront | 1TB transfer/mo free tier | ₹0 |
| Lambda | 1M requests free | ₹0 |
| SES | 3000 emails/mo free from Lambda | ₹0 |
| Amplify | 1000 build-min, 15GB served | ₹0 |

Realistically **₹0–50/month.** Stay off RDS and the whole thing runs free.

---

## 8. Build order

1. Supabase project + Drizzle schema + migrations
2. Auth.js with Google, domain-restricted, `role` check middleware
3. S3 bucket + CloudFront + OAC, private bucket verified
4. Presign endpoint + Lambda resize pipeline — **test this end to end before building any UI**
5. Read-only public routes; swap `lib/events.ts` over
6. Admin dashboard: events CRUD → gallery upload → team/sponsors
7. Registrations + SES confirmations
8. Certificates
9. Page-view tracking + public stats counter
10. Daily `pg_dump` to S3 on a cron

---

## 9. Things that will bite us

- **SES production access** — request it in week one, approval takes days. Sandbox only mails verified addresses.
- **CORS on the S3 bucket** — presigned PUT fails silently in the browser without the right CORS config. First thing to debug if uploads hang.
- **Lambda cold start with sharp** — bundle sharp as a Lambda layer with the correct binary for the runtime architecture. `npm install sharp` on a Mac and deploying to `arm64` Lambda is a classic failure.
- **Orphaned S3 objects** — deleting a photo row must delete the S3 objects too, or storage grows forever. Handle it in the delete handler, not "later".
- **Raw IPs in `page_views`** — hash them. Storing student IPs on a college site is a problem we don't want.
