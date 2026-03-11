import { useEffect, useRef } from 'react';
import { useSliderStore } from '../store/useSliderStore';
import { useViewStore } from '../store/useViewStore';
import { projects } from '../data/projects';

export function useHashSync() {
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const goToSlide = useSliderStore((s) => s.goToSlide);
  const isInitialMount = useRef(true);

  // On mount: read hash and navigate to matching project
  useEffect(() => {
    const rawHash = window.location.hash.slice(1);
    if (rawHash) {
      const parts = rawHash.split('/');
      if (parts.length === 2 && parts[1] === 'case-study') {
        // Navigate slider to matching project, then open case study
        const idx = projects.findIndex((p) => p.id === parts[0]);
        if (idx !== -1) goToSlide(idx);
        useViewStore.getState().openCase(parts[0]);
      } else {
        const idx = projects.findIndex((p) => p.id === rawHash);
        if (idx !== -1) goToSlide(idx);
      }
    }
    // Set initial hash via replaceState (don't pollute history)
    const project = projects[useSliderStore.getState().currentIndex];
    if (project && !useViewStore.getState().activeProjectId) {
      window.history.replaceState(null, '', `#${project.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When currentIndex changes: update hash (skip if case study is open)
  useEffect(() => {
    // Skip the initial mount (handled by replaceState above)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Don't overwrite case study hash with slider hash
    if (useViewStore.getState().mode === 'case') return;

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
      const rawHash = window.location.hash.slice(1);
      const parts = rawHash.split('/');

      // If navigating to case-study hash: open case study
      if (parts.length === 2 && parts[1] === 'case-study') {
        useViewStore.getState().openCase(parts[0]);
        return;
      }

      // If currently in case mode and navigating away from case-study hash: close panel
      if (useViewStore.getState().mode === 'case' && !rawHash.includes('/case-study')) {
        useViewStore.getState().closeCase();
        return;
      }

      // Standard slider navigation
      const idx = projects.findIndex((p) => p.id === rawHash);
      if (idx !== -1) goToSlide(idx);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [goToSlide]);
}
