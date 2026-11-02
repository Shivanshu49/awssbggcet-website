// lib/registration/email.ts — server-only Resend email delivery
import "server-only";

export interface ConfirmationEmailPayload {
  to: string;
  firstName: string;
  lastName: string;
  registrationId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  qrDataUrl: string;   // base64 data-URL of the QR code PNG
  verifyUrl: string;
}

function buildHtmlTemplate(p: ConfirmationEmailPayload): string {
  // Inline QR as base64 image (no external hosting needed for the QR)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#0D0A17;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0A17;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#100B18;border-radius:16px;border:1px solid #4C2A66;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3B1D5C,#1A0D2E);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px;color:#FBBF24;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">AWS Builder Center · GCET</p>
              <h1 style="margin:0;color:#F8FAFC;font-size:26px;font-weight:700;line-height:1.3;">Registration Confirmed! 🎉</h1>
              <p style="margin:12px 0 0;color:#C4B5DA;font-size:14px;">Your digital entry pass is ready</p>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;color:#F8FAFC;font-size:16px;">Hi <strong>${p.firstName}</strong>,</p>
              <p style="margin:12px 0 0;color:#A89DB5;font-size:14px;line-height:1.7;">
                You're officially registered for <strong style="color:#FBBF24;">${p.eventTitle}</strong>. 
                Show the QR code below at the registration desk to check in.
              </p>
            </td>
          </tr>
          <!-- Registration ID card -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A0D2E;border-radius:12px;border:1px solid #6B21A8;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;color:#A89DB5;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Registration ID</p>
                    <p style="margin:0;color:#FBBF24;font-size:22px;font-weight:700;font-family:monospace;">${p.registrationId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Event details -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color:#A89DB5;font-size:12px;width:24px;">📅</td>
                  <td style="color:#F8FAFC;font-size:14px;">${p.eventDate}</td>
                </tr>
                <tr>
                  <td style="color:#A89DB5;font-size:12px;">⏰</td>
                  <td style="color:#F8FAFC;font-size:14px;">${p.eventTime}</td>
                </tr>
                <tr>
                  <td style="color:#A89DB5;font-size:12px;">📍</td>
                  <td style="color:#F8FAFC;font-size:14px;">${p.venue}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- QR Code -->
          <tr>
            <td style="padding:28px 40px 0;text-align:center;">
              <p style="margin:0 0 16px;color:#A89DB5;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Your Entry QR Code</p>
              <div style="display:inline-block;background:#ffffff;padding:12px;border-radius:12px;">
                <img src="${p.qrDataUrl}" width="200" height="200" alt="Entry QR Code" style="display:block;border-radius:8px;" />
              </div>
              <p style="margin:12px 0 0;color:#A89DB5;font-size:12px;">Scan at the event registration desk</p>
            </td>
          </tr>
          <!-- Download button -->
          <tr>
            <td style="padding:24px 40px 0;text-align:center;">
              <a href="${p.verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#6B21A8);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;border:1px solid #9333EA;">
                View My Entry Pass →
              </a>
            </td>
          </tr>
          <!-- Instructions -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0A17;border-radius:10px;border:1px solid #2D1B4E;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;color:#FBBF24;font-size:13px;font-weight:600;">📋 Event Instructions</p>
                    <ul style="margin:0;padding-left:18px;color:#A89DB5;font-size:13px;line-height:1.8;">
                      <li>Arrive at least 30 minutes before the event starts.</li>
                      <li>Carry a valid college ID along with this entry pass.</li>
                      <li>The QR code is unique to you — do not share it.</li>
                      <li>Follow venue guidelines and event staff instructions.</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:28px 40px 32px;text-align:center;border-top:1px solid #2D1B4E;margin-top:28px;">
              <p style="margin:0 0 4px;color:#A89DB5;font-size:12px;">AWS Builder Center · Galgotias College of Engineering &amp; Technology</p>
              <p style="margin:0;color:#6B7280;font-size:11px;">Greater Noida, Uttar Pradesh, India</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(
  payload: ConfirmationEmailPayload,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping email delivery");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@awsbuilders.gcet.edu.in",
      to: [payload.to],
      subject: `✅ Confirmed! Your Entry Pass for ${payload.eventTitle} [${payload.registrationId}]`,
      html: buildHtmlTemplate(payload),
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] Exception:", msg);
    return { success: false, error: msg };
  }
}

/** Send a 6-digit OTP via email */
export async function sendOtpEmail(
  to: string,
  otp: string,
  firstName: string,
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // In dev, log OTP to console when Resend is not configured
    console.info(`[OTP-DEV] Email OTP for ${to}: ${otp}`);
    return { success: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const html = `
      <div style="background:#0D0A17;padding:40px;font-family:Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background:#100B18;border-radius:12px;border:1px solid #4C2A66;padding:32px;text-align:center;">
          <p style="color:#A89DB5;font-size:13px;margin:0 0 8px;">AWS Builder Center · GCET</p>
          <h2 style="color:#F8FAFC;margin:0 0 24px;">Verify your email</h2>
          <p style="color:#A89DB5;font-size:14px;margin:0 0 24px;">Hi ${firstName}, use the code below to verify your email address:</p>
          <div style="background:#1A0D2E;border-radius:10px;padding:20px;margin-bottom:24px;">
            <span style="color:#FBBF24;font-size:36px;font-weight:700;letter-spacing:8px;font-family:monospace;">${otp}</span>
          </div>
          <p style="color:#6B7280;font-size:12px;margin:0;">This code expires in 10 minutes. Do not share it.</p>
        </div>
      </div>`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@awsbuilders.gcet.edu.in",
      to: [to],
      subject: `${otp} — Your verification code for AWS Builder Center GCET`,
      html,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown" };
  }
}

