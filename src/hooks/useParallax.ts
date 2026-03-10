import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const MAX_SHIFT = 12; // px — within 10-15px user constraint

export function useParallax(
  containerRef: React.RefObject<HTMLDivElement | null>,
  slideRefs: React.RefObject<(HTMLDivElement | null)[]>,
  activeIndex: number,
  isAnimatingRef: React.RefObject<boolean>,
  isReducedMotion: boolean
) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const quickXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const getHeroEl = useCallback(() => {
    const slide = slideRefs.current?.[activeIndex];
    return slide?.querySelector<HTMLElement>('[data-parallax]') ?? null;
  }, [slideRefs, activeIndex]);

  useEffect(() => {
    if (isReducedMotion) return; // parallax disabled entirely per user decision
    const container = containerRef.current;
    if (!container) return;

    const hero = getHeroEl();
    if (!hero) return;

    // Initialize quickTo for smooth interpolation
    quickXRef.current = gsap.quickTo(hero, 'x', { duration: 0.6, ease: 'power2.out' });
    quickYRef.current = gsap.quickTo(hero, 'y', { duration: 0.6, ease: 'power2.out' });

    const onMouseMove = (e: MouseEvent) => {
      if (isAnimatingRef.current) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onTick = () => {
      if (isAnimatingRef.current) return;
      quickXRef.current?.(mouseRef.current.x * MAX_SHIFT);
      quickYRef.current?.(mouseRef.current.y * MAX_SHIFT);
    };

    container.addEventListener('mousemove', onMouseMove);
    gsap.ticker.add(onTick);

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(onTick);
      gsap.set(hero, { x: 0, y: 0 });
      quickXRef.current = null;
      quickYRef.current = null;
    };
  }, [containerRef, getHeroEl, isAnimatingRef, isReducedMotion]);
}
