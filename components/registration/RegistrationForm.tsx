'use client';

import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
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
import { SeatCounter } from './SeatCounter';
import { Turnstile } from './Turnstile';

const STEPS = ['Your details', 'Contact & confirm'];
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
    form.current?.querySelector<HTMLElement>('input, select, button')?.focus();
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
    <div className="mx-auto w-full max-w-xl text-left">
      <SeatCounter />

      <ol className="mb-6 flex items-center gap-3" aria-label="Registration steps">
        {STEPS.map((label, index) => {
          const number = index + 1;
          const done = number < step;
          const current = number === step;
          return (
            <li
              key={label}
              aria-current={current ? 'step' : undefined}
              className={`flex items-center gap-2 text-xs font-semibold ${current || done ? 'text-[#FBBF24]' : 'text-[#A89DB5]'}`}
            >
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                  current || done
                    ? 'border-[#FBBF24] bg-[#FBBF24] text-[#090511]'
                    : 'border-[#4C2A66]/60 bg-[#150D24]'
                }`}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : number}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <form ref={form} onSubmit={handleSubmit} noValidate aria-busy={isPending} className={`${CARD} flex flex-col gap-5`}>
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
            <div>
              <label htmlFor="yearOfStudy" className={FIELD_LABEL}>
                Year of study *
              </label>
              <select
                id="yearOfStudy"
                value={values.yearOfStudy}
                onChange={(e) => update('yearOfStudy', e.target.value)}
                aria-invalid={Boolean(errors.yearOfStudy)}
                aria-describedby={errors.yearOfStudy ? 'yearOfStudy-error' : undefined}
                className={`${FIELD_INPUT} ${fieldBorder(errors.yearOfStudy)}`}
              >
                <option value="" className="bg-[#140C20]">
                  Select your year
                </option>
                {YEAR_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value} className="bg-[#140C20]">
                    {label}
                  </option>
                ))}
              </select>
              {errors.yearOfStudy && (
                <p id="yearOfStudy-error" className={FIELD_ERROR}>
                  {errors.yearOfStudy}
                </p>
              )}
            </div>
            {eventPage.registration.collectMeal && (
              <div>
                <p id="meal-label" className={FIELD_LABEL}>
                  Meal preference *
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="meal-label"
                  aria-invalid={Boolean(errors.mealPref)}
                  aria-describedby={errors.mealPref ? 'meal-error' : undefined}
                  tabIndex={-1}
                  className="flex flex-wrap gap-2 rounded-xl outline-none"
                >
                  {MEAL_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FBBF24] ${
                        values.mealPref === value
                          ? 'border-[#FBBF24] bg-[#FBBF24]/15 text-[#FBBF24]'
                          : `${fieldBorder(errors.mealPref)} bg-[#1A0E2A]/70 text-[#CFC5DC]`
                      }`}
                    >
                      <input
                        type="radio"
                        name="mealPref"
                        value={value}
                        checked={values.mealPref === value}
                        onChange={() => update('mealPref', value)}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {errors.mealPref && (
                  <p id="meal-error" className={FIELD_ERROR}>
                    {errors.mealPref}
                  </p>
                )}
              </div>
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
              hint="Don't have one yet? Add it later on your pass page — your pass can't be issued without it."
            />
            <button type="submit" className={`${PRIMARY_BUTTON} self-end`}>
              Next
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
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
                  maxLength={10}
                  value={values.phone}
                  onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`${FIELD_INPUT} ${fieldBorder(errors.phone)}`}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className={FIELD_ERROR}>
                  {errors.phone}
                </p>
              )}
            </div>
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
            <div className="flex flex-wrap justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} disabled={isPending} className={SECONDARY_BUTTON}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </button>
              <button type="submit" disabled={isPending} className={PRIMARY_BUTTON}>
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {isPending ? 'Sending' : 'Register'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
