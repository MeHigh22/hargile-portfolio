import { forwardRef, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ProjectData } from '../../data/types';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyHeroProps {
  project: ProjectData;
  panelRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}

export const CaseStudyHero = forwardRef<HTMLDivElement, CaseStudyHeroProps>(
  ({ project, panelRef, reducedMotion }, ref) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (reducedMotion) return;
      const img = imgRef.current;
      const container = containerRef.current;
      const panel = panelRef.current;
      if (!img || !container || !panel) return;

      // Set initial scale via GSAP so it's not split between CSS class and GSAP inline style
      gsap.set(img, { scale: 1.12 });

      const ctx = gsap.context(() => {
        gsap.to(img, {
          y: 100,
          scale: 1.2,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            scroller: panel,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      return () => ctx.revert();
    }, [panelRef, reducedMotion]);

    return (
      <div ref={ref} data-anim="cs-hero">

        {/* ── Full-bleed image section ── */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden flex items-end"
          style={{ height: '80vh', minHeight: '480px', paddingBottom: '52px' }}
        >

          {/* Background image */}
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
              ref={imgRef}
              src={project.heroImg}
              alt={`${project.title1} ${project.title2}`}
              loading="eager"
              className="h-full w-full object-cover"
              data-parallax
            />
          </picture>

          {/* Gradient scrim */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--color-bg) 0%, color-mix(in srgb, var(--color-bg) 70%, transparent) 30%, color-mix(in srgb, var(--color-bg) 30%, transparent) 60%, color-mix(in srgb, var(--color-bg) 50%, transparent) 100%)',
            }}
          />

          {/* Content anchored to bottom */}
          <div className="relative z-10 w-full px-8 md:px-16 lg:px-20">

            {/* Category + year */}
            <div className="flex items-center gap-6 mb-4 flex-wrap">
              <span className="font-mono text-xs tracking-widest uppercase text-accent border border-accent/20 rounded-full px-3.5 py-1.5">
                {project.category}
              </span>
              <span className="font-mono text-xs tracking-[0.05em] text-text-muted">
                {project.year}
              </span>
            </div>

            {/* Two-line title */}
            <h1
              className="font-display font-bold tracking-[-0.04em] text-text mb-4"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.95 }}
            >
              <span className="block">{project.title1}</span>
              <span className="block">{project.title2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-secondary font-light leading-relaxed max-w-xl" style={{ fontSize: '1.05rem' }}>
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* ── Info bar ── */}
        <div className="border-t border-b border-border py-8 px-8 md:px-16 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted mb-2">Client</div>
              <div className="font-display font-semibold text-base tracking-[-0.01em]">{project.client}</div>
            </div>
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted mb-2">Services</div>
              <div className="font-display font-semibold text-base tracking-[-0.01em]">{project.services}</div>
            </div>
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted mb-2">Durée</div>
              <div className="font-display font-semibold text-base tracking-[-0.01em]">{project.duration}</div>
            </div>
            <div>
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted mb-2">Technologies</div>
              <div className="font-display font-semibold text-base tracking-[-0.01em]">{project.tech}</div>
            </div>
          </div>
        </div>

      </div>
    );
  }
);

CaseStudyHero.displayName = 'CaseStudyHero';
