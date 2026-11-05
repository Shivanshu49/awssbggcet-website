import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (text: string) => createHash('sha256').update(text).digest();

// An unset secret refuses everything, so forgetting to set it can't leave the job open.
export function cronAuthorized(header: string | null, secret = process.env.CRON_SECRET) {
  if (!secret || !header) return false;
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}
