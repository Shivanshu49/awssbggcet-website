'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { findMyPass } from '@/lib/registration/actions';
import { emailSchema } from '@/lib/registration/validation';

import { CARD, FIELD_ERROR, FIELD_INPUT, FIELD_LABEL, PRIMARY_BUTTON, fieldBorder } from './field-styles';
import { Turnstile } from './Turnstile';

export function FindPassForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setFormError('');
    setSent(false);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0].message);
      document.getElementById('email')?.focus();
      return;
    }
    setEmailError('');
    if (!token) {
      setFormError('Please wait for the verification above to finish, then try again.');
      return;
    }
    startTransition(async () => {
      const result = await findMyPass(email, token);
      setTurnstileReset((n) => n + 1);
      setEmailError(result.fieldError ?? '');
      setFormError(result.formError ?? '');
      setSent(Boolean(result.sent));
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isPending} className={`${CARD} flex flex-col gap-5 text-left`}>
      <div>
        <label htmlFor="email" className={FIELD_LABEL}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          className={`${FIELD_INPUT} ${fieldBorder(emailError)}`}
        />
        {emailError && (
          <p id="email-error" className={FIELD_ERROR}>
            {emailError}
          </p>
        )}
      </div>
      <Turnstile onToken={setToken} resetSignal={turnstileReset} />
      {sent && (
        <p role="status" className="rounded-xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-4 py-3 text-sm text-[#FDE68A]">
          If that email is registered, we&apos;ve sent your pass link. Check your inbox and spam folder.
        </p>
      )}
      {formError && (
        <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      )}
      <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} self-end`}>
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {isPending ? 'Sending' : 'Email my pass link'}
      </button>
    </form>
  );
}
