import React from 'react';
import { Target, Compass, BookOpen, Wrench, Trophy, Network, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const VisionSection: React.FC = () => {
  const journeyPillars = [
    {
      step: '01',
      title: 'LEARN',
      desc: 'Master foundational cloud architecture, IAM, and DevOps tools.',
      icon: BookOpen,
    },
    {
      step: '02',
      title: 'BUILD',
      desc: 'Form teams and implement production-ready serverless architectures.',
      icon: Wrench,
    },
    {
      step: '03',
      title: 'COMPETE',
      desc: 'Participate in collegiate hackathons and regional cloud sprints.',
      icon: Trophy,
    },
    {
      step: '04',
      title: 'CONNECT',
      desc: 'Engage with AWS Solutions Architects, alumni, and tech leaders.',
      icon: Network,
    },
    {
      step: '05',
      title: 'LEAD',
      desc: 'Publish open solutions, lead workshops, and mentor peer builders.',
      icon: UserCheck,
    },
  ];

  return (
    <section className="space-y-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 rounded-3xl bg-[#100B18] border border-[#4C2A66]/50">
          <div className="w-10 h-10 rounded-2xl bg-[#171020] border border-amber-300/40 flex items-center justify-center text-amber-300 mb-5">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
          <p className="text-xs sm:text-sm text-[#A89DB5] leading-relaxed">
            To provide students at Galgotias College of Engineering & Technology with accessible,
            hands-on exposure to cloud architecture and emerging technologies, fostering
            a culture of building, experimentation, and industry alignment.
          </p>
        </Card>

        <Card className="p-8 rounded-3xl bg-[#100B18] border border-[#4C2A66]/50">
          <div className="w-10 h-10 rounded-2xl bg-[#171020] border border-purple-400/40 flex items-center justify-center text-purple-300 mb-5">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
          <p className="text-xs sm:text-sm text-[#A89DB5] leading-relaxed">
            To establish GCET as a recognized student hub for technical leadership,
            where students graduate with practical experience deploying production-ready
            cloud solutions.
          </p>
        </Card>
      </div>

      <div>
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
            The Builder Pathway
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            How Students Progress in the Group
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {journeyPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.step}
                className="p-5 rounded-2xl bg-[#100B18] border border-[#4C2A66]/50 hover:border-amber-300/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-amber-300/90 mb-2">
                    {pillar.step}
                  </div>
                  <Icon className="w-5 h-5 text-purple-300 mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#A89DB5] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};