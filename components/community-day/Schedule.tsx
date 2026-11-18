import { Clock, MapPin, User } from "lucide-react";
import data from "@/content/community-day.json";

interface ScheduleItem {
  time: string;
  title: string;
  type: string;
  speaker: string;
  location?: string;
  description: string;
}

const FLAGSHIP_TYPES = new Set([
  "Keynote",
  "Technical Session",
  "Workshop",
  "Panel Discussion",
]);

export function Schedule() {
  const { schedule } = data as { schedule: ScheduleItem[] };

  return (
    <section
      id="schedule"
      className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28"
    >
      <div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
        <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#FBBF24]">
          Official Event Agenda
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Summit Schedule
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#9E92B0]">
          A continuous timeline from 09:30 AM check-in through 05:00 PM IST at the D Block Auditorium, GCET Campus 1.
        </p>
      </div>

      <div className="relative space-y-6 sm:space-y-8 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-gradient-to-b before:from-[#FBBF24] before:via-[#A855F7] before:to-[#4C2A66]/20 lg:before:left-1/2">
        {schedule.map((item, index) => {
          const isLeft = index % 2 === 0;
          const isFlagship = FLAGSHIP_TYPES.has(item.type);

          return (
            <div
              key={`${item.time}-${index}`}
              className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3 sm:gap-4 lg:grid-cols-[1fr_4rem_1fr] lg:gap-0"
            >
              {/* Timeline Spine Node */}
              <div className="z-10 col-start-1 row-start-1 flex items-center justify-center lg:col-start-2 lg:row-start-1">
                {isFlagship ? (
                  <span className="relative flex size-8 items-center justify-center rounded-full border-2 border-[#FBBF24] bg-[#090511] shadow-[0_0_18px_rgba(251,191,36,0.55)]">
                    <span className="size-2 rounded-full bg-[#FBBF24]" />
                  </span>
                ) : (
                  <span className="relative flex size-7 items-center justify-center rounded-full border border-[#A855F7]/70 bg-[#090511] shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                    <span className="size-1.5 rounded-full bg-[#C4A5FD]" />
                  </span>
                )}
              </div>

              {/* Timeline Card */}
              <article
                className={`group relative col-start-2 row-start-1 overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border bg-[#100B18]/95 p-5 sm:p-7 shadow-[0_16px_55px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(168,85,247,0.15)] ${
                  isFlagship
                    ? "border-[#FBBF24]/50 shadow-[0_0_30px_rgba(251,191,36,0.06)] hover:border-[#FBBF24]/80"
                    : "border-[#4C2A66]/50 hover:border-[#A855F7]/60"
                } ${isLeft ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"} lg:row-start-1`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#A855F7]/10 blur-3xl transition-colors group-hover:bg-[#FBBF24]/10"
                />

                {/* Metadata Pills */}
                <div
                  className={`relative flex flex-wrap items-center gap-2 ${
                    isLeft ? "lg:justify-end" : ""
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FBBF24]/25 bg-[#1B1130] px-3 py-1 font-mono-jb text-[10px] uppercase tracking-wide text-[#FBBF24]">
                    <Clock className="size-3 shrink-0" aria-hidden="true" />
                    <span>{item.time}</span>
                  </span>

                  {item.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4C2A66]/50 bg-[#150D24] px-3 py-1 font-mono-jb text-[10px] text-[#CFC5DC]">
                      <MapPin
                        className="size-3 shrink-0 text-[#FBBF24]"
                        aria-hidden="true"
                      />
                      <span>{item.location}</span>
                    </span>
                  )}

                  <span
                    className={`rounded-full px-3 py-1 font-mono-jb text-[10px] uppercase tracking-wide border ${
                      isFlagship
                        ? "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]"
                        : "border-[#A855F7]/30 bg-[#150D24] text-[#E9D5FF]"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`relative mt-4 text-lg sm:text-xl font-bold text-white leading-snug ${
                    isLeft ? "lg:text-right" : ""
                  }`}
                >
                  {item.title}
                </h3>

                {/* Speaker Attribution */}
                <p
                  className={`relative mt-2 inline-flex items-center gap-1.5 font-mono-jb text-xs text-[#C4A5FD] ${
                    isLeft ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <User className="size-3.5 shrink-0 text-[#A855F7]" aria-hidden="true" />
                  <span>{item.speaker}</span>
                </p>

                {/* Description */}
                <p
                  className={`relative mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#CFC5DC] ${
                    isLeft ? "lg:ml-auto lg:text-right" : ""
                  }`}
                >
                  {item.description}
                </p>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
