import { forwardRef } from 'react';
import type { ProjectData } from '../../data/types';

interface CaseStudyHeroProps {
  project: ProjectData;
}

export const CaseStudyHero = forwardRef<HTMLDivElement, CaseStudyHeroProps>(
  ({ project }, ref) => {
    return (
      <div
        ref={ref}
        data-anim="cs-hero"
        className="relative w-full overflow-hidden"
        style={{ height: '60vh' }}
      >
        {/* Hero image with scale for parallax headroom */}
        <picture className="absolute inset-0 w-full h-full">
          <source
            type="image/webp"
            srcSet={`${project.heroImg}&fm=webp&w=640 640w, ${project.heroImg}&fm=webp&w=1280 1280w, ${project.heroImg}&fm=webp&w=1920 1920w`}
            sizes="100vw"
          />
          <source
            type="image/jpeg"
            srcSet={`${project.heroImg}&w=640 640w, ${project.heroImg}&w=1280 1280w, ${project.heroImg}&w=1920 1920w`}
            sizes="100vw"
          />
          <img
            src={project.heroImg}
            alt={`${project.title1} ${project.title2}`}
            loading="eager"
            className="h-full w-full object-cover scale-[1.05]"
            data-parallax
          />
        </picture>

        {/* Gradient scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

        {/* Project title overlay */}
        <div className="absolute bottom-8 left-8 md:left-16">
          <span className="font-mono text-sm tracking-widest text-text-secondary uppercase mb-2 block">
            {project.category}
          </span>
          <div className="leading-none">
            <span className="font-display text-4xl md:text-6xl font-bold text-text">
              {project.title1}
            </span>
            {' '}
            <span className="font-display text-4xl md:text-6xl font-bold text-accent">
              {project.title2}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CaseStudyHero.displayName = 'CaseStudyHero';
