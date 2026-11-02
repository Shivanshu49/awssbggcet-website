// app/api/otp/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { otpVerifications } from "@/lib/db/schema";
import { sendOtpEmail } from "@/lib/registration/email";
import { sendOtpWhatsApp } from "@/lib/registration/whatsapp";

const schema = z.object({
  registrationId: z.string().min(1),
  purpose: z.enum(["email", "mobile"]),
  recipient: z.string().min(1),
  firstName: z.string().min(1).default("there"),
});

function generateOtp(): string {
  // 6 digit numeric OTP
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1_000_000).padStart(6, "0");
}

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

    const { registrationId, purpose, recipient, firstName } = parsed.data;

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert: invalidate any existing OTP for this registration+purpose
    await db.delete(otpVerifications).where(
      // Drizzle's `and` + `eq` for compound where
      // We'll delete all matching rows first, then insert fresh
      // (simpler than upsert which needs onConflict on a composite key)
      // Using raw: import { and, eq } from "drizzle-orm"
      // Doing it inline:
      (await import("drizzle-orm")).and(
        (await import("drizzle-orm")).eq(otpVerifications.registrationId, registrationId),
        (await import("drizzle-orm")).eq(otpVerifications.purpose, purpose),
      ),
    );

    await db.insert(otpVerifications).values({
      registrationId,
      purpose,
      recipient,
      otpHash,
      expiresAt,
      verified: false,
    });

    // Send the OTP
    let result: { success: boolean; error?: string };
    if (purpose === "email") {
      result = await sendOtpEmail(recipient, otp, firstName);
    } else {
      result = await sendOtpWhatsApp(recipient, otp, firstName);
    }

    if (!result.success) {
      // Still return 200 in dev (OTP logged to console); 503 in prod
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: `Failed to send OTP: ${result.error}` },
          { status: 503 },
        );
      }
    }

    return NextResponse.json({ success: true, message: `OTP sent to ${recipient}` });
  } catch (err) {
    console.error("[otp/send]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

