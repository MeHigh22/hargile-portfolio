import { forwardRef } from 'react';
import type { ProjectData } from '../../data/types';

interface SlideProps {
  project: ProjectData;
  index: number;
}

export const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ project, index }, ref) => {
    const techItems = project.tech.split(',').map((t) => t.trim());
    const imgLoading = index <= 1 ? 'eager' : 'lazy';

    return (
      <div
        ref={ref}
        data-index={index}
        className="slide absolute inset-0 h-screen w-full overflow-hidden"
      >
        {/* Desktop: CSS Grid split layout | Mobile: stacked with overlay */}
        <div className="h-full md:grid md:grid-cols-[45fr_55fr]">
          {/* Content panel */}
          <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16">
            {/* Mobile: gradient scrim over hero background */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent md:hidden" />

            <div className="relative z-10 mt-auto pb-12 md:mt-0 md:pb-0">
              {/* Category */}
              <span
                data-anim="category"
                className="font-mono text-sm tracking-widest text-text-secondary uppercase mb-4 block"
              >
                {project.category}
              </span>

              {/* Title */}
              <div data-anim="title">
                <h2 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold text-text leading-none">
                  {project.title1}
                </h2>
                <h2 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold text-accent leading-none mt-1">
                  {project.title2}
                </h2>
              </div>

              {/* Narrative sections */}
              <div data-anim="narrative" className="mt-6 space-y-4 max-w-xl">
                <div>
                  <span className="font-mono text-xs uppercase text-accent tracking-wider">
                    Probleme
                  </span>
                  <p className="text-text-secondary text-sm mt-1">
                    {project.narrative.problem}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-accent tracking-wider">
                    Solution
                  </span>
                  <p className="text-text-secondary text-sm mt-1">
                    {project.narrative.solution}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase text-accent tracking-wider">
                    Resultat
                  </span>
                  <p className="text-text-secondary text-sm mt-1">
                    {project.narrative.outcome}
                  </p>
                </div>
              </div>

              {/* Metadata tags */}
              <div data-anim="tags" className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full px-3 py-1 text-xs bg-accent/10 text-accent border border-accent/20">
                  {project.industry}
                </span>
                {techItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full px-3 py-1 text-xs bg-accent/10 text-accent border border-accent/20"
                  >
                    {item}
                  </span>
                ))}
                <span className="rounded-full px-3 py-1 text-xs bg-accent/10 text-accent border border-accent/20">
                  {project.year}
                </span>
              </div>
            </div>
          </div>

          {/* Hero image panel */}
          <div data-anim="hero" className="absolute inset-0 md:relative md:inset-auto -z-0 md:z-0 overflow-hidden">
            <picture>
              <source
                type="image/webp"
                srcSet={`${project.heroImg}&fm=webp&w=640 640w, ${project.heroImg}&fm=webp&w=1280 1280w, ${project.heroImg}&fm=webp&w=1920 1920w`}
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <source
                type="image/jpeg"
                srcSet={`${project.heroImg}&w=640 640w, ${project.heroImg}&w=1280 1280w, ${project.heroImg}&w=1920 1920w`}
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <img
                src={project.heroImg}
                alt={`${project.title1} ${project.title2}`}
                loading={imgLoading}
                className="h-full w-full object-cover scale-[1.05]"
                data-parallax
              />
            </picture>
          </div>
        </div>
      </div>
    );
  }
);
