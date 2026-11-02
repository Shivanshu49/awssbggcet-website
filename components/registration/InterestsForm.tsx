'use client';

import { Loader2 } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { saveInterests } from '@/lib/registration/actions';
import { NONE_OF_THE_ABOVE } from '@/lib/registration/validation';

import { CARD, CARD_TITLE, FIELD_ERROR, FIELD_INPUT, FIELD_LABEL, PRIMARY_BUTTON, fieldBorder } from './field-styles';

export function InterestsForm({
  code,
  workshops,
  initialInterests,
  initialNote,
  editable,
}: {
  code: string;
  workshops: string[];
  initialInterests: string[];
  initialNote: string | null;
  editable: boolean;
}) {
  const [interested, setInterested] = useState(initialInterests.length > 0 || Boolean(initialNote));
  const [selected, setSelected] = useState(initialInterests);
  const [note, setNote] = useState(initialNote ?? '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggle = (item: string, checked: boolean) => {
    setSaved(false);
    setSelected((current) => {
      if (item === NONE_OF_THE_ABOVE) return checked ? [NONE_OF_THE_ABOVE] : [];
      const rest = current.filter((value) => value !== item && value !== NONE_OF_THE_ABOVE);
      return checked ? [...rest, item] : rest;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setSaved(false);
    startTransition(async () => {
      const result = await saveInterests(code, {
        interests: interested ? selected : [],
        note: interested ? note : '',
      });
      setError(result.error ?? '');
      setSaved(!result.error);
    });
  };

  const options = [
    ...workshops.map((label) => ({ value: label, label })),
    { value: NONE_OF_THE_ABOVE, label: 'None of the above' },
  ];

  return (
    <section aria-labelledby="interests-heading" className={CARD}>
      <h2 id="interests-heading" className={CARD_TITLE}>
        Workshop interests
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <fieldset disabled={!editable} className="contents">
          <label className="flex items-center gap-2.5 text-sm text-[#CFC5DC]">
            <input
              type="checkbox"
              role="switch"
              checked={interested}
              onChange={(e) => {
                setInterested(e.target.checked);
                setSaved(false);
              }}
              className="size-4 accent-[#FBBF24]"
            />
            I&apos;d like to attend workshops
          </label>
          {interested && (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2.5 rounded-xl border border-[#4C2A66]/60 bg-[#1A0E2A]/70 px-3 py-2.5 text-xs text-[#E2D9F3]"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(value)}
                      onChange={(e) => toggle(value, e.target.checked)}
                      className="size-4 shrink-0 accent-[#FBBF24]"
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div>
                <label htmlFor="interests-note" className={FIELD_LABEL}>
                  Anything else you&apos;d like to learn?
                </label>
                <textarea
                  id="interests-note"
                  rows={3}
                  maxLength={500}
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    setSaved(false);
                  }}
                  className={`${FIELD_INPUT} ${fieldBorder()}`}
                />
              </div>
            </>
          )}
          {editable && (
            <div className="flex items-center justify-end gap-3">
              {saved && (
                <p role="status" className="text-xs text-[#FDE68A]">
                  Saved.
                </p>
              )}
              <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                Save
              </button>
            </div>
          )}
        </fieldset>
        {error && (
          <p role="alert" className={FIELD_ERROR}>
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
