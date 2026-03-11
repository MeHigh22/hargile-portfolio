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
    <div className="w-screen relative left-1/2 -translate-x-1/2">
      <button
        onClick={handleClick}
        className="relative w-full min-h-[300px] md:min-h-[400px] overflow-hidden cursor-pointer group block"
        aria-label={`Voir le projet ${nextProject.title1} ${nextProject.title2}`}
      >
        {/* Background image */}
        <img
          src={nextProject.heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${nextProject.colors.gradientFrom} 60%, transparent) 0%, color-mix(in srgb, ${nextProject.colors.gradientTo} 75%, transparent) 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full min-h-[300px] md:min-h-[400px] p-8 md:p-12">
          <span className="font-mono text-xs uppercase tracking-wider text-white/70 mb-3">
            Projet suivant
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              {nextProject.title1} {nextProject.title2}
            </h3>
            <p className="font-mono text-sm text-white/70">{nextProject.category}</p>
          </div>
        </div>
      </button>
    </div>
  );
}
