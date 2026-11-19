'use client';

import { useState, useTransition } from 'react';

import { SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { notifyPendingOfDeadline } from '@/lib/admin/actions';

// ponytail: one-off for the 48-hour to 1-hour change; delete with its action after the event.
export function NotifyPendingButton() {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm('Email every pending person their new deadline? Run the seat-hold SQL first. Anyone already told is skipped.')) return;
    startTransition(async () => {
      const { error, sent } = await notifyPendingOfDeadline();
      setMessage(error ?? `Notified ${sent} ${sent === 1 ? 'person' : 'people'}.`);
    });
  };

  return (
    <>
      <p role="status" className="text-xs text-[#FDE68A]">
        {message}
      </p>
      <button type="button" disabled={isPending} onClick={handleClick} className={SECONDARY_BUTTON}>
        Notify pending of new deadline
      </button>
    </>
  );
}
