// lib/registration/qr.ts — server-only QR generation + HMAC token utilities
import "server-only";
import { createHmac, randomBytes } from "crypto";

const SECRET = process.env.QR_SIGNING_SECRET ?? "dev-secret-change-in-production";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Generate a cryptographically secure opaque token for a registration.
 * Token format: <registrationId>.<randomHex>.<hmac>
 * This token is stored in DB and embedded in the QR code as a verify URL.
 * Personal information is never encoded directly.
 */
export function generateQrToken(registrationId: string): string {
  const nonce = randomBytes(16).toString("hex");
  const payload = `${registrationId}.${nonce}`;
  const hmac = createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 32); // 32 hex chars = 128 bits
  return `${payload}.${hmac}`;
}

/**
 * Verify that a QR token's HMAC matches and extract the registrationId.
 * Returns null if the token is tampered or malformed.
 */
export function verifyQrToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [registrationId, nonce, providedHmac] = parts;
  const payload = `${registrationId}.${nonce}`;
  const expectedHmac = createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  // Constant-time comparison to prevent timing attacks
  if (
    expectedHmac.length !== providedHmac.length ||
    !timingSafeEqual(expectedHmac, providedHmac)
  ) {
    return null;
  }
  return registrationId;
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

/**
 * Build the verification URL that gets embedded into the QR code.
 */
export function buildVerifyUrl(token: string): string {
  return `${SITE_URL}/verify/${encodeURIComponent(token)}`;
}

/**
 * Generate a human-readable Registration ID.
 * Format: EVT-YYYY-XXXXXX (6 random uppercase alphanumeric chars)
 */
export function generateRegistrationId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusable chars
  let suffix = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    suffix += chars[bytes[i] % chars.length];
  }
  return `EVT-${year}-${suffix}`;
}

/**
 * Generate a QR code PNG as a base64 data-URL.
 * Uses the `qrcode` package — only available on the server.
 */
export async function generateQrDataUrl(content: string): Promise<string> {
  const QRCode = await import("qrcode");
  return QRCode.toDataURL(content, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}

