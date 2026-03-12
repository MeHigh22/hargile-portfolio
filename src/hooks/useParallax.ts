import { useEffect } from 'react';
import gsap from 'gsap';
import type { SlideAmbience } from '../data/types';

/**
 * Ambient hero image motion — replaces cursor-tracking parallax.
 * Each ambience type applies a distinct looping drift to the hero image
 * giving each project a different physical "feel" beyond color alone.
 */
const AMBIENT_CONFIGS: Record<SlideAmbience, gsap.TweenVars> = {
  // Precise, controlled — slow horizontal sweep. Data / SaaS / tech.
  grid:  { x: 10, y: 0,   duration: 20, ease: 'power1.inOut', repeat: -1, yoyo: true },
  // Breathing rhythm — gentle vertical rise and fall. Health / wellness.
  pulse: { x: 0,  y: -10, duration: 5,  ease: 'sine.inOut',   repeat: -1, yoyo: true },
  // Organic drift — slow diagonal wander. Nature / eco / lifestyle.
  drift: { x: -8, y: -7,  duration: 24, ease: 'sine.inOut',   repeat: -1, yoyo: true },
};

export function useParallax(
  containerRef: React.RefObject<HTMLDivElement | null>,
  slideRefs: React.RefObject<(HTMLDivElement | null)[]>,
  activeIndex: number,
  isAnimatingRef: React.RefObject<boolean>,
  isReducedMotion: boolean,
  ambience: SlideAmbience
) {
  void containerRef;
  void isAnimatingRef;

  useEffect(() => {
    if (isReducedMotion) return;

    const slide = slideRefs.current?.[activeIndex];
    const hero = slide?.querySelector<HTMLElement>('[data-parallax]');
    if (!hero) return;

    gsap.set(hero, { x: 0, y: 0 });
    const tween = gsap.to(hero, AMBIENT_CONFIGS[ambience]);

    return () => {
      tween.kill();
      gsap.set(hero, { x: 0, y: 0 });
    };
  }, [slideRefs, activeIndex, isReducedMotion, ambience]);
}
