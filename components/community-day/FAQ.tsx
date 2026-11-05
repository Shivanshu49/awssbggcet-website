import { ChevronDown, HelpCircle } from "lucide-react";
import data from "@/content/community-day.json";

export function FAQ() {
  const { faqs } = data;

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-28">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Everything You Need to Know
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Common queries regarding passes, seat availability, certificates, and event day guidelines.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all open:border-purple-500/40 open:bg-slate-900/80 backdrop-blur-sm"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-white group-open:text-amber-400 text-sm sm:text-base list-none">
              <span>{faq.question}</span>
              <span className="shrink-0 rounded-full p-1 bg-slate-800 group-open:bg-purple-500/20 group-open:text-purple-300 text-slate-400 transition-transform duration-200 group-open:rotate-180">
                <ChevronDown className="w-4 h-4" />
              </span>
            </summary>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
