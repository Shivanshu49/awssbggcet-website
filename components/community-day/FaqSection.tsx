'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqItem[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="relative scroll-mt-24 border-t border-[#4C2A66]/30 bg-[#090511] py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#A855F7]/40 bg-[#A855F7]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#E9D5FF]">
            <HelpCircle className="size-3.5 text-[#FBBF24]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-[#CFC5DC] sm:text-base">
            Common questions regarding registration, eligibility, tickets, and event day preparation.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#4C2A66]/50 bg-[#120B1D]/80 backdrop-blur-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-white sm:text-base">
                    {faq.question}
                  </span>
                  <div
                    className={`ml-4 flex size-7 shrink-0 items-center justify-center rounded-full border border-[#4C2A66] bg-[#1A112B] text-[#CFC5DC] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#FBBF24] border-[#FBBF24]/50' : ''
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#4C2A66]/30 px-5 pt-3 pb-5">
                    <p className="text-xs leading-relaxed text-[#CFC5DC] sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

