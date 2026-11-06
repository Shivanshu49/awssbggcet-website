'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition, type ComponentProps, type FormEvent } from 'react';
import type { z } from 'zod';

import { register } from '@/lib/registration/actions';
import { eventPage } from '@/lib/registration/content';
import {
  MEAL_OPTIONS,
  YEAR_OPTIONS,
  contactSchema,
  detailsSchema,
  firstErrors,
  normalizePhone,
  registrationSchema,
} from '@/lib/registration/validation';

import { CollegeBranchFields, INITIAL_COLLEGE } from './CollegeBranchFields';
import {
  CARD,
  FIELD_ERROR,
  FIELD_HINT,
  FIELD_INPUT,
  FIELD_LABEL,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  fieldBorder,
} from './field-styles';
import { RegistrationSteps, STEP_LABELS } from './RegistrationSteps';
import { SeatCounter } from './SeatCounter';
import { Turnstile } from './Turnstile';

const STEP_DESCRIPTIONS = ["Tell us who's coming.", "We'll email your pass link to this address."];
const DETAILS_FIELDS = Object.keys(detailsSchema.shape);

const errorsFor = (schema: z.ZodType, values: unknown) => {
  const result = schema.safeParse(values);
  return result.success ? {} : firstErrors(result.error);
};

function Field({
  id,
  label,
  error,
  hint,
  className = '',
  ...input
}: ComponentProps<'input'> & { id: string; label: string; error?: string; hint?: string }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ');
  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={`${FIELD_INPUT} ${fieldBorder(error)} ${className}`}
        {...input}
      />
      {error && (
        <p id={`${id}-error`} className={FIELD_ERROR}>
          {error}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className={FIELD_HINT}>
          {hint}
        </p>
      )}
    </div>
  );
}

// Native radios (visually hidden) give arrow keys, Space and screen-reader "2 of 5" for free.
function PillRadios({
  name,
  label,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <p id={`${name}-label`} className={FIELD_LABEL}>
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        tabIndex={-1}
        className="grid grid-cols-[repeat(auto-fit,minmax(3rem,1fr))] gap-2 rounded-xl outline-none"
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-1 py-2.5 text-center text-xs font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FBBF24] ${
              value === option.value
                ? 'border-[#FBBF24] bg-[#FBBF24] text-[#090511]'
                : `${fieldBorder(error)} bg-[#1A0E2A]/70 text-[#CFC5DC] hover:border-[#FBBF24]/60 hover:text-white`
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className={FIELD_ERROR}>
          {error}
        </p>
      )}
    </div>
  );
}

