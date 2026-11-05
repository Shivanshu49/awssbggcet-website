import { Check } from 'lucide-react';

import type { StepState } from '@/lib/registration/format';

export const STEP_LABELS = ['Your details', 'Contact & confirm', 'Payment'];

export function RegistrationSteps({ states }: { states: StepState[] }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Registration steps">
      {STEP_LABELS.map((label, index) => {
        const state = states[index];
        const active = state !== 'upcoming';
        return (
          <li
            key={label}
            aria-current={state === 'current' ? 'step' : undefined}
            className={`flex min-w-0 items-center gap-2 text-xs font-semibold not-last:flex-1 ${active ? 'text-[#FBBF24]' : 'text-[#A89DB5]'}`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                active ? 'border-[#FBBF24] bg-[#FBBF24] text-[#090511]' : 'border-[#4C2A66]/60 bg-[#150D24]'
              }`}
            >
              {state === 'done' ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            {label}
            {index < STEP_LABELS.length - 1 && <span aria-hidden="true" className="ml-1 hidden h-px min-w-4 flex-1 bg-[#4C2A66]/70 sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
