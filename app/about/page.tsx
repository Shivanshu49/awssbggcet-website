import React from 'react';
import { VisionSection } from '@/components/sections/VisionSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { TeamMember } from '@/components/cards/TeamCard';
import { MentorsRow, MentorItem } from '@/components/sections/MentorsRow';
import team from '@/content/team.json';

export const metadata = {
  title: 'About | AWS Student Builder Group GCET',
  description: 'Learn about our mission, student leadership, and mentors driving cloud builders at GCET.',
};

export default function AboutPage() {
  const teamMembers: TeamMember[] = team;
  const mentors: MentorItem[] = [];

  return (
    <div className="min-h-screen bg-[#08060D] text-[#F8FAFC] py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#171020] border border-purple-400/30 mb-4 shadow-[0_0_12px_rgba(192,132,252,0.15)]">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-xs font-mono text-purple-200">
              GCET Student Chapter
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            About the Builder Group
          </h1>
          <p className="text-xs sm:text-sm text-[#A89DB5] leading-relaxed">
            Empowering students across all years to build, architect, and deploy production-grade
            cloud solutions on AWS.
          </p>
        </div>

        {/* Mission, Vision & 5-Step Journey */}
        <VisionSection />

        {/* Core Team Roster */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
              Leadership
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Core Team</h2>
          </div>
          <TeamSection members={teamMembers} />
        </div>

        {/* Faculty & Industry Mentors */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">
              Advisors
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">Faculty & Industry Mentors</h2>
          </div>
          <MentorsRow mentors={mentors} />
        </div>
      </div>
    </div>
  );
}