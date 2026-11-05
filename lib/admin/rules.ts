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
