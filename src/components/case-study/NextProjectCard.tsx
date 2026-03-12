import { projects } from '../../data/projects';
import { useViewStore } from '../../store/useViewStore';

export interface NextProjectCardProps {
  projectId: string;
}

export function NextProjectCard({ projectId }: NextProjectCardProps) {
  const currentIndex = projects.findIndex((p) => p.id === projectId);
  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  const handleClick = () => {
    useViewStore.getState().openCase(nextProject.id);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full py-16 md:py-24 cursor-pointer group text-center"
      aria-label={`Voir le projet ${nextProject.title1} ${nextProject.title2}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-text-secondary mb-6 block">
        Projet suivant
      </span>

      <div className="flex items-baseline justify-center gap-4">
        <h3
          className="text-4xl md:text-6xl lg:text-7xl font-bold transition-colors duration-300"
          style={{ color: nextProject.colors.accent }}
        >
          {nextProject.title1} {nextProject.title2}
        </h3>
        <svg
          className="w-6 h-6 md:w-8 md:h-8 shrink-0 transition-transform duration-300 group-hover:translate-x-2"
          style={{ color: nextProject.colors.accent }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-text-secondary font-mono">
        <span>{nextProject.category}</span>
        <span className="w-1 h-1 rounded-full bg-text-secondary/40" />
        <span>{nextProject.year}</span>
      </div>

      {/* Subtle divider line with accent gradient */}
      <div
        className="mx-auto mt-8 h-px w-1/2 opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${nextProject.colors.accent}, transparent)`,
        }}
      />
    </button>
  );
}
