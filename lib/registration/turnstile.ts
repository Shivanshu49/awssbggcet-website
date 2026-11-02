import 'server-only';

// Cloudflare's documented always-pass test secret, for `next dev` only.
const TEST_SECRET = '1x0000000000000000000000000000000AA';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const secret = process.env.TURNSTILE_SECRET_KEY;

// Fails closed on any host: a production build without both keys shows the closed pages, and
// verifyTurnstile refuses everything, so a crafted request can't get past the missing widget.
export const turnstileReady = process.env.NODE_ENV !== 'production' || Boolean(siteKey && secret);

export async function verifyTurnstile(token: unknown) {
  if (!turnstileReady || typeof token !== 'string' || !token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: secret || TEST_SECRET, response: token }),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}
