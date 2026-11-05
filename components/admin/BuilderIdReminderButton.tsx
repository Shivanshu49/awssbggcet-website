'use client';

import { useState, useTransition } from 'react';

import { SECONDARY_BUTTON } from '@/components/registration/field-styles';
import { sendBuilderIdReminders } from '@/lib/admin/actions';

export function BuilderIdReminderButton() {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm('Email everyone with a seat and no Builder ID? Anyone reminded in the last 24 hours is skipped.')) return;
    startTransition(async () => {
      const { error, sent } = await sendBuilderIdReminders();
      setMessage(error ?? `Reminded ${sent} ${sent === 1 ? 'person' : 'people'}.`);
    });
  };

  return (
    <>
      <p role="status" className="text-xs text-[#FDE68A]">
        {message}
      </p>
      <button type="button" disabled={isPending} onClick={handleClick} className={SECONDARY_BUTTON}>
        Remind about Builder ID
      </button>
    </>
  );
}
