'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { FIELD_ERROR, SMALL_PRIMARY_BUTTON, SMALL_SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { cancelRegistration, confirmPayment, restoreSeat, type ActionResult } from '@/lib/admin/actions';
import type { Registration } from '@/lib/db/schema';

export function RowActions({
  id,
  name,
  status,
  builderId,
  utr,
}: {
  id: string;
  name: string;
  status: Registration['status'];
  builderId: string | null;
  utr: string | null;
}) {
  const [utrValue, setUtrValue] = useState(utr ?? '');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<ActionResult>) =>
    startTransition(async () => {
      setError((await action()).error ?? '');
    });

  const canPay = status === 'payment_submitted' || status === 'cancelled';
  const canCancel = status === 'pending' || status === 'payment_submitted' || status === 'approved' || status === 'waitlisted';
  const canRestore = status === 'cancelled' && !utr;

  return (
    <div className="flex min-w-44 flex-col gap-2">
      {canPay && builderId && (
        <div className="flex flex-wrap gap-2">
          <input
            aria-label={`UTR for ${name}`}
            inputMode="numeric"
            maxLength={12}
            placeholder="12-digit UTR"
            value={utrValue}
            onChange={(e) => setUtrValue(e.target.value)}
            className="w-32 rounded-lg border border-[#4C2A66]/60 bg-[#1A0E2A]/70 px-2 py-1.5 font-mono text-xs text-white placeholder-white/30"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={() => run(() => confirmPayment({ id, from: status, builderId, utr: utrValue }))}
            className={SMALL_PRIMARY_BUTTON}
          >
            Confirm
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {canRestore && (
          <button type="button" disabled={isPending} onClick={() => run(() => restoreSeat(id))} className={SMALL_SECONDARY_BUTTON}>
            Restore seat
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (window.confirm(`Cancel ${name}? Any seat they hold goes to the next person on the waitlist.`)) {
                run(() => cancelRegistration({ id, from: status }));
              }
            }}
            className={SMALL_SECONDARY_BUTTON}
          >
            Cancel
          </button>
        )}
        {isPending && <Loader2 className="size-4 animate-spin text-[#FBBF24]" aria-label="Saving" />}
      </div>
      {error && (
        <p role="alert" className={FIELD_ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}
