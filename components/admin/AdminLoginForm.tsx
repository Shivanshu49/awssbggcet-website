'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import {
  CARD,
  FIELD_ERROR,
  FIELD_INPUT,
  FIELD_LABEL,
  PRIMARY_BUTTON,
  fieldBorder,
} from '@/components/registration/field-styles';
import { sendAdminCode, verifyAdminCode } from '@/lib/admin/actions';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    startTransition(async () => {
      if (sent) {
        const result = await verifyAdminCode(email, code); // On success this redirects.
        setError(result.error ?? '');
      } else {
        const result = await sendAdminCode(email);
        setError(result.error ?? '');
        setSent(!result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={`${CARD} mt-6 flex flex-col gap-4`}>
      {sent ? (
        <div>
          <p role="status" className="mb-4 text-sm text-[#CFC5DC]">
            If this email is on the organiser list, a code is on its way.
          </p>
          <label htmlFor="admin-code" className={FIELD_LABEL}>
            Code from the email
          </label>
          <input
            id="admin-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className={`${FIELD_INPUT} ${fieldBorder(error)} font-mono`}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="admin-email" className={FIELD_LABEL}>
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'admin-login-error' : undefined}
            className={`${FIELD_INPUT} ${fieldBorder(error)}`}
          />
        </div>
      )}
      {error && (
        <p id="admin-login-error" role="alert" className={FIELD_ERROR}>
          {error}
        </p>
      )}
      <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} self-start`}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {sent ? 'Sign in' : 'Email me a code'}
      </button>
    </form>
  );
}
