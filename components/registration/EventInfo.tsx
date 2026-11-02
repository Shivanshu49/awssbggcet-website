import { eventPage } from '@/lib/registration/content';

import { CARD, CARD_TITLE } from './field-styles';

// Both return nothing while the content file has no entries: no placeholder text on the live site.
export function EventSchedule({ className = '' }: { className?: string }) {
  if (!eventPage.schedule.length) return null;
  return (
    <section aria-labelledby="schedule-heading" className={`${CARD} ${className}`}>
      <h2 id="schedule-heading" className={CARD_TITLE}>
        Event schedule
      </h2>
      <ol className="mt-4 flex flex-col gap-3">
        {eventPage.schedule.map(({ time, title }) => (
          <li key={`${time}-${title}`} className="flex gap-3 text-sm">
            <span className="w-14 shrink-0 font-mono text-xs leading-5 text-[#FBBF24]">{time}</span>
            <span className="text-[#CFC5DC]">{title}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function EventFaq({ className = '' }: { className?: string }) {
  if (!eventPage.faqs.length) return null;
  return (
    <section aria-labelledby="faq-heading" className={className}>
      <h2 id="faq-heading" className={CARD_TITLE}>
        FAQ
      </h2>
      <div className="mt-4 flex flex-col gap-3">
        {eventPage.faqs.map(({ q, a }) => (
          <details key={q} className="group rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-4 open:border-[#FBBF24]/40">
            <summary className="cursor-pointer text-sm font-semibold text-white group-open:text-[#FBBF24]">{q}</summary>
            <p className="mt-2.5 text-sm leading-relaxed text-[#CFC5DC]">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
