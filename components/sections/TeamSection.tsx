'use client';

import React from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/components/cards/TeamCard';

interface TeamSectionProps {
  members?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members = [] }) => {
  if (members.length === 0) {
    return (
      <div className="p-8 text-center bg-[#100B18]/60 border border-[#4C2A66]/40 rounded-2xl">
        <p className="text-xs font-mono text-[#A89DB5]">
          Executive student leadership roster is currently being updated.
        </p>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
            STUDENT LEADERSHIP
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Meet the Core Team
          </h2>
          <p className="text-sm text-[#A89DB5] max-w-xl mx-auto">
            The undergraduate builders leading workshops, hackathons, and community cloud initiatives at GCET.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => {
            return (
              <div
                key={member.name}
                className="group relative rounded-2xl bg-[#100B18] border border-[#4C2A66]/50 p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-amber-400/60 hover:bg-[#140E20] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 mb-4 rounded-full p-1 bg-gradient-to-tr from-purple-500/40 via-amber-400/40 to-transparent group-hover:from-amber-400 group-hover:to-purple-500 transition-all duration-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1224]">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400 font-mono font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                  {member.name}
                </h3>
                
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#211235] text-purple-200 border border-purple-500/30">
                  {member.role}
                </span>

                {member.bio && (
                  <p className="mt-3 text-xs text-[#A89DB5] leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {(member.github || member.linkedin) && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#4C2A66]/30 text-[#A89DB5]">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-400 transition-colors p-1"
                        aria-label="GitHub"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-400 transition-colors p-1"
                        aria-label="LinkedIn"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;