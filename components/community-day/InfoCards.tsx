import { Ticket, Users, Layers, Award } from "lucide-react";
import data from "@/content/community-day.json";

const ICON_MAP = {
  Ticket,
  Users,
  Layers,
  Award,
};

export function InfoCards() {
  const { infoCards } = data;

  return (
    <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {infoCards.map((card) => {
          const Icon = ICON_MAP[card.icon as keyof typeof ICON_MAP] || Ticket;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 flex flex-col justify-between hover:border-amber-400/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.1)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    {card.value}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
