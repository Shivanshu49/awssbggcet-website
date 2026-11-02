// app/api/verify/[token]/route.ts — QR token validation + check-in (atomic)
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema";
import { verifyQrToken } from "@/lib/registration/qr";
import eventsData from "@/content/events.json";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  // 1. Cryptographic token verification (HMAC)
  const registrationId = verifyQrToken(decodeURIComponent(token));
  if (!registrationId) {
    return NextResponse.json(
      { valid: false, reason: "INVALID_TOKEN" },
      { status: 200 },
    );
  }

  // 2. DB lookup
  const [reg] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.registrationId, registrationId))
    .limit(1);

  if (!reg || reg.status !== "confirmed") {
    return NextResponse.json(
      { valid: false, reason: "NOT_FOUND_OR_CANCELLED" },
      { status: 200 },
    );
  }

  // 3. Already checked in?
  if (reg.checkedIn) {
    return NextResponse.json({
      valid: true,
      alreadyCheckedIn: true,
      checkedInAt: reg.checkedInAt,
      attendee: {
        firstName: reg.firstName,
        lastName: reg.lastName,
        registrationId: reg.registrationId,
        college: reg.college,
        eventSlug: reg.eventSlug,
      },
    });
  }

  // 4. Resolve event title
  const event = (eventsData as { slug: string; title: string }[])
    .find((e) => e.slug === reg.eventSlug);

  return NextResponse.json({
    valid: true,
    alreadyCheckedIn: false,
    attendee: {
      firstName: reg.firstName,
      lastName: reg.lastName,
      registrationId: reg.registrationId,
      college: reg.college,
      eventSlug: reg.eventSlug,
      eventTitle: event?.title ?? reg.eventSlug,
    },
  });
}

/** POST: actually mark checked in (called by scanner after confirmation) */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const registrationId = verifyQrToken(decodeURIComponent(token));
  if (!registrationId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const [reg] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.registrationId, registrationId))
    .limit(1);

  if (!reg || reg.status !== "confirmed") {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  if (reg.checkedIn) {
    return NextResponse.json({ alreadyCheckedIn: true, checkedInAt: reg.checkedInAt });
  }

  // Atomic check-in
  await db
    .update(eventRegistrations)
    .set({ checkedIn: true, checkedInAt: new Date() })
    .where(eq(eventRegistrations.registrationId, registrationId));

  return NextResponse.json({ success: true, checkedIn: true });
}

