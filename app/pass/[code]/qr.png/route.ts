import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';

import { SITE_URL } from '@/lib/constants';
import { db } from '@/lib/db';
import { registrations } from '@/lib/db/schema';
import { passCodeSchema } from '@/lib/registration/validation';

export const dynamic = 'force-dynamic';

const notFound = () => new Response('Not found', { status: 404 });

// Issued passes only. The QR carries checkin_code, never pass_code, so a QR seen
// over a shoulder can't open or edit the pass.
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = passCodeSchema.safeParse((await params).code);
  if (!code.success) return notFound();

  const [row] = await db
    .select({ status: registrations.status, checkinCode: registrations.checkinCode })
    .from(registrations)
    .where(eq(registrations.passCode, code.data))
    .limit(1);
  if (row?.status !== 'approved') return notFound();

  const png = await QRCode.toBuffer(`${SITE_URL}/admin/checkin?c=${row.checkinCode}`, { width: 512, margin: 2 });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}
