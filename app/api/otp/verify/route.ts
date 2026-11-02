// app/api/otp/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { otpVerifications, eventRegistrations } from "@/lib/db/schema";

const schema = z.object({
  registrationId: z.string().min(1),
  purpose: z.enum(["email", "mobile"]),
  otp: z.string().length(6),
});

function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { registrationId, purpose, otp } = parsed.data;
    const otpHash = hashOtp(otp);
    const now = new Date();

    // Find the OTP record
    const [record] = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.registrationId, registrationId),
          eq(otpVerifications.purpose, purpose),
          eq(otpVerifications.verified, false),
          gt(otpVerifications.expiresAt, now),
        ),
      )
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "OTP expired or not found. Please request a new one." },
        { status: 400 },
      );
    }

    if (record.otpHash !== otpHash) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    }

    // Mark OTP as verified
    await db
      .update(otpVerifications)
      .set({ verified: true })
      .where(eq(otpVerifications.id, record.id));

    // Mark the corresponding field on the registration record
    if (purpose === "email") {
      await db
        .update(eventRegistrations)
        .set({ emailVerified: true })
        .where(eq(eventRegistrations.registrationId, registrationId));
    } else {
      await db
        .update(eventRegistrations)
        .set({ mobileVerified: true })
        .where(eq(eventRegistrations.registrationId, registrationId));
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (err) {
    console.error("[otp/verify]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

