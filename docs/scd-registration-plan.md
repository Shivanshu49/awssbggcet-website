# Event Registration & Pass — AWS Student Community Day 2026

Spec for on-site registration with a payment step and a pass page.
Event: **21 Nov 2026, 10:00 AM – 4:00 PM IST, GCET Greater Noida** · Site: **awssbggcet.com**
Reference for the pass page: futurebuildersconnect.com ("My Pass").
Supersedes the auth row in `docs/backend-plan.md` §1.

---

## 1. Flow

```
/community-day ──Register Now──▶ /community-day/register      seat counter on top
    Step 1  Your details        (name, college, branch, year, meal*, AWS Builder ID — optional here)
    Step 2  Contact & confirm   (email, phone) + consent + Turnstile → Submit
            │  saved as PENDING, holding a seat, 48-hour clock starts (or WAITLISTED if no seats are left)
            ▼
/pass/<pass_code>           the attendee's own pass page — bookmarkable
    + email: "Registration received" with the pass link
    no Builder ID yet → "Add your AWS Builder ID" is the first block after the header card

Pay box on the pass page: appears when the Builder ID is saved AND the status is PENDING
            club UPI QR + UPI ID, pay exactly registration.fee
            enter UTR (12 digits) + payer UPI name → status PAYMENT SUBMITTED
            no UTR within 48 h of gaining the seat → seat released, next waitlisted person gets it

Organisers: /admin/scd ──upload bank statement CSV──▶ UTR matches a credit of exactly the fee
            → status PASS ISSUED, QR appears on the same pass page
            + email: "Your pass is issued" with the QR
            no match → unmatched list for a manual check, Confirm button as the fallback

Venue: volunteer phone scans QR ──▶ /admin/checkin?c=<checkin_code>
            ✅ name + college   ⚠ already checked in at 10:42   ❌ payment not confirmed / unknown
```
\* only if the event config turns them on.

- **Lost the link?** `/pass` → enter email → link is emailed again. The response is the same whether or not the email is registered.
- **Registers twice with the same email?** No duplicate is created and the pass link is **never** shown on screen — it's emailed instead. Otherwise anyone could type a classmate's email and open their pass.

## 2. Decisions

