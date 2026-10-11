import React from 'react';
import { TeamMember, TeamCard } from '@/components/cards/TeamCard';

export const TeamSection: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div className="p-8 text-center bg-[#100B18]/60 border border-[#4C2A66]/40 rounded-2xl">
        <p className="text-xs font-mono text-[#A89DB5]">
          Executive student leadership roster is currently being updated.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {members.map((member) => (
        <TeamCard
          key={member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
          member={member}
        />
      ))}
    </div>
  );
};