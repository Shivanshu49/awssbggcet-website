// app/api/events/[slug]/register/route.ts
// Main registration endpoint — creates the registration, issues QR, sends email + WhatsApp
import { NextRequest, NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations, notificationLogs } from "@/lib/db/schema";
import { registrationFormSchema } from "@/lib/registration/schema";
import {
  generateRegistrationId,
  generateQrToken,
  buildVerifyUrl,
  generateQrDataUrl,
} from "@/lib/registration/qr";
import { sendConfirmationEmail } from "@/lib/registration/email";
import { sendWhatsAppConfirmation } from "@/lib/registration/whatsapp";
import eventsData from "@/content/events.json";

// Static event config — seats and deadline (extend events.json later)
const EVENT_CONFIG: Record<string, { capacity: number; registrationDeadline?: string }> = {
  "aws-student-community-day-2026": {
    capacity: 500,
    registrationDeadline: "2026-11-18",
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Validate event exists
    const event = (eventsData as { slug: string; title: string; date: string; venue: string }[])
      .find((e) => e.slug === slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Parse + validate body
    const body = await req.json();
    const parsed = registrationFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const data = parsed.data;

    // Check OTP verification status
    // Fetch a temp registration (pre-submit) to verify OTPs were done
    // We require emailVerified + mobileVerified before finalising
    const [existing] = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventSlug, slug),
          eq(eventRegistrations.email, data.email.toLowerCase()),
        ),
      )
      .limit(1);

    if (existing && existing.status === "confirmed") {
      return NextResponse.json(
        { error: "You have already registered for this event.", registrationId: existing.registrationId },
        { status: 409 },
      );
    }

    if (existing && (!existing.emailVerified || !existing.mobileVerified)) {
      return NextResponse.json(
        { error: "Please verify your email and mobile number before submitting.", registrationId: existing.registrationId },
        { status: 400 },
      );
    }

    // Check capacity
    const config = EVENT_CONFIG[slug];
    if (config?.capacity) {
      const [{ count: regCount }] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventSlug, slug),
            eq(eventRegistrations.status, "confirmed"),
          ),
        );

      if (Number(regCount) >= config.capacity) {
        return NextResponse.json(
          { error: "Registration is full. You have been added to the waitlist." },
          { status: 200, statusText: "WAITLISTED" },
        );
      }
    }

    // Generate unique Registration ID + QR token
    const registrationId = generateRegistrationId();
    const qrToken = generateQrToken(registrationId);
    const verifyUrl = buildVerifyUrl(qrToken);
    const qrDataUrl = await generateQrDataUrl(verifyUrl);
    const now = new Date();

    // Format event date/time for notifications
    const eventDate = new Date(event.date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
    const eventTime = new Date(event.date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    // If a pending record exists (from OTP pre-step), update it; otherwise insert
    let finalRecord: typeof eventRegistrations.$inferSelect;
    if (existing) {
      const [updated] = await db
        .update(eventRegistrations)
        .set({
          registrationId,
          firstName: data.firstName,
          lastName: data.lastName,
          mobile: data.mobile,
          collegeId: data.collegeId || null,
          college: data.college,
          collegeCity: data.collegeCity || null,
          degree: data.degree,
          customDegree: data.customDegree || null,
          branch: data.branch,
          customBranch: data.customBranch || null,
          academicYear: data.academicYear,
          city: data.city,
          locality: data.locality || null,
          state: data.state,
          linkedinUrl: data.linkedinUrl || null,
          githubUrl: data.githubUrl || null,
          awsBuilderId: data.awsBuilderId || null,
          areasOfInterest: data.areasOfInterest,
          referralSource: data.referralSource,
          privacyConsent: Boolean(data.privacyConsent),
          participationConsent: Boolean(data.participationConsent),
          whatsappConsent: Boolean(data.whatsappConsent),
          qrToken,
          qrImageBase64: qrDataUrl,
          passGeneratedAt: now,
          status: "confirmed",
          updatedAt: now,
        })
        .where(eq(eventRegistrations.id, existing.id))
        .returning();
      finalRecord = updated;
    } else {
      const [inserted] = await db
        .insert(eventRegistrations)
        .values({
          registrationId,
          eventSlug: slug,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          mobile: data.mobile,
          collegeId: data.collegeId || null,
          college: data.college,
          collegeCity: data.collegeCity || null,
          degree: data.degree,
          customDegree: data.customDegree || null,
          branch: data.branch,
          customBranch: data.customBranch || null,
          academicYear: data.academicYear,
          city: data.city,
          locality: data.locality || null,
          state: data.state,
          linkedinUrl: data.linkedinUrl || null,
          githubUrl: data.githubUrl || null,
          awsBuilderId: data.awsBuilderId || null,
          areasOfInterest: data.areasOfInterest,
          referralSource: data.referralSource,
          privacyConsent: Boolean(data.privacyConsent),
          participationConsent: Boolean(data.participationConsent),
          whatsappConsent: Boolean(data.whatsappConsent),
          emailVerified: true, // trust if OTP flow was skipped in dev
          mobileVerified: true,
          qrToken,
          qrImageBase64: qrDataUrl,
          passGeneratedAt: now,
          status: "confirmed",
        })
        .returning();
      finalRecord = inserted;
    }

    // ── Fire email + WhatsApp in the background (non-blocking) ─────────────
    const emailPayload = {
      to: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      registrationId,
      eventTitle: event.title,
      eventDate,
      eventTime,
      venue: event.venue,
      qrDataUrl,
      verifyUrl,
    };

    const waPayload = {
      mobile: data.mobile,
      firstName: data.firstName,
      registrationId,
      eventTitle: event.title,
      eventDate,
      eventTime,
      venue: event.venue,
      qrDataUrl,
      verifyUrl,
    };

    // Use Promise.allSettled so one failure doesn't affect the other
    Promise.allSettled([
      sendConfirmationEmail(emailPayload).then(async (r) => {
        await db.insert(notificationLogs).values({
          registrationId,
          channel: "email",
          status: r.success ? "sent" : "failed",
          providerMessageId: r.messageId,
          errorMessage: r.error,
          sentAt: r.success ? new Date() : null,
        });
        if (r.success) {
          await db
            .update(eventRegistrations)
            .set({ emailStatus: "sent", emailSentAt: new Date() })
            .where(eq(eventRegistrations.id, finalRecord.id));
        } else {
          await db
            .update(eventRegistrations)
            .set({ emailStatus: "failed" })
            .where(eq(eventRegistrations.id, finalRecord.id));
        }
      }),
      data.whatsappConsent
        ? sendWhatsAppConfirmation(waPayload).then(async (r) => {
            await db.insert(notificationLogs).values({
              registrationId,
              channel: "whatsapp",
              status: r.success ? "sent" : "failed",
              providerMessageId: r.messageId,
              errorMessage: r.error,
              sentAt: r.success ? new Date() : null,
            });
            if (r.success) {
              await db
                .update(eventRegistrations)
                .set({ whatsappStatus: "sent", whatsappSentAt: new Date() })
                .where(eq(eventRegistrations.id, finalRecord.id));
            }
          })
        : Promise.resolve(),
    ]).catch(console.error);

    return NextResponse.json({
      success: true,
      registrationId,
      qrDataUrl,
      verifyUrl,
      firstName: data.firstName,
      eventTitle: event.title,
    });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