export function RegistrationForm() {
  // React state only: no browser storage for personal data.
  const [values, setValues] = useState({
    name: '',
    college: INITIAL_COLLEGE,
    branch: '',
    yearOfStudy: '',
    mealPref: '',
    builderId: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [attempted, setAttempted] = useState({ 1: false, 2: false });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [token, setToken] = useState('');
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [focusRequest, setFocusRequest] = useState(0);
  const [isPending, startTransition] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  // Nothing shows before the first Next or Submit; after that it updates live.
  const errors: Record<string, string> = {
    ...serverErrors,
    ...(attempted[1] ? errorsFor(detailsSchema, values) : {}),
    ...(attempted[2] ? errorsFor(contactSchema, values) : {}),
  };

  const update = (field: keyof typeof values, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    setServerErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    form.current?.querySelector<HTMLElement>('input, button')?.focus();
  }, [step]);

  // Runs after the step effect, so a server error sent back to step 1 wins the focus.
  useEffect(() => {
    if (focusRequest) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [focusRequest]);

  const focusFirstInvalid = () => setFocusRequest((n) => n + 1);

  const goToStep2 = () => {
    setAttempted((current) => ({ ...current, 1: true }));
    if (detailsSchema.safeParse(values).success) setStep(2);
    else focusFirstInvalid();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    if (step === 1) return goToStep2();

    setAttempted({ 1: true, 2: true });
    setFormError('');
    setNotice('');
    if (!registrationSchema.safeParse(values).success) return focusFirstInvalid();
    if (!token) {
      setFormError('Please wait for the verification above to finish, then try again.');
      return;
    }

    startTransition(async () => {
      const result = await register(values, token); // On success this redirects to the pass page.
      setTurnstileReset((n) => n + 1);
      if (result.notice) setNotice(result.notice);
      if (result.formError) setFormError(result.formError);
      if (result.fieldErrors) {
        setServerErrors(result.fieldErrors);
        if (Object.keys(result.fieldErrors).some((field) => DETAILS_FIELDS.includes(field))) setStep(1);
        focusFirstInvalid();
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <p className="mb-3 text-sm text-[#E9D5FF]">
        Registration fee: <strong className="text-[#FBBF24]">₹{eventPage.registration.fee}</strong>
      </p>
      <SeatCounter />

      <form ref={form} onSubmit={handleSubmit} noValidate aria-busy={isPending} className={`${CARD} flex flex-col gap-5 sm:p-10`}>
        <RegistrationSteps states={STEP_LABELS.map((_, i) => (i + 1 < step ? 'done' : i + 1 === step ? 'current' : 'upcoming'))} />

        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">{STEP_LABELS[step - 1]}</h2>
          <p className="mt-1 text-sm text-[#CFC5DC]">{STEP_DESCRIPTIONS[step - 1]}</p>
        </div>

        {step === 1 ? (
          <>
            <Field
              id="name"
              label="Full name *"
              autoComplete="name"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              error={errors.name}
            />
            <CollegeBranchFields
              college={values.college}
              branch={values.branch}
              onCollegeChange={(value) => update('college', value)}
              onBranchChange={(value) => update('branch', value)}
              collegeError={errors.college}
              branchError={errors.branch}
            />
            <PillRadios
              name="yearOfStudy"
              label="Year of study *"
              options={YEAR_OPTIONS}
              value={values.yearOfStudy}
              onChange={(value) => update('yearOfStudy', value)}
              error={errors.yearOfStudy}
            />
            {eventPage.registration.collectMeal && (
              <PillRadios
                name="mealPref"
                label="Meal preference *"
                options={MEAL_OPTIONS}
                value={values.mealPref}
                onChange={(value) => update('mealPref', value)}
                error={errors.mealPref}
              />
            )}
            <Field
              id="builderId"
              label="AWS Builder ID"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={values.builderId}
              onChange={(e) => update('builderId', e.target.value)}
              error={errors.builderId}
              hint="Don't have one yet? Add it on your pass page within 48 hours of getting a seat — your pass can't be issued without it."
            />
            <div className="flex justify-end border-t border-[#4C2A66]/40 pt-6">
              <button type="submit" className={PRIMARY_BUTTON}>
                Next
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Field
              id="email"
              label="Email *"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              error={errors.email}
            />
            <div>
              <label htmlFor="phone" className={FIELD_LABEL}>
                Mobile number *
              </label>
              <div className="flex items-stretch gap-2">
                <span className="flex items-center rounded-xl border border-[#4C2A66]/60 bg-[#150D24] px-3 text-sm text-[#CFC5DC]">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={16}
                  value={values.phone}
                  onChange={(e) => update('phone', normalizePhone(e.target.value))}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error phone-hint' : 'phone-hint'}
                  className={`${FIELD_INPUT} ${fieldBorder(errors.phone)}`}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className={FIELD_ERROR}>
                  {errors.phone}
                </p>
              )}
              <p id="phone-hint" className={FIELD_HINT}>
                10 digits, no country code — we add +91.
              </p>
            </div>
            <p className="text-xs leading-relaxed text-[#A89DB5]">
              Once your payment is confirmed, your QR pass is generated from 17 November: it appears on your pass
              page and arrives by email. There&apos;s no need to register twice.
            </p>
            <div>
              <label className="flex items-start gap-2.5 text-xs leading-relaxed text-[#CFC5DC]">
                <input
                  id="consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                  className="mt-0.5 size-4 shrink-0 accent-[#FBBF24]"
                />
                <span>
                  I am 18 or older and accept the{' '}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] underline-offset-2 hover:underline">
                    Privacy Notice
                  </a>{' '}
                  and{' '}
                  <a href="/event-policies" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] underline-offset-2 hover:underline">
                    Event Policies
                  </a>
                  .
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className={FIELD_ERROR}>
                  {errors.consent}
                </p>
              )}
            </div>
            <Turnstile onToken={setToken} resetSignal={turnstileReset} />
            {notice && (
              <p role="status" className="rounded-xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-4 py-3 text-sm text-[#FDE68A]">
                {notice}
              </p>
            )}
            {formError && (
              <p role="alert" className="rounded-xl border border-red-500/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {formError}
              </p>
            )}
            <div className="flex flex-wrap justify-between gap-3 border-t border-[#4C2A66]/40 pt-6">
              <button type="button" onClick={() => setStep(1)} disabled={isPending} className={SECONDARY_BUTTON}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </button>
              <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {isPending ? 'Sending' : 'Register & continue to payment'}
              </button>
            </div>
            <p className={`${FIELD_HINT} -mt-3 sm:text-right`}>
              Next: add your AWS Builder ID and pay ₹{eventPage.registration.fee} on your pass page.
            </p>
          </>
        )}
      </form>

      <p className="mt-4 text-center text-xs text-[#A89DB5]">
        Already registered?{' '}
        <Link href="/pass" className="font-semibold text-[#FBBF24] underline-offset-2 hover:underline">
          Find my pass
        </Link>
        .
      </p>
    </div>
  );
}
