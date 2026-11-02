# Event Registration & Pass — AWS Student Community Day 2026

Spec for on-site registration with an approval step and a pass page.
Event: **21 Nov 2026, 10:00 AM – 4:00 PM IST, GCET Greater Noida** · Site: **awssbggcet.com**
Reference for the pass page: futurebuildersconnect.com ("My Pass").
Supersedes the auth row in `docs/backend-plan.md` §1.

---

## 1. Flow

```
/community-day ──Register Now──▶ /community-day/register      seat counter on top
    Step 1  Your details        (name, college, branch, year, meal*, AWS Builder ID — optional here)
    Step 2  Contact & confirm   (email, phone) + consent + Turnstile → Submit
            │  saved as PENDING (or WAITLISTED if no seats are left)
            ▼
/pass/<pass_code>           the attendee's own pass page — bookmarkable
    + email: "Registration received" with the pass link
    no Builder ID yet → "Add your AWS Builder ID" is the first block on the page

Organisers: /admin ──Approve (only with a Builder ID)──▶ status PASS ISSUED
            → QR appears on the same pass page
            + email: "Your pass is issued" with the QR

Venue: volunteer phone scans QR ──▶ /admin/checkin?c=<checkin_code>
            ✅ name + college   ⚠ already checked in at 10:42   ❌ not approved / unknown
```
\* only if the event config turns them on.

- **Lost the link?** `/pass` → enter email → link is emailed again. The response is the same whether or not the email is registered.
- **Registers twice with the same email?** No duplicate is created and the pass link is **never** shown on screen — it's emailed instead. Otherwise anyone could type a classmate's email and open their pass.

## 2. Decisions

