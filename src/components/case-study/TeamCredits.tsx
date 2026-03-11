import type { CaseStudyTeamMember } from '../../data/types';

export interface TeamCreditsProps {
  team: CaseStudyTeamMember[];
}

export function TeamCredits({ team }: TeamCreditsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {team.map((member) => (
        <div
          key={member.name}
          className="border border-border rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-text-primary truncate">{member.name}</span>
            <span className="text-sm text-text-secondary truncate">{member.role}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
