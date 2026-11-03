import 'server-only';
import nodemailer from 'nodemailer';

import site from '@/content/site.json';
import { SITE_URL } from '@/lib/constants';
import { formatEventDate, getEventBySlug } from '@/lib/events';

import { EVENT_SLUG } from './content';

const event = getEventBySlug(EVENT_SLUG)!;
const eventLine = `${formatEventDate(event.date)}, ${event.venue}`;

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Runs inside after(), so SMTP never delays the response. A failure is logged and
// the pass page still works. The log carries no personal data, only the error code.
async function send(to: string, subject: string, paragraphs: string[], passCode: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !EMAIL_FROM) {
    console.warn('[email] SMTP is not configured; skipped');
    return;
  }
  const link = `${SITE_URL}/pass/${passCode}`;
  const port = Number(SMTP_PORT) || 587;
  try {
    await nodemailer
      .createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      })
      .sendMail({
        from: EMAIL_FROM,
        to,
        subject,
        text: [...paragraphs, `Your pass: ${link}`, eventLine, site.clubName].join('\n\n'),
        html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1625">
${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')}
<p><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#FBBF24;color:#090511;font-weight:bold;text-decoration:none">Open your pass</a></p>
<p style="color:#6b6478;font-size:13px">${escapeHtml(eventLine)}<br>${escapeHtml(site.clubName)}</p>
</div>`,
      });
  } catch (err) {
    console.error('[email] send failed:', (err as { code?: string }).code ?? 'unknown');
  }
}

export function sendRegistrationReceived(to: string, name: string, passCode: string) {
  return send(
    to,
    `Registration received: ${event.title}`,
    [
      `Hi ${name},`,
      `We've received your registration for ${event.title}.`,
      "Your pass page shows your status. Bookmark it: it's your pass. If you haven't added your AWS Builder ID yet, add it there, because your pass can't be issued without it.",
    ],
    passCode,
  );
}

export function sendPassLink(to: string, name: string, passCode: string) {
  return send(
    to,
    `Your pass link: ${event.title}`,
    [`Hi ${name},`, `Here's the link to your pass for ${event.title}.`],
    passCode,
  );
}
