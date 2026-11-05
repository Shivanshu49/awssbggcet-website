import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { registrations } from '@/lib/db/schema';
import { checkinQrPng } from '@/lib/registration/qr';
import { passCodeSchema } from '@/lib/registration/validation';

export const dynamic = 'force-dynamic';

const notFound = () => new Response('Not found', { status: 404 });

// Issued passes only.
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = passCodeSchema.safeParse((await params).code);
  if (!code.success) return notFound();

  const [row] = await db
    .select({ status: registrations.status, checkinCode: registrations.checkinCode })
    .from(registrations)
    .where(eq(registrations.passCode, code.data))
    .limit(1);
  if (row?.status !== 'approved') return notFound();

  const png = await checkinQrPng(row.checkinCode);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
