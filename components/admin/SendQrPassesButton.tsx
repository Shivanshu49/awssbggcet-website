'use client';

import { useState, useTransition } from 'react';

import { SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { sendQrPasses } from '@/lib/admin/actions';

export function SendQrPassesButton({ released, opensAt }: { released: boolean; opensAt: string }) {
  const [message, setMessage] = useState(released ? '' : `Available from ${opensAt}.`);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm("Email the QR pass to every approved person who hasn't had it yet?")) return;
    startTransition(async () => {
      const { error, sent, failed, remaining } = await sendQrPasses();
      setMessage(
        error ?? `Sent ${sent}.${failed ? ` ${failed} failed.` : ''}${remaining ? ` ${remaining} still to send: click again.` : ''}`,
      );
    });
  };

  return (
    <>
      <p role="status" className="text-xs text-[#FDE68A]">
        {message}
      </p>
      <button type="button" disabled={!released || isPending} onClick={handleClick} className={SECONDARY_BUTTON}>
        Send QR passes
      </button>
    </>
  );
}