| Decision | Why |
|---|---|
| **No attendee login.** The pass link (128-bit random code) is the key, like an airline "manage booking" link. | No SMS (TRAI DLT takes weeks), no OTP email on every visit, no auth system for hundreds of students. Fits the deadline. |
| **Admin approval** before a pass is issued. | Matches the reference (pending → issued), and it's the gate against junk sign-ups, since emails aren't verified at registration. |
| **AWS Builder ID is required for the pass, not for the form.** Register without one, add it on the pass page; approval is blocked until it's there. | AWS requires it. Making it required in the form would send students off mid-form to create one and lose what they typed. The reference works the same way: register → create Builder ID → add it → pass issued. |
| **Builder ID = the AWS Builder Center alias** (like the reference's `shivanshu49`), not an email. | It's what AWS's own reference site collects. If AWS wants the email instead, it's a label + validation change. |
| **Two codes per person:** `pass_code` opens the pass page; `checkin_code` is what the QR carries. | A QR seen over a shoulder or posted on Instagram can't be used to open or edit someone's pass. |
| **A registration holds a seat while pending or approved.** At capacity, new sign-ups join the waitlist automatically. | The public counter ("X seats available") stays honest and drops as people register, like the reference. Approval is still the gate for the QR. Rejecting, cancelling or waitlisting someone frees their seat. |
| **Email: Resend over SMTP (nodemailer)**, domain `awssbggcet.com`. | Domain verification takes minutes, no production-access wait. SMTP keeps it switchable to SES later with env vars only. |
| **Admins sign in with Supabase Auth email OTP**, allowlisted by `ADMIN_EMAILS`. | Only organisers need accounts. Not hand-rolled. |
| **Not collected:** DOB, gender, ID-card upload, city. | Only what the event needs. The desk checks the physical college ID. Add gender back only if AWS's SCD reporting needs it. |
| **Don't copy the reference's AWS logo or "© Amazon Web Services" footer.** | AWS asked us to remove their logo. That page is AWS's own site; ours isn't. |

## 3. Pass page — `/pass/[code]`

Layout follows the reference; colours and type follow our site.

| Block | Pending | Pass issued | Waitlisted / Not approved |
|---|---|---|---|
| Header card: initials, name, college, event date, ticket no, status badge | `PENDING APPROVAL` | `PASS ISSUED` | `WAITLISTED` / `NOT APPROVED` |
| AWS Builder ID | **missing → first block on the page:** "Add your AWS Builder ID — your pass can't be issued without it", input + Save + "Create one" link (`builderIdSignupUrl`). Present → shown, editable. | read-only | editable / hidden |
| QR pass | locked placeholder: "Add your Builder ID" (if missing) or "Your QR appears here once approved" | QR + ticket no + **Download QR** | hidden; status message + contact email |
| Workshop interests: toggle, checkbox grid, "None of the above", free text, Save | editable until the event | editable until the event | editable |
| Event schedule (side column) | ✓ | ✓ | ✓ |
| FAQ | ✓ | ✓ | ✓ |
| Your journey: steps tagged BEFORE THE DAY / AT THE VENUE; done / current / upcoming worked out from status + whether a Builder ID is saved | ✓ | ✓ | ✓ |
| Note: "Bookmark this page — it's your pass. Lost it? Find my pass." | ✓ | ✓ | ✓ |

Rules:
- `dynamic = 'force-dynamic'`; metadata `robots: noindex` and `referrer: 'no-referrer'` (so the code never leaks through the Referer header to outside links).
- Email and phone shown **masked** (`sh****@gmail.com`, `98•••••210`) — the link may get forwarded.
- Unknown code → the normal 404. Never say whether a code exists.
- `GET /pass/[code]/qr.png` returns the QR PNG **only** when the pass is issued.

## 3a. Registration form — `/community-day/register`

Layout and behaviour follow the reference form; colours and type follow our site.

- **Seat counter** at the top: "**X seats available** out of Y" with a progress bar, from the seats API. At capacity: "**Waitlist open** — register to join the waitlist." Hidden when capacity is 0 (unset).
- **Stepper:** 1 Your details → 2 Contact & confirm. Values persist when moving between steps (React state only — no browser storage for personal data).
- **Validation:** one Zod schema shared by client and server.
  - Errors appear under each field after the first Next / Submit attempt, then update live as the field is fixed. Focus moves to the first invalid field. Step 2 can't be reached until step 1 is valid.
  - Server errors map back onto the same fields.
  - Each input gets a proper `<label>`, `aria-invalid` and `aria-describedby` pointing at its error.
- **Fields and rules:**

| Field | Rule | Error text |
|---|---|---|
| Full name | letters, spaces, `.` `'` `-`; starts with a letter; 2–120 chars; trimmed | "Please enter your full name" |
| College | `allowOtherColleges: true` → combobox over `colleges` + "Other" → free text. `false` → fixed to the first entry, shown read-only. | "Enter your college or university name" |
| Branch | select from `branches` in the event config, or text | "Choose your branch" |
| Year of study | 1st / 2nd / 3rd / 4th / Other | "Choose your year of study" |
| Meal (if enabled) | Veg / Non-veg / Jain radio | "Choose a meal preference" |
| AWS Builder ID | optional here. Builder Center alias: 3–50 chars, letters, digits, `.` `_` `-`; saved lowercase. Hint under the field: "Don't have one yet? Add it later on your pass page — your pass can't be issued without it." Same rule on the pass page. | "Enter a valid AWS Builder ID" |
| Email | valid format; trimmed and lowercased before saving | "Enter a valid email address" |
| Phone | Indian mobile: 10 digits starting 6–9, `+91` shown as a fixed prefix | "Enter a valid 10-digit mobile number" |
| Consent | required checkbox; policy links open in a new tab | "Please accept to continue" |

- **Submit:** disabled with a spinner while sending, so a double tap can't send twice. Turnstile sits just above it on step 2.
- **Not copied from the reference:** gender, date of birth, city, ID-card upload, and the OTP step (§2).

## 4. Routes

| Route | Rendering | Notes |
|---|---|---|
| `/community-day` | static | event page; all Register buttons → `/community-day/register` |
| `/community-day/register` | static shell + server action | form; closed-state message when `registration.open` is false |
| `/pass/[code]` | dynamic | §3 |
| `/pass/[code]/qr.png` | dynamic | issued passes only |
| `/pass` | static + server action | "Find my pass" (email + Turnstile) |
| `/admin/login` | dynamic | Supabase email OTP |
| `/admin/scd` | dynamic, admin | counts, table, bulk actions, CSV |
| `/admin/checkin` | dynamic, admin | scanner + manual search |
| `/privacy`, `/event-policies` | static | text from `content/legal/`; must be live before registration opens |
| `GET /api/events/[slug]/seats` | dynamic, `Cache-Control: s-maxage=30` | `{ capacity, taken, open }` for the counter; fetched client-side so the pages stay static |

- **No page queries the database at build time** — CI builds without `DATABASE_URL`.
- Admin auth is checked inside every admin page and server action (`requireAdmin()`), not only in middleware.
- With no Turnstile env vars (dev, CI), use Cloudflare's documented always-pass test keys.

## 5. Event content — `content/event-pages/aws-student-community-day-2026.json`

```json
{
  "registration": {
    "open": false,
    "capacity": 0,
    "collectMeal": true,
    "builderIdRequired": true,
    "builderIdSignupUrl": "",
    "consentVersion": "2026-11-v1"
  },
  "allowOtherColleges": true,
  "colleges": ["Galgotias College of Engineering and Technology"],
  "branches": ["CSE", "IT", "CSE (AI & ML)", "CSE (Data Science)", "ECE", "ME", "Other"],
  "workshops": ["…"],
  "schedule": [{ "time": "09:00", "title": "Check-in" }],
  "faqs": [{ "q": "…", "a": "…" }],
  "journey": [
    { "phase": "before", "step": "registered",   "title": "Register on this site", "body": "…" },
    { "phase": "before", "step": "builder_id",   "title": "Create your AWS Builder ID", "body": "…" },
    { "phase": "before", "step": "builder_id",   "title": "Add it to your pass", "body": "…" },
    { "phase": "before", "step": "approved",     "title": "Pass issued — QR here and in your email", "body": "…" },
    { "phase": "venue",  "step": "checked_in",   "title": "Check in with your QR and college ID", "body": "…" },
    { "phase": "venue",  "step": null,           "title": "Workshops and sessions", "body": "…" }
  ]
}
```

`step` ties a journey item to progress: `registered` is done once the row exists, `builder_id` once a Builder ID is saved, `approved` once the pass is issued, `checked_in` at the door. `null` = informational only.

`builderIdSignupUrl` is the official AWS sign-up link — fill it from AWS's guidance; the "Create one" link hides while it's empty.

`capacity: 0` means "not set yet": the seed script writes `NULL` (no limit) and the counter stays hidden — otherwise every sign-up would be waitlisted. Set the real number before opening.

`registration.open` is the launch switch: the form only accepts submissions when it is `true` **and** the DB event row has `registration_open = true`. `scripts/seed-event.ts <slug>` upserts the DB row (title, starts_at, ends_at, venue, mode, capacity, registration_open) from `events.json` + this file.

## 6. Data model — migration 0001

`registrations` is empty, so it can be altered freely.

```
enum registration_status: pending | approved | waitlisted | rejected | cancelled
enum meal_pref:           veg | non_veg | jain

events
  + seats_taken        integer      not null default 0   -- = pending + approved, changed atomically

registrations
  + status             registration_status not null default 'pending'
  + pass_code          text         not null unique      -- randomBytes(16) base64url; opens /pass/<code>
  + checkin_code       text         not null unique      -- randomBytes(16) base64url; inside the QR
  + ticket_no          text         not null unique      -- 6 chars, A–Z/2–9 minus look-alikes; help desk
  + college            text         not null
  ~ phone              → not null
  + meal_pref          meal_pref
  + interests          text[]       not null default '{}'
  + interests_note     text
  + builder_id         text                              -- Builder Center alias, lowercase; required before approval
  + consent_version    text         not null
  + consented_at       timestamptz  not null
  + approved_at        timestamptz
  + approved_by        text
  + checked_in_at      timestamptz
  + checked_in_by      text
  + link_sent_at       timestamptz                       -- rate limit for "find my pass"
  + reminded_at        timestamptz                       -- rate limit for the Builder ID reminder
  + updated_at         timestamptz  not null default now()
  - attended                                             -- replaced by checked_in_at
  + index (event_id, status)
  + unique (event_id, builder_id) WHERE builder_id IS NOT NULL   -- one Builder ID, one pass
  (unique (event_id, email) stays)
```

## 7. Mechanics

**Register (server action, one transaction)** — Turnstile → Zod → registration open? → generate the three codes (retry `ticket_no` on conflict) →
```sql
INSERT INTO registrations (..., status) VALUES (..., 'pending')
ON CONFLICT (event_id, email) DO NOTHING
RETURNING id, pass_code;
-- no row (already registered) → commit nothing, run the find-my-pass send,
--   show "This email is already registered — we've emailed your pass link."

UPDATE events SET seats_taken = seats_taken + 1
WHERE id = $event AND (capacity IS NULL OR seats_taken < capacity)
RETURNING id;
-- 0 rows (full) → UPDATE registrations SET status = 'waitlisted' WHERE id = $id
```
Then send "received" in `after()` and `redirect('/pass/' + pass_code)`. A single conditional UPDATE is atomic, so a rush of sign-ups can't push `seats_taken` past capacity, and a duplicate attempt never touches a seat.

**Status changes by admins (one transaction each)**

| From → to | Seat |
|---|---|
| pending → approved | no change (already holds one) |
| waitlisted → approved | needs one: the conditional increment above; 0 rows → "Event full" |
| pending / approved → waitlisted, rejected, cancelled | `seats_taken - 1` |
| waitlisted → rejected / cancelled | no change |

Every change uses `WHERE id = $id AND status = $expected_from`; 0 rows → roll back, so two admins clicking at once can't double-count. Approval sends "pass issued" in `after()`.

**Approval needs a Builder ID** (when `builderIdRequired`): the approve UPDATE also has `AND builder_id IS NOT NULL`. The Approve button is disabled on rows without one. Bulk approve reports three numbers: approved, skipped (no Builder ID), and hit "Event full".

**Saving a Builder ID** (pass page or form): validate per §3a, lowercase, save. A unique violation → "This Builder ID is already linked to another registration — contact us if that's wrong." Locked once approved.

**Builder ID reminder** (admin bulk action, PR B): emails pending people without a Builder ID — "Add your AWS Builder ID to get your pass" + pass link. Skips anyone reminded in the last 24 h (`reminded_at`).

**Check-in**
```sql
UPDATE registrations
SET checked_in_at = now(), checked_in_by = $admin
WHERE checkin_code = $1 AND status = 'approved' AND checked_in_at IS NULL
RETURNING name, college, ticket_no;
```
0 rows → look the code up to say why: already checked in (with time), not approved, or unknown. Two volunteers scanning one QR: exactly one succeeds. The desk compares the name with the college ID.

**Find my pass** — same response every time. Sends only if the email is registered and `link_sent_at` is more than 10 minutes old.

**Emails** (nodemailer, `after()` so SMTP never delays the response; on failure log it — the pass page still works):
1. Registration received → pass link
2. Pass issued → QR (inline PNG) + pass link + date, venue, "bring your college ID"
3. Your pass link (find my pass)
4. Add your AWS Builder ID (admin reminder, PR B)

Budget about **2 emails per person**, plus reminders for whoever hasn't added a Builder ID. Resend free is 100/day ≈ 50 registrations/day. If the announcement can bring more than that, take Resend's paid plan for November (or move to SES).

## 8. Privacy and consent

Students hand us name, email, phone and college. India's DPDP Act 2023 expects a clear notice, specific consent, collecting only what's needed and deleting it afterwards; under-18s count as children needing parental consent. Not legal advice — but these habits are cheap.

- `/privacy`: what we collect, why (admission, food count, certificates, AWS reporting if applicable), who sees it, how long we keep it, how to request deletion.
- Consent checkbox: *"I am 18 or older and accept the Privacy Notice and Event Policies."* Store `consent_version` + `consented_at`.
- Delete or anonymise after certificates are sent; put the date in the notice.
- No personal data in logs or analytics. CSV exports stay with organisers — never in a WhatsApp group.

## 9. Setup outside the code

| Item | Who |
|---|---|
| Resend: verify `awssbggcet.com` (DNS records), create SMTP credentials | Shivanshu |
| Cloudflare Turnstile site for `awssbggcet.com` | Shivanshu |
| Supabase Auth (needed for PR B): Email provider on, OTP length 6, expiry 600 s, custom SMTP = Resend, `{{ .Token }}` in both "Magic Link" and "Confirm signup" templates, email rate limit raised | Shivanshu |
| Vercel: function region `bom1`; env vars below in Production | Shivanshu |
| Event content: capacity, schedule, workshops, FAQs, journey text | content team |
| `/privacy` and `/event-policies` text | Ambuj, reviewed by leads |
| Admin / volunteer emails | leads |

```
DATABASE_URL                       # exists
NEXT_PUBLIC_SITE_URL               # https://www.awssbggcet.com
SMTP_HOST  SMTP_PORT  SMTP_USER  SMTP_PASS  EMAIL_FROM
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL           # PR B
NEXT_PUBLIC_SUPABASE_ANON_KEY      # PR B
ADMIN_EMAILS                       # PR B, comma-separated
```
`lib/db`: small pool (`max: 1`–`3`) — every Vercel function instance opens its own.

## 10. PRs

**PR A — register + pass page** → registrations can open
Migration 0001, seed script, event content file, `/community-day/register` (§3a), seats API + counter, `/pass/[code]` (all states), `/pass/[code]/qr.png`, `/pass` find-my-pass, received + link emails, `/privacy` + `/event-policies` pages, Turnstile.
*Done:* register end to end → lands on a pending pass page and gets the email; same email again creates nothing and shows no link; with capacity = 2 the third person is waitlisted and the counter says "Waitlist open"; registering without a Builder ID lands on a pass page whose first block asks for it, and saving it moves the journey on; a Builder ID already used by someone else is refused with the §7 message; flipping a row to `approved` in Drizzle Studio shows the QR and Download works; build passes without `DATABASE_URL`.

**PR B — admin + approvals**
Supabase Auth for admins, `requireAdmin`, `/admin/scd` (counts by status, capacity, meal counts, search/filter, bulk approve / waitlist / reject, CSV), pass-issued email.
*Done:* status changes move `seats_taken` exactly as in §7's table; rows without a Builder ID can't be approved and bulk approve reports them as skipped; the Builder ID reminder skips anyone reminded in the last 24 h; approved people get the QR email; non-admins get 404 on every `/admin` route.

**PR C — check-in**
`/admin/checkin`: camera scanner (a maintained library — check its last publish date) + manual search by ticket no / email / name.
*Done:* two phones scan one QR → one ✅, one ⚠.

Target: PR A merged and registration open by ~5 Nov; PR B by ~7 Nov; PR C by ~15 Nov; dry run by 19 Nov.

## 11. Launch checklist

- [ ] Privacy notice and event policies live and reviewed
- [ ] Resend domain verified; test emails reach Gmail, Outlook and a college inbox (not spam)
- [ ] Email volume plan settled (free 100/day vs paid for November)
- [ ] Vercel region `bom1`; every env var set for Production
- [ ] Seed script run; capacity correct; `registration.open` true
- [ ] Dry run: register → pending page → approve → QR email → scan → second scan shows "already checked in"
- [ ] Night before: export CSV and print it as the desk's offline fallback

## 12. Inputs still needed

| Question | Answer |
|---|---|
| Capacity | |
| GCET only, or other colleges too? (`allowOtherColleges`, and which colleges to list) | |
| Branch list | |
| Food served (meal preference)? | |
| AWS Builder ID | **required** (confirmed by AWS) |
| Official AWS Builder ID sign-up link (`builderIdSignupUrl`) | |
| Does AWS need any other attendee data, and will data be shared with AWS? (goes in the privacy notice) | |
| Workshop list, schedule, FAQs | |
| Admin / volunteer emails | |
| Data deletion date | |

## Later (after SCD)

- Attendee login with email OTP, so passes for several events live under one account.
- Home page reads events through `lib/events.ts` instead of hardcoded `EVENT_CARDS`.
