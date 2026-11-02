// lib/registration/whatsapp.ts — server-only Meta WhatsApp Business Cloud API
import "server-only";

const WA_API_VERSION = "v19.0";
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
const WA_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN ?? "";

export interface WhatsAppPassPayload {
  mobile: string;          // E.164 format e.g. +919876543210
  firstName: string;
  registrationId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  qrDataUrl: string;       // base64 PNG data-URL (will be uploaded or sent inline)
  verifyUrl: string;
}

/**
 * Send a WhatsApp text message using the Meta Cloud API.
 * Uses a plain text fallback (no template approval required for text-only messages
 * sent in the 24-hour customer service window, or after template approval).
 *
 * IMPORTANT: For outbound (outside 24-hr window) messages, use approved templates.
 * Set WHATSAPP_TEMPLATE_NAME in .env.local once your template is approved.
 */
export async function sendWhatsAppConfirmation(
  payload: WhatsAppPassPayload,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WA_PHONE_ID || !WA_TOKEN) {
    console.warn("[whatsapp] WHATSAPP credentials not set — skipping WhatsApp delivery");
    return { success: false, error: "WhatsApp service not configured" };
  }

  // Normalise mobile to E.164 (strip leading + for API call)
  const to = payload.mobile.replace(/^\+/, "");

  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;

  // ── Option A: Send via approved message template (recommended for production) ──
  if (templateName) {
    return sendViaTemplate(to, templateName, payload);
  }

  // ── Option B: Free-form text message (works within 24-hr window) ──
  const body = [
    `Hello ${payload.firstName}! 🎉`,
    ``,
    `Your registration for *${payload.eventTitle}* has been confirmed!`,
    ``,
    `🎫 *Registration ID:* ${payload.registrationId}`,
    `📅 *Date:* ${payload.eventDate}`,
    `⏰ *Time:* ${payload.eventTime}`,
    `📍 *Venue:* ${payload.venue}`,
    ``,
    `Your unique digital entry pass: ${payload.verifyUrl}`,
    ``,
    `Show the QR code at the registration desk. We look forward to seeing you!`,
    ``,
    `— AWS Builder Center · GCET`,
  ].join("\n");

  return sendTextMessage(to, body);
}

async function sendTextMessage(
  to: string,
  body: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const url = `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_ID}/messages`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: true, body },
      }),
    });

    const data = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message: string };
    };

    if (!res.ok || data.error) {
      const msg = data.error?.message ?? `HTTP ${res.status}`;
      console.error("[whatsapp] API error:", msg);
      return { success: false, error: msg };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[whatsapp] Exception:", msg);
    return { success: false, error: msg };
  }
}

async function sendViaTemplate(
  to: string,
  templateName: string,
  p: WhatsAppPassPayload,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const url = `https://graph.facebook.com/${WA_API_VERSION}/${WA_PHONE_ID}/messages`;

  // Map parameters to the approved template's variable placeholders.
  // Adjust the component parameters if your approved template uses different variables.
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: p.firstName },
            { type: "text", text: p.eventTitle },
            { type: "text", text: p.registrationId },
            { type: "text", text: p.eventDate },
            { type: "text", text: p.eventTime },
            { type: "text", text: p.venue },
            { type: "text", text: p.verifyUrl },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message: string };
    };

    if (!res.ok || data.error) {
      return { success: false, error: data.error?.message ?? `HTTP ${res.status}` };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

/** Send OTP via WhatsApp text message */
export async function sendOtpWhatsApp(
  mobile: string,
  otp: string,
  firstName: string,
): Promise<{ success: boolean; error?: string }> {
  if (!WA_PHONE_ID || !WA_TOKEN) {
    console.info(`[OTP-DEV] WhatsApp OTP for ${mobile}: ${otp}`);
    return { success: true };
  }

  const to = mobile.replace(/^\+/, "");
  const body = `Hello ${firstName}! Your verification code for AWS Builder Center GCET event registration is:\n\n*${otp}*\n\nThis code expires in 10 minutes. Do not share it.`;
  return sendTextMessage(to, body);
}

