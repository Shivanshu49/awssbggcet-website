import { Cloud, Shield, Cpu, Award } from "lucide-react";
import data from "@/content/community-day.json";

export function About() {
  const { about } = data;

  const PILLARS = [
    {
      icon: Cloud,
      title: "Real-World Architecture",
      desc: "Go beyond theoretical tutorials with production-grade event-driven and serverless system design.",
    },
    {
      icon: Cpu,
      title: "Hands-on Demos",
      desc: "Watch live technical deployments featuring AWS Lambda, DynamoDB, and cloud security frameworks.",
    },
    {
      icon: Shield,
      title: "Enterprise Best Practices",
      desc: "Learn Well-Architected Framework principles, IAM least-privilege policies, and encryption at rest.",
    },
    {
      icon: Award,
      title: "Recognized Certification",
      desc: "Official digital participation certificates and pathway blueprints toward AWS certifications.",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Heading & Story */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold">
            <span>About The Summit</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {about.heading}
          </h2>

          <p className="text-amber-400 font-semibold text-sm sm:text-base">
            {about.subheading}
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {about.description}
          </p>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">Strict Capacity Note:</strong> The GCET Auditorium is capped at <span className="text-amber-400 font-bold">200 verified attendees</span>. Registrations are issued on a first-come, first-served basis.
            </p>
          </div>
        </div>

        {/* Right Column: 4 Pillar Highlights */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
