'use client';

import { useState, useTransition } from 'react';

import { CARD, CARD_TITLE, FIELD_ERROR, FIELD_HINT, FIELD_INPUT, SECONDARY_BUTTON, fieldBorder } from '@/components/registration/field-styles';
import { bulkConfirmByUtr, type BulkConfirmResult } from '@/lib/admin/actions';
import type { Registration } from '@/lib/db/schema';

function UtrList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="font-semibold text-white">
        {title} ({items.length})
      </p>
      <ul className="mt-1 font-mono text-xs break-all text-[#CFC5DC]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function BulkConfirmForm({ statusLabels }: { statusLabels: Record<Registration['status'], string> }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<BulkConfirmResult>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm('Confirm every submitted payment whose UTR is in this list? No emails are sent.')) return;
    startTransition(async () => setResult(await bulkConfirmByUtr(text)));
  };

  return (
    <section aria-labelledby="bulk-heading" className={`${CARD} flex flex-col gap-3`}>
      <h2 id="bulk-heading" className={CARD_TITLE}>
        Bulk confirm by UTR
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          aria-label="UTRs from the bank statement"
          aria-describedby="bulk-hint"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'123456789012\n123456789013, 123456789014'}
          className={`${FIELD_INPUT} ${fieldBorder()} font-mono`}
        />
        <p id="bulk-hint" className={FIELD_HINT}>
          One per line or comma-separated. Sends no emails: use Send QR passes afterwards.
        </p>
        <button type="submit" disabled={isPending} className={`${SECONDARY_BUTTON} self-start`}>
          {isPending ? 'Confirming…' : 'Confirm matches'}
        </button>
      </form>
      <div role="status" className="flex flex-col gap-3 text-sm">
        {result?.error && <p className={FIELD_ERROR}>{result.error}</p>}
        {result && !result.error && (
          <>
            <p className="font-bold text-[#FBBF24]">{result.confirmed} confirmed.</p>
            <UtrList title="Pasted UTRs that matched no one" items={result.unmatched ?? []} />
            <UtrList
              title="Pasted UTRs not awaiting confirmation"
              items={(result.skipped ?? []).map(({ utr, status }) => `${utr} · ${statusLabels[status]}`)}
            />
            <UtrList
              title="Submitted UTRs not in your list"
              items={(result.notInList ?? []).map(({ utr, name }) => `${utr ?? 'no UTR'} · ${name}`)}
            />
          </>
        )}
      </div>
    </section>
  );
}
