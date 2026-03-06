import { useEffect, useRef } from 'react';
import { useSliderStore } from '../store/useSliderStore';
import { projects } from '../data/projects';

export function useHashSync() {
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const goToSlide = useSliderStore((s) => s.goToSlide);
  const isInitialMount = useRef(true);

  // On mount: read hash and navigate to matching project
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const idx = projects.findIndex((p) => p.id === hash);
      if (idx !== -1) goToSlide(idx);
    }
    // Set initial hash via replaceState (don't pollute history)
    const project = projects[useSliderStore.getState().currentIndex];
    if (project) {
      window.history.replaceState(null, '', `#${project.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When currentIndex changes: update hash
  useEffect(() => {
    // Skip the initial mount (handled by replaceState above)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const project = projects[currentIndex];
    if (project) {
      const newHash = `#${project.id}`;
      if (window.location.hash !== newHash) {
        window.history.pushState(null, '', newHash);
      }
    }
  }, [currentIndex]);

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      const idx = projects.findIndex((p) => p.id === hash);
      if (idx !== -1) goToSlide(idx);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goToSlide]);
}