| Decision | Why |
|---|---|
| **No attendee login.** The pass link (128-bit random code) is the key, like an airline "manage booking" link. | No SMS (TRAI DLT takes weeks), no OTP email on every visit, no auth system for hundreds of students. Fits the deadline. |
| **Paid = in.** No approve or reject step: a confirmed payment issues the pass. | Payment is the gate against junk sign-ups, since emails aren't verified at registration. |
| **Students pay the club's UPI and enter the UTR; a bank statement CSV confirms it.** No payment gateway. | A credit of exactly `registration.fee` with that UTR on the club's own statement is the proof, so a fake UTR never matches. |
| **The 48-hour clock starts when the seat is gained:** at registration with a seat, on promotion from the waitlist, or when an admin restores it. Students see "Add your Builder ID and pay within 48 hours, or the seat goes to the waitlist." | Nobody can hold a seat with no deadline, including someone who never adds a Builder ID. |
| **Refunds only for duplicate payments, the event being cancelled, or a payment whose seat was released before the UTR was submitted, when no seat is free to restore it.** | Stated in `/event-policies` (§8). |
| **AWS Builder ID is required for the pass, not for the form.** Register without one, add it on the pass page; the Pay box stays hidden until it's there. | AWS requires it. Making it required in the form would send students off mid-form to create one and lose what they typed. The order follows the reference: register → create Builder ID → add it. Ours then adds payment before the pass. |
| **Builder ID = the AWS Builder Center alias** (like the reference's `shivanshu49`), not an email. | It's what AWS's own reference site collects. If AWS wants the email instead, it's a label + validation change. |
| **Two codes per person:** `pass_code` opens the pass page; `checkin_code` is what the QR carries. | A QR seen over a shoulder or posted on Instagram can't be used to open or edit someone's pass. |
| **A registration holds a seat while pending, payment_submitted or approved.** At capacity, new sign-ups join the waitlist automatically. | The public counter ("X seats available") stays honest and drops as people register, like the reference. Payment is the gate for the QR. A released or cancelled seat passes to the oldest waitlisted person. |
| **Email: Resend over SMTP (nodemailer)**, domain `awssbggcet.com`. | Domain verification takes minutes, no production-access wait. SMTP keeps it switchable to SES later with env vars only. |
| **Admins sign in with Supabase Auth email OTP**, allowlisted by `ADMIN_EMAILS`. | Only organisers need accounts. Not hand-rolled. |
| **Not collected:** DOB, gender, ID-card upload, city. | Only what the event needs. The desk checks the physical college ID. Add gender back only if AWS's SCD reporting needs it. |
| **Don't copy the reference's AWS logo or "© Amazon Web Services" footer.** | AWS asked us to remove their logo. That page is AWS's own site; ours isn't. |

## 3. Pass page — `/pass/[code]`

Layout follows the reference; colours and type follow our site.

| Block | Pending | Payment submitted | Pass issued | Waitlisted / Cancelled |
|---|---|---|---|---|
| Header card: initials, name, college, event date, ticket no, status badge | `PAYMENT PENDING` | `PAYMENT SUBMITTED` | `PASS ISSUED` | `WAITLISTED` / `CANCELLED` |
| Deadline in the header card, visible before the Builder ID block: "Add your Builder ID and pay within 48 hours, or the seat goes to the waitlist." + the date and time (`seat_held_at` + 48 hours) | ✓ | hidden | hidden | hidden |
| AWS Builder ID | **missing → first block after the header card:** "Add your AWS Builder ID — your pass can't be issued without it", input + Save + "Create one" link (`builderIdSignupUrl`). Present → shown, editable. | read-only | read-only | editable / hidden |
| Pay box | shown once a Builder ID is saved | hidden; "Payment submitted. We'll email your pass once it's confirmed." | hidden | hidden |
| QR pass | locked placeholder: "Add your Builder ID" (if missing) or "Your QR appears here once your payment is confirmed" | same locked placeholder | QR + ticket no + **Download QR** | hidden; status message + contact email |
| Workshop interests: toggle, checkbox grid, "None of the above", free text, Save | editable until the event | editable until the event | editable until the event | editable until the event / hidden |
| Event schedule (side column) | ✓ | ✓ | ✓ | ✓ |
| FAQ | ✓ | ✓ | ✓ | ✓ |
| Your journey: steps tagged BEFORE THE DAY / AT THE VENUE; done / current / upcoming worked out from status, Builder ID and UTR | ✓ | ✓ | ✓ | ✓ |
| Note: "Bookmark this page — it's your pass. Lost it? Find my pass." | ✓ | ✓ | ✓ | ✓ |

**Pay box.** Shown only when the Builder ID is saved and the status is pending, so nobody pays without a seat.

- Shows the `upiQr` image, `upiId` and "Pay exactly ₹<fee>" from `registration.fee`.
- **UTR:** exactly 12 digits. Error: "Enter the 12-digit UTR from your UPI app".
- **Payer UPI name:** required, 2–120 chars, trimmed. Error: "Enter the name on your UPI account".
- Submitting moves the status to `payment_submitted` (§7). The UTR can't be edited afterwards; a typo lands on the admin's unmatched list.

Waitlisted people see "You're on the waitlist. If a seat opens, you'll have 48 hours to add your Builder ID and pay." Cancelled people see "This registration is cancelled. Want your seat back, or already paid? Email <contact>."

Rules:
- `dynamic = 'force-dynamic'`; metadata `robots: noindex` and `referrer: 'no-referrer'` (so the code never leaks through the Referer header to outside links).
- Email and phone shown **masked** (`sh****@gmail.com`, `98•••••210`), and the UTR shows only its last 4 digits — the link may get forwarded.
- Unknown code → the normal 404. Never say whether a code exists.
- `GET /pass/[code]/qr.png` returns the QR PNG **only** when the pass is issued.

## 3a. Registration form — `/community-day/register`

Layout and behaviour follow the reference form; colours and type follow our site.

- **Seat counter** at the top: "**X seats available** out of Y" with a progress bar, from the seats API. At capacity: "**Waitlist open** — register to join the waitlist." Hidden when capacity is 0 (unset). The fee from `registration.fee` always shows above it, so students see the price before filling in the form.
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
| AWS Builder ID | optional here. Builder Center alias: 3–50 chars, letters, digits, `.` `_` `-`; saved lowercase. Hint under the field: "Don't have one yet? Add it on your pass page within 48 hours of getting a seat — your pass can't be issued without it." Same rule on the pass page. | "Enter a valid AWS Builder ID" |
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
| `/admin/scd` | dynamic, admin | counts, table, statement upload, unmatched list, manual confirm, cancel, restore seat, CSV |
| `/admin/checkin` | dynamic, admin | scanner + manual search |
| `/privacy`, `/event-policies` | static | text from `content/legal/`; must be live before registration opens |
| `GET /api/events/[slug]/seats` | dynamic, `Cache-Control: s-maxage=30` | `{ capacity, taken, open }` for the counter; fetched client-side so the pages stay static |
| `POST /api/cron/release-seats` | dynamic, `Authorization: Bearer $CRON_SECRET` | hourly 48-hour release and 24-hour reminder (§7) |

- **No page queries the database at build time** — CI builds without `DATABASE_URL`.
- Admin auth is checked inside every admin page and server action (`requireAdmin()`), not only in middleware.
- With no Turnstile env vars (dev, CI), use Cloudflare's documented always-pass test keys.

## 5. Event content — `content/event-pages/aws-student-community-day-2026.json`

```json
{
  "registration": {
    "open": false,
    "capacity": 0,
    "fee": 45,
    "upiId": "",
    "upiQr": "",
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
    { "phase": "before", "step": "paid",         "title": "Pay the registration fee and enter your UTR", "body": "…" },
    { "phase": "before", "step": "approved",     "title": "Pass issued — QR here and in your email", "body": "…" },
    { "phase": "venue",  "step": "checked_in",   "title": "Check in with your QR and college ID", "body": "…" },
    { "phase": "venue",  "step": null,           "title": "Workshops and sessions", "body": "…" }
  ]
}
```

`step` ties a journey item to progress: `registered` is done once the row exists, `builder_id` once a Builder ID is saved, `paid` once a UTR is submitted, `approved` once the pass is issued, `checked_in` at the door. `null` = informational only.

`builderIdSignupUrl` is the official AWS sign-up link — fill it from AWS's guidance; the "Create one" link hides while it's empty.

`capacity: 0` means "not set yet": the seed script writes `NULL` (no limit) and the counter stays hidden — otherwise every sign-up would be waitlisted. Set the real number before opening.

`registration.fee` is the SCD fee in whole rupees, currently ₹45, and this key is the only place the amount is stored. There is no database column for it and no literal in code or in `content/legal/`. FAQ and journey text say "the registration fee" with no number. Before registration opens, changing the fee means editing this one line and redeploying; after that it can't change (§11).

- **Statement matching** confirms a payment only when the UTR matches and the statement row is a credit of exactly `registration.fee` (₹45).
- **Event policies** write the amount as `₹{{fee}}` in `content/legal/event-policies.md`. `LegalPage` fills it in from `registration.fee`, so the page reads ₹45.

`upiId` is the club's UPI ID and `upiQr` is the path to its QR image under `public/`. Use a QR with no preset amount, so a fee change never needs a new image.

`registration.open` is the launch switch: the form only accepts submissions when it is `true` **and** the DB event row has `registration_open = true`. `scripts/seed-event.ts <slug>` upserts the DB row (title, starts_at, ends_at, venue, mode, capacity, registration_open) from `events.json` + this file.

## 6. Data model

**Migration 0001** (PR A, already applied):

```
enum registration_status: pending | approved | waitlisted | rejected | cancelled
enum meal_pref:           veg | non_veg | jain

events
  + seats_taken        integer      not null default 0   -- = pending + payment_submitted + approved, changed atomically

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
  + builder_id         text                              -- Builder Center alias, lowercase; required before the Pay box appears
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

**Migration 0002** (PR B):

```
enum registration_status: + payment_submitted

registrations
  + utr                text                              -- exactly 12 digits; from the Pay box
  + payer_name         text                              -- payer's UPI name, for the manual check
  + utr_submitted_at   timestamptz
  + seat_held_at       timestamptz                       -- when the seat was gained; starts the 48-hour clock
  + deadline_reminded_at timestamptz                     -- when the 24-hour reminder went out; sends it once per seat hold
  + unique (event_id, utr) WHERE utr IS NOT NULL         -- one UTR, one pass
```

All five columns are nullable, so this is safe on a table that already has rows. The migration sets `seat_held_at = now()` on any existing pending rows, so none of them escape the clock. `approved` now means the payment is confirmed, and `approved_by` records the admin who uploaded the statement or pressed Confirm. `rejected` stays in the enum, unused.

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
If the row got a seat, set `seat_held_at = now()` in the same transaction. Then send "received" in `after()` and `redirect('/pass/' + pass_code)`. A single conditional UPDATE is atomic, so a rush of sign-ups can't push `seats_taken` past capacity, and a duplicate attempt never touches a seat.

**Status changes (one transaction each)**

| From → to | When | Seat |
|---|---|---|
| pending → payment_submitted | student submits a UTR | no change |
| payment_submitted → approved | statement match or manual confirm | no change |
| pending → cancelled | 48 hours with no UTR | released |
| pending / payment_submitted / approved → cancelled | admin cancels | released |
| waitlisted → pending | a seat is released | takes it |
| waitlisted → cancelled | admin cancels | no change |
| cancelled → approved | manual confirm for someone who paid late; admin enters the UTR | needs one: the conditional increment above; 0 rows → "Event full", and the payment is refunded (§8) |
| cancelled → pending | admin presses Restore seat; the row has no UTR | needs one: the conditional increment above; 0 rows → "Event full" |

Every change uses `WHERE id = $id AND status = $expected_from`; 0 rows → roll back, so two admins clicking at once can't double-count. Moving to `approved` sends "pass issued" in `after()`.

**48-hour clock:** `seat_held_at` is set when a row gains a seat: at registration with a seat, on promotion from the waitlist, or on Restore seat. Saving a Builder ID never touches it, so adding or re-saving one doesn't change the deadline.

**Pay box gate:** `status = 'pending' AND builder_id IS NOT NULL`. It has no effect on the clock.

**Saving a Builder ID** (pass page or form): validate per §3a, lowercase, save. A unique violation → "This Builder ID is already linked to another registration — contact us if that's wrong." Locked once a UTR is submitted.

**Submitting a UTR** (pass page):
```sql
UPDATE registrations
SET status = 'payment_submitted', utr = $utr, payer_name = $name, utr_submitted_at = now()
WHERE pass_code = $1 AND status = 'pending' AND builder_id IS NOT NULL;
```
A unique violation → "This UTR has already been submitted — contact us if that's wrong." 0 rows → "This pass can't take a payment any more — contact us."

**Statement upload** (admin, PR B): parse the CSV in memory and never store or log it. Collect the UTR of every credit of exactly `registration.fee`, comparing amounts as numbers so `45.00` equals `45`. The UTR may sit inside the narration text, so pull 12-digit runs from it.
```sql
UPDATE registrations
SET status = 'approved', approved_at = now(), approved_by = $admin
WHERE event_id = $event AND status = 'payment_submitted' AND utr = ANY($utrs)
RETURNING name, email, pass_code, checkin_code, ticket_no;
```
Each returned row gets "pass issued" in `after()`. Uploading the same statement again confirms nobody twice and sends no second email.

**Unmatched list** (shown after each upload):
- Submitted UTRs with no exact-fee credit: a typo, a wrong amount, a payment not on this statement yet, or a fake. Each has **Confirm** (the manual fallback; the admin can correct the UTR first) and **Cancel**. A fake UTR holds its seat until an admin cancels it.
- Exact-fee credits that no registration claims: someone who paid but never submitted a UTR, or a duplicate payment.

**Seat released** (48 hours, or an admin cancelling): the seat passes straight to the oldest waitlisted person in the same transaction (`ORDER BY created_at, id LIMIT 1 FOR UPDATE SKIP LOCKED`): status `pending`, `seat_held_at = now()`, and the "A seat opened" email in `after()`. `seats_taken` only drops when nobody is waiting, so a new sign-up can't jump the queue.

**48-hour release** (`POST /api/cron/release-seats`, hourly from a GitHub Actions schedule, so it doesn't depend on the Vercel plan): each expired row gets its own transaction.
```sql
UPDATE registrations SET status = 'cancelled'
WHERE id = $id AND status = 'pending' AND seat_held_at < now() - interval '48 hours';
```
Then the seat passes on as above, and the person gets "Your seat was released". The status is `cancelled`, not `waitlisted`, because the queue is ordered by `created_at` and would put them straight back at the front. A UTR submitted before the job reaches the row still counts: both updates need `status = 'pending'`, so exactly one wins. The same job promotes waitlisted people while free seats exist, which covers a raised capacity.

**24-hour reminder** (same job, after the releases, so nobody being released gets one):
```sql
UPDATE registrations SET deadline_reminded_at = now()
WHERE event_id = $event AND status = 'pending'
  AND seat_held_at <= now() - interval '24 hours' AND deadline_reminded_at IS NULL
RETURNING name, email, pass_code, seat_held_at, builder_id;
```
Each returned row gets an email with the pass link in `after()`: "Your seat expires in <hours>h: pay ₹<fee>" if it has a Builder ID, or "Your seat expires in <hours>h: add your Builder ID and pay ₹<fee>" if it doesn't. `<hours>` is the time left until `seat_held_at` + 48 hours, rounded up, and `<fee>` comes from `registration.fee`. The UPDATE claims the row before sending, so overlapping runs can't send twice. A failed send is logged and not retried.

**Restore seat** (admin, on `cancelled` rows with `utr IS NULL`): set `status = 'pending'`, `seat_held_at = now()` and `deadline_reminded_at = NULL`, in one transaction with the conditional increment above. 0 rows → roll back and show "Event full". Sends "A seat opened" in `after()`. Clearing `deadline_reminded_at` gives the fresh clock its own reminder. Released seats go straight to the waitlist, so a free seat normally means nobody is waiting and a restore doesn't jump the queue.

**Builder ID reminder** (admin bulk action, PR B): emails pending people without a Builder ID — "Add your AWS Builder ID to get your pass" + deadline + pass link. Skips anyone reminded in the last 24 h (`reminded_at`).

**Check-in**
```sql
UPDATE registrations
SET checked_in_at = now(), checked_in_by = $admin
WHERE checkin_code = $1 AND status = 'approved' AND checked_in_at IS NULL
RETURNING name, college, ticket_no;
```
0 rows → look the code up to say why: already checked in (with time), payment not confirmed, or unknown. Two volunteers scanning one QR: exactly one succeeds. The desk compares the name with the college ID.

**Find my pass** — same response every time. Sends only if the email is registered and `link_sent_at` is more than 10 minutes old.

**Emails** (nodemailer, `after()` so SMTP never delays the response; on failure log it — the pass page still works):
1. Registration received → pass link, plus the 48-hour rule and deadline if they got a seat
2. Pass issued → QR (inline PNG) + pass link + date, venue, "bring your college ID"
3. Your pass link (find my pass)
4. Add your AWS Builder ID (admin reminder, PR B)
5. A seat opened → pass link + the 48-hour rule and deadline (promotion or Restore seat, PR B)
6. Your seat was released → pass link + contact email (PR B)
7. Your seat expires in <hours>h → pass link (24-hour reminder, PR B)

Budget about **2 emails per person**, plus the 24-hour reminder for anyone without a UTR by then, Builder ID reminders, and one more for anyone promoted, released or restored. Resend free is 100/day ≈ 50 registrations/day, and one statement upload can use a whole day's limit at once. If the announcement can bring more than that, take Resend's paid plan for November (or move to SES).

## 8. Privacy and consent

Students hand us name, email, phone, college and, when they pay, a UTR and UPI name. India's DPDP Act 2023 expects a clear notice, specific consent, collecting only what's needed and deleting it afterwards; under-18s count as children needing parental consent. Not legal advice — but these habits are cheap.

- `/privacy`: what we collect, why (admission, food count, certificates, checking payments, AWS reporting if applicable), who sees it, how long we keep it, how to request deletion.
- `/event-policies`: the fee as `₹{{fee}}` (§5) and the refund rule: refunds only for duplicate payments, the event being cancelled, or a payment whose seat was released before the UTR was submitted, when no seat is free to restore it.
- Consent checkbox: *"I am 18 or older and accept the Privacy Notice and Event Policies."* Store `consent_version` + `consented_at`.
- Delete or anonymise after certificates are sent; put the date in the notice.
- No personal data in logs or analytics. CSV exports and bank statements stay with organisers — never in a WhatsApp group.

## 9. Setup outside the code

| Item | Who |
|---|---|
| Resend: verify `awssbggcet.com` (DNS records), create SMTP credentials | Shivanshu |
| Cloudflare Turnstile site for `awssbggcet.com` | Shivanshu |
| Supabase Auth (needed for PR B): Email provider on, "Confirm email" on (the admin check trusts the account's email, so nobody may hold an unconfirmed one), OTP length 6, expiry 600 s, custom SMTP = Resend, `{{ .Token }}` in both "Magic Link" and "Confirm signup" templates, email rate limit raised | Shivanshu |
| Vercel: function region `bom1`; env vars below in Production | Shivanshu |
| Event content: capacity, schedule, workshops, FAQs, journey text | content team |
| Club UPI ID and a QR image with no preset amount (`upiId`, `upiQr`) | leads |
| A sample bank statement CSV to build the parser against | Shivanshu |
| GitHub Actions secret `CRON_SECRET`, same value as in Vercel | Shivanshu |
| `/privacy` and `/event-policies` text | Ambuj, reviewed by leads |
| Admin / volunteer emails | leads |

```
DATABASE_URL                       # exists
NEXT_PUBLIC_SITE_URL               # https://www.awssbggcet.com
SMTP_HOST  SMTP_PORT  SMTP_USER  SMTP_PASS  EMAIL_FROM
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL           # PR B
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # PR B
ADMIN_EMAILS                       # PR B, comma-separated
CRON_SECRET                        # PR B
```
`lib/db`: small pool (`max: 1`–`3`) — every Vercel function instance opens its own.

## 10. PRs

**PR A — register + pass page** (merged)
Migration 0001, seed script, event content file, `/community-day/register` (§3a), seats API + counter, `/pass/[code]` (all states), `/pass/[code]/qr.png`, `/pass` find-my-pass, received + link emails, `/privacy` + `/event-policies` pages, Turnstile.
*Done:* register end to end → lands on a pending pass page and gets the email; same email again creates nothing and shows no link; with capacity = 2 the third person is waitlisted and the counter says "Waitlist open"; registering without a Builder ID lands on a pass page whose first block asks for it, and saving it moves the journey on; a Builder ID already used by someone else is refused with the §7 message; flipping a row to `approved` in Drizzle Studio shows the QR and Download works; build passes without `DATABASE_URL`.

**PR B — payments + admin** → registrations can open
Migration 0002, `fee` + `upiId` + `upiQr` in the content file and its type, fee shown on the form, Pay box + UTR action, statement parser, `/api/cron/release-seats` + its schedule, seat-opened + seat-released + 24-hour reminder + pass-issued emails, `₹{{fee}}` in `LegalPage`. Update what PR A shipped: badges, QR block copy, Builder ID hint, received email, `interestsEditable`, `JourneyStep`, `journeyStates` and `scripts/check-registration.ts`. Supabase Auth for admins, `requireAdmin`, `/admin/scd` (counts by status, capacity, meal counts, search/filter, statement upload, unmatched list, manual confirm, cancel, restore seat, Builder ID reminder, CSV). Manual confirm needs a Builder ID, and only goes through if `builder_id` still equals what the admin saw. CSV export prefixes cells starting with `=` `+` `-` `@` with `'`.
*Done:* the pass page shows the deadline from the first visit; no Pay box without a Builder ID or on a waitlisted row; a UTR that isn't 12 digits or is already used is refused; a statement upload confirms only credits of exactly the fee and sends the QR email, and uploading it again sends nothing; a wrong amount and an unknown UTR both land on the unmatched list; manual confirm issues the pass; a seat past 48 hours with no UTR, with or without a Builder ID, goes to the oldest waitlisted person, and `seats_taken` moves exactly as in §7's table; saving a Builder ID doesn't change the deadline; the 24-hour reminder goes out once per seat hold, only to pending rows, and not to anyone released in the same run, and it asks for a Builder ID only from people without one; Restore seat works only on cancelled rows with no UTR, starts a fresh 48 hours, sends the seat-opened email, and shows "Event full" when no seat is free; the Builder ID reminder skips anyone reminded in the last 24 h; non-admins get 404 on every `/admin` route; the release route refuses a request without `CRON_SECRET`.

**PR C — check-in**
`/admin/checkin`: camera scanner (a maintained library — check its last publish date) + manual search by ticket no / email / name.
*Done:* two phones scan one QR → one ✅, one ⚠.

Target: PR B merged and registration open by ~7 Nov; PR C by ~15 Nov; dry run by 19 Nov.

## 11. Launch checklist

- [ ] Privacy notice and event policies text written before opening, live and reviewed (then remove their `noindex`)
- [ ] Turnstile keys in Vercel before the build that opens registration (the register and find-my-pass pages decide open/closed at build time)
- [ ] Turnstile hostnames: only `awssbggcet.com` and `www.awssbggcet.com`
- [ ] Resend domain verified; test emails reach Gmail, Outlook and a college inbox (not spam)
- [ ] Email volume plan settled (free 100/day vs paid for November)
- [ ] Vercel region `bom1`; every env var set for Production
- [ ] Seed script run; capacity correct; `registration.open` true
- [ ] Fee final before opening: `registration.fee` can't change after registration opens. If it ever does, bump `consentVersion`.
- [ ] `upiId` and `upiQr` set; one real payment made to the club's UPI, and its line in a downloaded statement parses
- [ ] Hourly release job running; `CRON_SECRET` set in Vercel and GitHub
- [ ] Dry run: register → add Builder ID → pay → submit UTR → upload statement → QR email → scan → second scan shows "already checked in"
- [ ] Night before: upload the latest statement, then export CSV and print it as the desk's offline fallback
- [ ] Once registration opens, .env.local never points at production. PR B/C testing uses a local Postgres.

## 12. Inputs still needed

| Question | Answer |
|---|---|
| Capacity | |
| GCET only, or other colleges too? (`allowOtherColleges`, and which colleges to list) | |
| Branch list | |
| Food served (meal preference)? | |
| AWS Builder ID | **required** (confirmed by AWS) |
| Official AWS Builder ID sign-up link (`builderIdSignupUrl`) | |
| Club UPI ID and QR image (`upiId`, `upiQr`) | |
| Which bank, and a sample statement CSV | |
| Does AWS need any other attendee data, and will data be shared with AWS? (goes in the privacy notice) | |
| Workshop list, schedule, FAQs | |
| Admin / volunteer emails | |
| Data deletion date | |

## Later (after SCD)

- Attendee login with email OTP, so passes for several events live under one account.
- Home page reads events through `lib/events.ts` instead of hardcoded `EVENT_CARDS`.
