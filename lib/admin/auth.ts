import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { ADMIN_COOKIE_OPTIONS, parseAdminEmails } from './rules';

const adminEmails = () => parseAdminEmails(process.env.ADMIN_EMAILS);

export const isAdminEmail = (email: string) => adminEmails().includes(email.toLowerCase());

export const authConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: ADMIN_COOKIE_OPTIONS,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // A Server Component can't write cookies. The middleware refreshes the session instead.
        }
      },
    },
  });
}

// Called inside every admin page, route and server action. Anyone else gets the normal 404, so
// these routes don't reveal they exist. getUser asks Supabase Auth, so a forged cookie or a revoked
// session fails; getSession only reads the cookie and must never be trusted on the server.
export async function requireAdmin() {
  if (!authConfigured() || !adminEmails().length) notFound();
  let email: string | undefined;
  try {
    email = (await (await supabaseServer()).auth.getUser()).data.user?.email;
  } catch {
    // An unreadable session cookie counts as signed out.
  }
  if (!email || !isAdminEmail(email)) notFound();
  return email.toLowerCase();
}
