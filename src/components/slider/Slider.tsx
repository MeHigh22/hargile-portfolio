import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useSliderStore } from '../../store/useSliderStore';
import { projects } from '../../data/projects';
import { deriveTheme } from '../../theme/color-utils';
import { applyTheme } from '../../theme/theme-utils';
import { Slide } from './Slide';
import { SliderControls } from './SliderControls';
import { ProgressIndicator } from './ProgressIndicator';
import { useHashSync } from '../../hooks/useHashSync';
import { useKeyboardNav } from '../../hooks/useKeyboardNav';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useParallax } from '../../hooks/useParallax';

gsap.registerPlugin(Observer);

function preloadAdjacentImages(currentIndex: number) {
  [-1, 1].forEach((offset) => {
    const adjIndex = currentIndex + offset;
    if (adjIndex < 0 || adjIndex >= projects.length) return;
    const img = new Image();
    img.src = projects[adjIndex].heroImg;
  });
}

export function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatingRef = useRef(false);

  useHashSync();
  useKeyboardNav();

  const isReducedMotion = useReducedMotion();
  const currentIndex = useSliderStore((s) => s.currentIndex);

  useParallax(containerRef, slideRefs, currentIndex, animatingRef, isReducedMotion);

  // Apply first project theme
  useEffect(() => {
    applyTheme(deriveTheme(projects[0].colors));
  }, []);

  // Setup scroll/touch/pointer observer
  useEffect(() => {
    if (!containerRef.current) return;

    const obs = Observer.create({
      target: containerRef.current,
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

    return () => obs.kill();
  }, []);

  const direction = useSliderStore((s) => s.direction);
  const prevIndexRef = useRef(currentIndex);

  const animateTransition = useCallback(
    (newIndex: number, prevIndex: number, dir: number) => {
      const prevEl = slideRefs.current[prevIndex];
      const nextEl = slideRefs.current[newIndex];
      if (!prevEl || !nextEl || animatingRef.current) return;
      animatingRef.current = true;

      // will-change: promote next slide and its hero for GPU compositing
      gsap.set(nextEl, { willChange: 'transform, opacity' });
      const nextHero = nextEl.querySelector('[data-parallax]');
      if (nextHero) gsap.set(nextHero, { willChange: 'transform' });

      const nextColors = deriveTheme(projects[newIndex].colors);
      const contentEls = nextEl.querySelectorAll('[data-anim]');

      if (isReducedMotion) {
        // REDUCED MOTION: gentle opacity crossfade, no spatial movement
        nextEl.style.display = 'block';
        gsap.set(nextEl, { xPercent: 0, opacity: 0 });
        gsap.set(contentEls, { opacity: 1, y: 0 }); // content visible immediately

        const tl = gsap.timeline({
          onComplete: () => {
            prevEl.style.display = 'none';
            // will-change cleanup
            gsap.set(prevEl, { willChange: 'auto' });
            animatingRef.current = false;
            useSliderStore.getState().setAnimating(false);
            preloadAdjacentImages(newIndex);
          },
        });

        tl.to(prevEl, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
        tl.to(nextEl, { opacity: 1, duration: 0.3, ease: 'power1.inOut' }, '<');
        // Color morph kept — not spatial motion (WCAG safe, per user decision)
        tl.to(document.documentElement, {
          '--color-accent': nextColors.accent,
          '--color-bg': nextColors.bg,
          '--color-bg-elevated': nextColors.bgElevated,
          '--color-bg-card': nextColors.bgCard,
          '--color-text': nextColors.text,
          '--color-text-secondary': nextColors.textSecondary,
          '--color-coral': nextColors.coral,
          '--color-lavender': nextColors.lavender,
          duration: 0.3,
          ease: 'power1.inOut',
        }, '<');
      } else {
        // FULL MOTION: existing Phase 3 transition (slide + stagger + color morph)
        nextEl.style.display = 'block';
        gsap.set(nextEl, { xPercent: 100 * dir });
        gsap.set(contentEls, { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          onComplete: () => {
            prevEl.style.display = 'none';
            // will-change cleanup: remove from prev, keep on next for parallax
            gsap.set(prevEl, { willChange: 'auto' });
            const prevHero = prevEl.querySelector('[data-parallax]');
            if (prevHero) gsap.set(prevHero, { willChange: 'auto' });
            animatingRef.current = false;
            useSliderStore.getState().setAnimating(false);
            preloadAdjacentImages(newIndex);
          },
        });

        tl.to(prevEl, { xPercent: -100 * dir, duration: 0.8, ease: 'power3.inOut' });
        tl.to(nextEl, { xPercent: 0, duration: 0.8, ease: 'power3.inOut' }, '<');
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
        }, '<');
        tl.to(contentEls, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
        }, 0.25);
      }
    },
    [isReducedMotion]
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
        <Slide
          key={project.id}
          ref={(el) => { slideRefs.current[index] = el; }}
          project={project}
          index={index}
        />
      ))}
      <SliderControls />
      <ProgressIndicator />
    </div>
  );
}
