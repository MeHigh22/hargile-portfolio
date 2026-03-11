import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import { useViewStore } from '../../store/useViewStore';
import { deriveTheme } from '../../theme/color-utils';
import { applyTheme } from '../../theme/theme-utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BackButton } from './BackButton';
import { CaseStudyHero } from './CaseStudyHero';
import { CaseStudySection } from './CaseStudySection';
import { ProseBody } from './ProseBody';
import { Timeline } from './Timeline';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyPanelProps {
  projectId: string;
}

export function CaseStudyPanel({ projectId }: CaseStudyPanelProps) {
  const project = projects.find((p) => p.id === projectId);
  const isReducedMotion = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  // closePanel: revert GSAP context (kills ScrollTriggers), animate out, then call closeCase
  // Defined before all effects so effects can reference it
  const closePanel = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // CRITICAL: revert() first — kills all ScrollTrigger instances
    ctxRef.current?.revert();
    ctxRef.current = null;

    const sliderContainer = document.querySelector('[data-slider-container]') as HTMLElement | null;

    if (isReducedMotion) {
      gsap.to(panel, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.inOut',
        onComplete: () => {
          panel.style.visibility = 'hidden';
          panel.style.pointerEvents = 'none';
          panel.scrollTop = 0;
          if (sliderContainer) {
            gsap.set(sliderContainer, { opacity: 1, scale: 1 });
          }
          useViewStore.getState().closeCase();
        },
      });
      if (sliderContainer) {
        gsap.to(sliderContainer, { opacity: 1, duration: 0.3, ease: 'power1.inOut' });
      }
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          panel.style.visibility = 'hidden';
          panel.style.pointerEvents = 'none';
          panel.scrollTop = 0;
          useViewStore.getState().closeCase();
        },
      });

      tl.to(panel, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });

      if (sliderContainer) {
        tl.to(
          sliderContainer,
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
          '<0.1'
        );
      }
    }
  }, [isReducedMotion]);

  // Apply project theme on mount
  useEffect(() => {
    if (!project) return;
    applyTheme(deriveTheme(project.colors));
  }, [project]);

  // Update hash on mount
  useEffect(() => {
    window.history.pushState(null, '', `#${projectId}/case-study`);
  }, [projectId]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePanel]);

  // Entry animation
  useEffect(() => {
    if (!project?.caseStudy) return;

    const panel = panelRef.current;
    if (!panel) return;

    const sliderContainer = document.querySelector('[data-slider-container]') as HTMLElement | null;
    const heroEl = heroRef.current;

    // Set up GSAP context scoped to panel
    const ctx = gsap.context(() => {
      const sections = panel.querySelectorAll('[data-anim="cs-section"]');

      if (isReducedMotion) {
        // Reduced motion: simple opacity crossfade
        gsap.set(panel, { opacity: 0, visibility: 'visible', pointerEvents: 'auto' });

        const tl = gsap.timeline({
          onComplete: () => {
            ScrollTrigger.refresh();
            // Ensure all sections are visible in reduced motion mode
            gsap.set(sections, { opacity: 1, y: 0 });
          },
        });

        if (sliderContainer) {
          tl.to(sliderContainer, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
        }
        tl.to(panel, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, '<');
      } else {
        // Full motion: two-beat curtain wipe
        gsap.set(panel, { opacity: 0, visibility: 'visible' });
        if (heroEl) gsap.set(heroEl, { opacity: 0, y: 20 });
        if (sections.length) gsap.set(sections, { opacity: 0, y: 30 });

        const tl = gsap.timeline({
          onComplete: () => {
            panel.style.pointerEvents = 'auto';
            ScrollTrigger.refresh();

            // Below-fold detection: reset sections that are out of view and attach ScrollTrigger
            const panelHeight = panel.clientHeight;
            const panelRect = panel.getBoundingClientRect();

            sections.forEach((section) => {
              const el = section as HTMLElement;
              const rect = el.getBoundingClientRect();
              const relativeTop = rect.top - panelRect.top;

              if (relativeTop >= panelHeight) {
                // Section is below the fold — reset to hidden and reveal on scroll
                gsap.set(el, { opacity: 0, y: 30 });
                ScrollTrigger.create({
                  trigger: el,
                  scroller: panel,
                  start: 'top 85%',
                  onEnter: () => {
                    gsap.to(el, {
                      opacity: 1,
                      y: 0,
                      duration: 0.5,
                      ease: 'power3.out',
                    });
                  },
                });
              }
            });
          },
        });

        // Beat 1: slider recedes
        if (sliderContainer) {
          tl.to(sliderContainer, {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: 'power2.inOut',
          });
        }

        // Beat 2: panel reveals
        tl.to(panel, { opacity: 1, duration: 0.3, ease: 'power3.out' });
        if (heroEl) {
          tl.to(heroEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '<0.1');
        }
        if (sections.length) {
          tl.to(
            sections,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              stagger: 0.07,
            },
            '<0.15'
          );
        }
      }
    }, panel);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Nothing to render if project not found or has no case study
  if (!project?.caseStudy) return null;

  const { caseStudy } = project;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[100] overflow-y-auto bg-bg"
      style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}
    >
      <BackButton onClick={closePanel} />

      {/* Full-bleed hero */}
      <CaseStudyHero ref={heroRef} project={project} />

      {/* Case study sections in prescribed order */}
      <CaseStudySection title="Defi">
        <ProseBody text={caseStudy.challenge} />
      </CaseStudySection>

      <CaseStudySection title="Solution">
        <ProseBody text={caseStudy.solution} />
      </CaseStudySection>

      <CaseStudySection title="Processus">
        <Timeline steps={caseStudy.timeline} panelRef={panelRef} reducedMotion={isReducedMotion} />
      </CaseStudySection>

      <CaseStudySection title="Resultats">
        {/* Placeholder: Phase 7 fills this with metrics component */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {caseStudy.metrics.map((metric) => (
            <div key={metric.label} className="border border-accent/20 rounded-lg p-4 text-center">
              <div className="font-display text-3xl font-bold text-accent mb-1">{metric.value}</div>
              <div className="font-mono text-xs text-text-secondary uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </div>
      </CaseStudySection>

      <CaseStudySection title="Livrables">
        {/* Placeholder: Phase 7 fills this with gallery component */}
        <ul className="space-y-2">
          {caseStudy.deliverables.map((item) => (
            <li key={item} className="flex items-start gap-3 text-text-secondary text-sm">
              <span className="text-accent mt-0.5 shrink-0">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CaseStudySection>

      <CaseStudySection title="Temoignage">
        <blockquote className="border-l-2 border-accent pl-6">
          <p className="text-text italic leading-relaxed text-lg mb-4">
            "{caseStudy.testimonial.quote}"
          </p>
          <footer className="font-mono text-sm">
            <span className="text-accent">{caseStudy.testimonial.author}</span>
            <span className="text-text-secondary"> — {caseStudy.testimonial.role}</span>
          </footer>
        </blockquote>
      </CaseStudySection>

      <CaseStudySection title="Equipe">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {caseStudy.team.map((member) => (
            <div key={member.name} className="flex items-center gap-3 border border-accent/20 rounded-lg p-4">
              <div>
                <div className="text-text text-sm font-medium">{member.name}</div>
                <div className="font-mono text-xs text-accent">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </CaseStudySection>

      {/* Bottom padding */}
      <div className="h-16" />
    </div>
  );
}
