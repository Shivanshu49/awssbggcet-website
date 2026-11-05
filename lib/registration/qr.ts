import 'server-only';
import QRCode from 'qrcode';

import { SITE_URL } from '@/lib/constants';

// Carries checkin_code, never pass_code, so a QR seen over a shoulder can't open or edit the pass.
export function checkinQrPng(checkinCode: string) {
  return QRCode.toBuffer(`${SITE_URL}/admin/checkin?c=${checkinCode}`, { width: 512, margin: 2 });
}
