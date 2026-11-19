// No server-only here: the middleware and the rule checks import this too.

// Nothing in the browser reads the session, so script on the page never needs to.
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

export function parseAdminEmails(value = '') {
  return value
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function escapeLike(text: string) {
  return text.replace(/[\\%_]/g, '\\$&');
}

// The ' stops Excel running a cell as a formula: anyone can type these into the sign-up form.
function csvCell(value: string | null) {
  const text = value ?? '';
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: (string | null)[][]) {
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

// The check-in desk ignores a QR it saw, or closed a card for, in the last 3 seconds. Each sighting
// restarts the clock, so a pass held in front of the camera fires once.
export const SAME_QR_MS = 3000;
export const isRepeatScan = (last: { code: string; at: number } | null, code: string, now: number) =>
  last?.code === code && now - last.at < SAME_QR_MS;

// Every standalone 12-digit number, so raw statement rows paste as they are. Duplicates dropped.
export function parseUtrList(text: string) {
  return [...new Set(text.match(/\b\d{12}\b/g) ?? [])];
}
