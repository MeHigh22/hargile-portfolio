import { useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Detects if the user prefers reduced motion using gsap.matchMedia().
 * Returns true when prefers-reduced-motion: reduce is active.
 */
export function useReducedMotion(): boolean {
  const [isReduced, setIsReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      setIsReduced(true);
      return () => setIsReduced(false);
    });

    return () => {
      mm.revert();
    };
  }, []);

  return isReduced;
}
