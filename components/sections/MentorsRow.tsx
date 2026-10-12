'use client';

import React from 'react';

export interface MentorItem {
  id?: string;
  name: string;
  role: string;
  organization?: string;
  bio?: string;
  avatar?: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

interface MentorsRowProps {
  mentors?: MentorItem[];
}

const DEFAULT_MENTORS: MentorItem[] = [
  {
    name: 'AWS Community Advocate',
    role: 'Sr. Solutions Architect',
    organization: 'Amazon Web Services',
    bio: 'Advising GCET student builders on enterprise architectures, cloud scalability, and certifications.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    linkedinUrl: '#'
  },
  {
    name: 'Faculty Mentor',
    role: 'Professor & Head of Cloud Labs',
    organization: 'GCET Greater Noida',
    bio: 'Guiding student research, lab access, and university-wide hackathons.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    linkedinUrl: '#'
  }
];

export const MentorsRow: React.FC<MentorsRowProps> = ({ mentors = [] }) => {
  const displayMentors = mentors && mentors.length > 0 ? mentors : DEFAULT_MENTORS;

  return (
    <section className="py-12 sm:py-16 border-t border-[#4C2A66]/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
            COMMUNITY ADVISORS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mentors & Industry Guides
          </h2>
          <p className="text-sm text-[#A89DB5] max-w-xl mx-auto">
            Experienced AWS architects and GCET faculty helping students bridge academia with industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayMentors.map((mentor, index) => {
            const photoSrc = mentor.avatar || mentor.imageUrl;

            return (
              <div
                key={mentor.id || index}
                className="group relative rounded-2xl bg-[#100B18] border border-[#4C2A66]/50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 transition-all duration-300 hover:border-amber-400/60 hover:bg-[#140E20] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1"
              >
                <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-purple-500/40 via-amber-400/40 to-transparent group-hover:from-amber-400 group-hover:to-purple-500 transition-all duration-500 shrink-0">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-[#1a1224]">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={mentor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-400 font-mono font-bold text-xl">
                        {mentor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                      {mentor.name}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                      <span className="text-[11px] font-mono font-semibold text-purple-200">
                        {mentor.role}
                      </span>
                      {mentor.organization && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#1F142D] border border-amber-400/30 text-amber-300">
                          {mentor.organization}
                        </span>
                      )}
                    </div>
                  </div>

                  {mentor.bio && (
                    <p className="text-xs text-[#A89DB5] leading-relaxed">
                      {mentor.bio}
                    </p>
                  )}

                  {mentor.linkedinUrl && (
                    <div className="pt-2">
                      <a
                        href={mentor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-purple-300 hover:text-amber-300 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span>Connect on LinkedIn</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MentorsRow;