import { forwardRef } from 'react';
import type { ImageRatio, ProjectData } from '../../data/types';
import { useSliderStore } from '../../store/useSliderStore';
import { useViewStore } from '../../store/useViewStore';
import { SlideAmbience } from './SlideAmbience';

interface SlideProps {
  project: ProjectData;
  index: number;
}

const gridColsMap: Record<ImageRatio, string> = {
  balanced: 'md:grid-cols-[45fr_55fr]',
  'left-heavy': 'md:grid-cols-[55fr_45fr]',
  'right-heavy': 'md:grid-cols-[40fr_60fr]',
};

const imageSizesMap: Record<ImageRatio, string> = {
  balanced: '(max-width: 768px) 100vw, 55vw',
  'left-heavy': '(max-width: 768px) 100vw, 45vw',
  'right-heavy': '(max-width: 768px) 100vw, 60vw',
};

export const Slide = forwardRef<HTMLDivElement, SlideProps>(
  ({ project, index }, ref) => {
    const techItems = project.tech.split(',').map((t) => t.trim());
    const imgLoading = index <= 1 ? 'eager' : 'lazy';

    const gridCols = gridColsMap[project.imageRatio];
    const imgSizes = imageSizesMap[project.imageRatio];

    return (
      <div
        ref={ref}
        data-index={index}
        className="slide absolute inset-0 h-screen w-full overflow-hidden"
      >
        {/* Desktop: CSS Grid split layout | Mobile: stacked with overlay */}
        <div className={`h-full md:grid ${gridCols}`}>
          {/* Content panel */}
          <div className="relative z-10 flex h-full flex-col justify-start md:justify-center px-8 md:px-16">
            {/* Per-project ambient decoration — behind all content */}
            <SlideAmbience ambience={project.ambience} />
            {/* Mobile: dark scrim so text stays readable over bright hero images */}
            <div className="absolute inset-0 bg-bg/70 md:hidden" />

            <div className="relative z-10 pt-20 md:pt-0 md:mt-0">
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

              {/* CTA */}
              <div data-anim="cta" className="mt-6 flex gap-3">
                {project.caseStudy && (
                  <button
                    className="font-mono text-sm tracking-wider text-accent border border-accent/40 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors"
                    onClick={() => {
                      if (!useSliderStore.getState().isAnimating) {
                        useViewStore.getState().openCase(project.id);
                      }
                    }}
                  >
                    Voir l'etude de cas →
                  </button>
                )}
                {!project.caseStudy && project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm tracking-wider text-accent border border-accent/40 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors"
                  >
                    Voir le site →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Hero image panel */}
          <div data-anim="hero" className="absolute inset-0 md:relative md:inset-auto -z-0 md:z-0 overflow-hidden">
            {/* Gradient overlay tint — per-project brand color wash */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${project.colors.gradientFrom}28 0%, ${project.colors.gradientTo}14 40%, transparent 70%)`,
              }}
              aria-hidden="true"
            />
            {project.heroImg.includes('unsplash.com') ? (
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${project.heroImg}&fm=webp&w=640 640w, ${project.heroImg}&fm=webp&w=1280 1280w, ${project.heroImg}&fm=webp&w=1920 1920w`}
                  sizes={imgSizes}
                />
                <source
                  type="image/jpeg"
                  srcSet={`${project.heroImg}&w=640 640w, ${project.heroImg}&w=1280 1280w, ${project.heroImg}&w=1920 1920w`}
                  sizes={imgSizes}
                />
                <img
                  src={project.heroImg}
                  alt={`${project.title1} ${project.title2}`}
                  loading={imgLoading}
                  className="h-full w-full object-cover scale-[1.05]"
                />
              </picture>
            ) : (
              <img
                src={project.heroImg}
                alt={`${project.title1} ${project.title2}`}
                loading={imgLoading}
                className="h-full w-full object-cover scale-[1.05]"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
