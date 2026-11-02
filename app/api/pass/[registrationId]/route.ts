// app/api/pass/[registrationId]/route.ts — PDF Pass Download endpoint
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema";
import { generateEntryPassPdf } from "@/lib/registration/pdf";
import eventsData from "@/content/events.json";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ registrationId: string }> },
) {
  try {
    const { registrationId } = await params;

    const [reg] = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.registrationId, registrationId))
      .limit(1);

    if (!reg || reg.status !== "confirmed") {
      return NextResponse.json({ error: "Registration not found or unconfirmed" }, { status: 404 });
    }

    const event = (eventsData as { slug: string; title: string; date: string; venue: string }[])
      .find((e) => e.slug === reg.eventSlug);

    const eventDate = event
      ? new Date(event.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          timeZone: "Asia/Kolkata",
        })
      : "Upcoming";

    const eventTime = event
      ? new Date(event.date).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      : "10:00 AM";

    const pdfBytes = await generateEntryPassPdf({
      attendeeName: `${reg.firstName} ${reg.lastName}`,
      registrationId: reg.registrationId,
      eventTitle: event?.title || reg.eventSlug,
      eventDate,
      eventTime,
      venue: event?.venue || "Galgotias College of Engineering & Technology",
      college: reg.college,
      qrPngBase64: reg.qrImageBase64 || "",
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Pass-${reg.registrationId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[pass/pdf]", error);
    return NextResponse.json({ error: "Failed to generate entry pass" }, { status: 500 });
  }
}

