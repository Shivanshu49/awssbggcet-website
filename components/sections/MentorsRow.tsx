import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export interface MentorItem {
  id: string;
  name: string;
  designation: string;
  affiliation?: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export const MentorsRow: React.FC<{ mentors: MentorItem[] }> = ({ mentors }) => {
  if (!mentors || mentors.length === 0) {
    return (
      <div className="p-8 text-center bg-[#100B18]/60 border border-[#4C2A66]/40 rounded-2xl">
        <p className="text-xs font-mono text-[#A89DB5]">
          Mentor details will be announced for the upcoming semester.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <Card
          key={mentor.id}
          className="p-6 rounded-2xl bg-[#100B18] border border-[#4C2A66]/50 flex items-center space-x-4 hover:border-amber-300/50 transition-all"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#171020] border border-purple-900/50 shrink-0">
            {mentor.photoUrl ? (
              <Image
                src={mentor.photoUrl}
                alt={mentor.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-purple-300/40">
                Mentor
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#F8FAFC] truncate">
              {mentor.name}
            </h3>
            <p className="text-xs font-mono text-amber-300/90 truncate">
              {mentor.designation}
            </p>
            {mentor.affiliation && (
              <p className="text-[11px] text-[#A89DB5] truncate">
                {mentor.affiliation}
              </p>
            )}
            {mentor.linkedinUrl && (
              <a
                href={mentor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${mentor.name} LinkedIn`}
                className="inline-block mt-2 text-[#A89DB5] hover:text-amber-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};