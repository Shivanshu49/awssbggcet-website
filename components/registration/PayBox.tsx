'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition, type FormEvent } from 'react';

import { submitPayment } from '@/lib/registration/actions';
import { firstErrors, paymentSchema } from '@/lib/registration/validation';

import { CARD, CARD_TITLE, FIELD_ERROR, FIELD_INPUT, FIELD_LABEL, PRIMARY_BUTTON, fieldBorder } from './field-styles';

export function PayBox({ code, fee, upiId, upiQr }: { code: string; fee: number; upiId: string; upiQr: string }) {
  const [utr, setUtr] = useState('');
  const [payerName, setPayerName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Nowhere to pay yet, so no form: any UTR entered here could only be made up.
  if (!upiId && !upiQr) {
    return (
      <section aria-labelledby="pay-heading" className={CARD}>
        <h2 id="pay-heading" className={CARD_TITLE}>
          Pay ₹{fee}
        </h2>
        <p className="mt-2 text-sm text-[#CFC5DC]">Payment details will appear here soon.</p>
      </section>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    const parsed = paymentSchema.safeParse({ utr, payerName });
    if (!parsed.success) {
      const next = firstErrors(parsed.error);
      setErrors(next);
      document.getElementById(next.utr ? 'pay-utr' : 'pay-name')?.focus();
      return;
    }
    setErrors({});
    startTransition(async () => {
      const result = await submitPayment(code, { utr, payerName });
      setErrors({ ...result.fieldErrors, ...(result.formError && { form: result.formError }) });
    });
  };

  return (
    <section aria-labelledby="pay-heading" className={`${CARD} border-[#FBBF24]/60 shadow-[0_0_24px_rgba(251,191,36,0.12)]`}>
      <h2 id="pay-heading" className={CARD_TITLE}>
        Pay ₹{fee}
      </h2>
      <p className="mt-1 text-sm text-[#CFC5DC]">
        Pay exactly ₹{fee} to the club&apos;s UPI, then enter the UTR from your UPI app.
      </p>

      <div className="mt-4 flex flex-col items-center gap-3 text-center">
        {upiQr && (
          <Image
            src={upiQr}
            alt="Club UPI QR code"
            width={224}
            height={224}
            unoptimized
            className="rounded-xl bg-white p-2"
          />
        )}
        {upiId && (
          <p className="text-sm text-[#CFC5DC]">
            UPI ID: <span className="font-mono break-all text-[#FBBF24] select-all">{upiId}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="pay-utr" className={FIELD_LABEL}>
            UTR (12 digits)
          </label>
          <input
            id="pay-utr"
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value);
              setErrors((prev) => ({ ...prev, utr: '' }));
            }}
            aria-invalid={Boolean(errors.utr)}
            aria-describedby={errors.utr ? 'pay-utr-error' : undefined}
            className={`${FIELD_INPUT} ${fieldBorder(errors.utr)} font-mono`}
          />
          {errors.utr && (
            <p id="pay-utr-error" className={FIELD_ERROR}>
              {errors.utr}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pay-name" className={FIELD_LABEL}>
            Name on your UPI account
          </label>
          <input
            id="pay-name"
            autoComplete="name"
            value={payerName}
            onChange={(e) => {
              setPayerName(e.target.value);
              setErrors((prev) => ({ ...prev, payerName: '' }));
            }}
            aria-invalid={Boolean(errors.payerName)}
            aria-describedby={errors.payerName ? 'pay-name-error' : undefined}
            className={`${FIELD_INPUT} ${fieldBorder(errors.payerName)}`}
          />
          {errors.payerName && (
            <p id="pay-name-error" className={FIELD_ERROR}>
              {errors.payerName}
            </p>
          )}
        </div>
        {errors.form && (
          <p role="alert" className={FIELD_ERROR}>
            {errors.form}
          </p>
        )}
        <button type="submit" disabled={isPending} className={`${PRIMARY_BUTTON} self-start`}>
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Submit payment
        </button>
      </form>
    </section>
  );
}
