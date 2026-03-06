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

export function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);

  useHashSync();
  useKeyboardNav();

  const { contextSafe } = useGSAP(
    () => {
      // Initial setup: all slides offscreen, first slide visible
      gsap.set('[data-index]', { xPercent: 100 });
      gsap.set('[data-index="0"]', { xPercent: 0 });

      // Apply first project theme synchronously to prevent color flash
      applyTheme(deriveTheme(projects[0].colors));

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
        `[data-index="${prevIndex}"] [data-anim="category"], ` +
        `[data-index="${prevIndex}"] [data-anim="title"], ` +
        `[data-index="${prevIndex}"] [data-anim="narrative"], ` +
        `[data-index="${prevIndex}"] [data-anim="tags"]`,
        { opacity: 0, y: 20 }
      );
      gsap.set(`[data-index="${prevIndex}"] [data-anim="hero"]`, {
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
