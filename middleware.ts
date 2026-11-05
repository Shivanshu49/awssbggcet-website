import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_COOKIE_OPTIONS } from '@/lib/admin/rules';

// Keeps admin sessions alive: Server Components can't write the refreshed cookies. This is not the
// access check, which is requireAdmin() inside every admin page, route and action. Scoped to /admin,
// so public pages never run it.
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookieOptions: ADMIN_COOKIE_OPTIONS,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  try {
    await supabase.auth.getClaims();
  } catch {
    // An unreadable session cookie: treat it as signed out, and requireAdmin turns them away.
  }
  return response; // The one setAll last built: an earlier response would lose the refreshed cookies.
}

export const config = { matcher: ['/admin/:path*'] };
