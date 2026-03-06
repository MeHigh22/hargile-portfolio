import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';
import { useSliderStore } from '../../store/useSliderStore';
import { projects } from '../../data/projects';
import { deriveTheme } from '../../theme/color-utils';
import { applyTheme } from '../../theme/theme-utils';
import { Slide } from './Slide';
import { SliderControls } from './SliderControls';
import { ProgressIndicator } from './ProgressIndicator';
import { useHashSync } from '../../hooks/useHashSync';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';

gsap.registerPlugin(Observer, useGSAP);

/** Selector helper for scoped data-anim targeting within a slide */
function animSel(slideIndex: number, anim: string): string {
  return `[data-index="${slideIndex}"] [data-anim="${anim}"]`;
}

export function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);

  useHashSync();
  useKeyboardNav();

  /**
   * Build a staggered content reveal timeline for a given slide.
   * Reused for both initial page load and per-slide transitions.
   * Returns a GSAP timeline (not auto-playing — caller adds to parent timeline or plays manually).
   */
  const buildRevealTimeline = (slideIndex: number): gsap.core.Timeline => {
    const revealTl = gsap.timeline();

    // Set all content elements to their pre-animation state
    gsap.set(
      `${animSel(slideIndex, 'category')}, ` +
      `${animSel(slideIndex, 'title')}, ` +
      `${animSel(slideIndex, 'narrative')}, ` +
      `${animSel(slideIndex, 'tags')}`,
      { opacity: 0, y: 20 }
    );
    gsap.set(animSel(slideIndex, 'hero'), { opacity: 0, scale: 1.05 });

    // Staggered text reveal: category -> title -> narrative -> tags
    revealTl.fromTo(
      animSel(slideIndex, 'category'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    revealTl.fromTo(
      animSel(slideIndex, 'title'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.35' // ~150ms stagger offset
    );
    revealTl.fromTo(
      animSel(slideIndex, 'narrative'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.35'
    );
    revealTl.fromTo(
      animSel(slideIndex, 'tags'),
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.25'
    );

    // Hero image: scale from 105% to 100% with fade-in, concurrent from start
    revealTl.fromTo(
      animSel(slideIndex, 'hero'),
      { scale: 1.05, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      0 // starts at position 0 (concurrent with text stagger)
    );

    return revealTl;
  };

  const { contextSafe } = useGSAP(
    () => {
      // Initial setup: all slides offscreen, first slide visible
      gsap.set('[data-index]', { xPercent: 100 });
      gsap.set('[data-index="0"]', { xPercent: 0 });

      // Apply first project theme synchronously to prevent color flash
      applyTheme(deriveTheme(projects[0].colors));

      // Initial page load reveal for first slide with a small delay
      const initialReveal = buildRevealTimeline(0);
      initialReveal.delay(0.3);
      initialReveal.play();

      // Unified input handling via GSAP Observer
      Observer.create({
        target: containerRef.current!,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 10,
        dragMinimum: 5,
        preventDefault: true,
        onDown: () => {
          const store = useSliderStore.getState();
          if (!store.isAnimating) store.nextSlide();
        },
        onUp: () => {
          const store = useSliderStore.getState();
          if (!store.isAnimating) store.prevSlide();
        },
      });
    },
    { scope: containerRef }
  );

  // Animate slide transitions when currentIndex changes
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const direction = useSliderStore((s) => s.direction);

  const animateTransition = contextSafe(
    (newIndex: number, prevIndex: number, dir: number) => {
      const tl = gsap.timeline({
        onComplete: () => useSliderStore.getState().setAnimating(false),
      });

      // Reset outgoing slide content elements to pre-animation state
      // so they are ready for re-reveal when user returns to that slide
      gsap.set(
        `${animSel(prevIndex, 'category')}, ` +
        `${animSel(prevIndex, 'title')}, ` +
        `${animSel(prevIndex, 'narrative')}, ` +
        `${animSel(prevIndex, 'tags')}`,
        { opacity: 0, y: 20 }
      );
      gsap.set(animSel(prevIndex, 'hero'), {
        opacity: 0,
        scale: 1.05,
      });

      // Slide the previous slide out
      tl.to(`[data-index="${prevIndex}"]`, {
        xPercent: -100 * dir,
        duration: 0.8,
        ease: 'power3.inOut',
      });

      // Slide the new slide in
      tl.fromTo(
        `[data-index="${newIndex}"]`,
        { xPercent: 100 * dir },
        { xPercent: 0, duration: 0.8, ease: 'power3.inOut' },
        '<' // concurrent with exit
      );

      // Color morph: smoothly transition all 8 CSS custom properties
      const nextColors = deriveTheme(projects[newIndex].colors);
      tl.to(document.documentElement, {
        '--color-accent': nextColors.accent,
        '--color-bg': nextColors.bg,
        '--color-bg-elevated': nextColors.bgElevated,
        '--color-bg-card': nextColors.bgCard,
        '--color-text': nextColors.text,
        '--color-text-secondary': nextColors.textSecondary,
        '--color-coral': nextColors.coral,
        '--color-lavender': nextColors.lavender,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '<'); // concurrent with slide movement

      // Staggered content reveal for incoming slide
      // Starts at 0.2s into the timeline for a cinematic layered feel
      const revealTl = buildRevealTimeline(newIndex);
      tl.add(revealTl, 0.2);
    }
  );

  useEffect(() => {
    if (currentIndex !== prevIndexRef.current) {
      animateTransition(currentIndex, prevIndexRef.current, direction);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, direction, animateTransition]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
    >
      {projects.map((project, index) => (
        <Slide key={project.id} project={project} index={index} />
      ))}
      <SliderControls />
      <ProgressIndicator />
    </div>
  );
}
