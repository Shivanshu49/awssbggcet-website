import 'server-only';
import nodemailer from 'nodemailer';

import site from '@/content/site.json';
import { SITE_URL } from '@/lib/constants';
import { formatEventDate, getEventBySlug } from '@/lib/events';

import { EVENT_SLUG, eventPage } from './content';
import { formatDeadline, hoursLeft, reminderLine, seatDeadline, SEAT_RULE } from './format';
import { checkinQrPng } from './qr';

const event = getEventBySlug(EVENT_SLUG)!;
const eventLine = `${formatEventDate(event.date)}, ${event.venue}`;

const QR_CID = 'pass-qr';
const FEE = eventPage.registration.fee;

const deadlineLine = (seatHeldAt: Date | null) =>
  seatHeldAt ? [`Deadline: ${formatDeadline(seatDeadline(seatHeldAt))}`] : [];

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Runs inside after(), so SMTP never delays the response. A failure is logged and
// the pass page still works. The log carries no personal data, only the error code.
async function send(to: string, subject: string, paragraphs: string[], passCode: string, qr?: Buffer) {
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
${qr ? `<p><img src="cid:${QR_CID}" width="224" height="224" alt="Your entry QR code" style="background:#fff;padding:8px;border-radius:12px"></p>` : ''}
<p><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#FBBF24;color:#090511;font-weight:bold;text-decoration:none">Open your pass</a></p>
<p style="color:#6b6478;font-size:13px">${escapeHtml(eventLine)}<br>${escapeHtml(site.clubName)}</p>
</div>`,
        attachments: qr ? [{ filename: 'pass-qr.png', content: qr, cid: QR_CID }] : undefined,
      });
  } catch (err) {
    console.error('[email] send failed:', (err as { code?: string }).code ?? 'unknown');
  }
}

export function sendRegistrationReceived(to: string, name: string, passCode: string, seatHeldAt: Date | null) {
  return send(
    to,
    `Registration received: ${event.title}`,
    [
      `Hi ${name},`,
      `We've received your registration for ${event.title}.`,
      ...(seatHeldAt
        ? [SEAT_RULE, ...deadlineLine(seatHeldAt)]
        : ["The event is full right now, so you're on the waitlist. If a seat opens, we'll email you, and you'll have 48 hours to add your Builder ID and pay."]),
      "Your pass page shows your status. Bookmark it: it's your pass. If you haven't added your AWS Builder ID yet, add it there, because your pass can't be issued without it.",
    ],
    passCode,
  );
}

export async function sendPassIssued({
  email,
  name,
  passCode,
  checkinCode,
  ticketNo,
}: {
  email: string;
  name: string;
  passCode: string;
  checkinCode: string;
  ticketNo: string;
}) {
  return send(
    email,
    `Your pass is issued: ${event.title}`,
    [
      `Hi ${name},`,
      'Your payment is confirmed and your pass is issued.',
      `Ticket: ${ticketNo}`,
      'Show this QR at the gate, and bring your college ID.',
    ],
    passCode,
    await checkinQrPng(checkinCode),
  );
}

type Contact = { email: string; name: string; passCode: string; seatHeldAt: Date | null };

export function sendSeatOpened({ email, name, passCode, seatHeldAt }: Contact) {
  return send(
    email,
    `A seat opened: ${event.title}`,
    [`Hi ${name},`, `A seat has opened up for you at ${event.title}.`, SEAT_RULE, ...deadlineLine(seatHeldAt)],
    passCode,
  );
}

export function sendSeatReleased({ email, name, passCode }: Contact) {
  return send(
    email,
    `Your seat was released: ${event.title}`,
    [
      `Hi ${name},`,
      "We didn't receive your payment details within 48 hours, so your seat has gone to the waitlist.",
      `Want your seat back, or already paid? Email ${site.email}.`,
    ],
    passCode,
  );
}

export function sendDeadlineReminder({ email, name, passCode, seatHeldAt, builderId }: Contact & { builderId: string | null }) {
  const line = reminderLine(seatHeldAt ? hoursLeft(seatHeldAt) : 1, Boolean(builderId), FEE);
  return send(email, line, [`Hi ${name},`, `${line}.`, ...deadlineLine(seatHeldAt)], passCode);
}

export function sendBuilderIdReminder({ email, name, passCode, seatHeldAt }: Contact) {
  return send(
    email,
    'Add your AWS Builder ID to get your pass',
    [`Hi ${name},`, "Your pass can't be issued until you add your AWS Builder ID on your pass page.", ...deadlineLine(seatHeldAt)],
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
