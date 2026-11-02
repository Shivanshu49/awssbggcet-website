'use client';

import { ExternalLink, Loader2 } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { saveBuilderId } from '@/lib/registration/actions';
import { builderIdSchema } from '@/lib/registration/validation';

import { CARD, CARD_TITLE, FIELD_ERROR, FIELD_INPUT, FIELD_LABEL, PRIMARY_BUTTON, fieldBorder } from './field-styles';

export function BuilderIdForm({
  code,
  initial,
  signupUrl,
  required,
}: {
  code: string;
  initial: string | null;
  signupUrl: string;
  required: boolean;
}) {
  const [value, setValue] = useState(initial ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const missing = required && !initial;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setSaved(false);
    const parsed = builderIdSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      document.getElementById('pass-builder-id')?.focus();
      return;
    }
    setError('');
    startTransition(async () => {
      const result = await saveBuilderId(code, value);
      setError(result.error ?? '');
      setSaved(!result.error);
    });
  };

  return (
    <section
      aria-labelledby="builder-id-heading"
      className={`${CARD} ${missing ? 'border-[#FBBF24]/60 shadow-[0_0_24px_rgba(251,191,36,0.12)]' : ''}`}
    >
      <h2 id="builder-id-heading" className={CARD_TITLE}>
        {missing ? 'Add your AWS Builder ID' : 'AWS Builder ID'}
      </h2>
      {missing && (
        <p className="mt-1 text-sm text-[#CFC5DC]">Your pass can&apos;t be issued without it.</p>
      )}
      <form onSubmit={handleSubmit} noValidate className="mt-4">
        <label htmlFor="pass-builder-id" className={FIELD_LABEL}>
          Builder Center alias
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="pass-builder-id"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
              setSaved(false);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'pass-builder-id-error' : undefined}
            className={`${FIELD_INPUT} ${fieldBorder(error)} min-w-0 flex-1 basis-48`}
          />
          <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
            {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Save
          </button>
        </div>
        {error && (
          <p id="pass-builder-id-error" className={FIELD_ERROR}>
            {error}
          </p>
        )}
        {saved && !missing && (
          <p role="status" className="mt-1 text-[11px] text-[#FDE68A]">
            Saved.
          </p>
        )}
      </form>
      {signupUrl && (
        <a
          href={signupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FBBF24] underline-offset-2 hover:underline"
        >
          Create one
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
