import React, { useRef, useEffect, useCallback } from 'react';
import { useSearchParams, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import './PortfolioPage.css';
import { projects } from '../../data/projects';
import { adaptProjects } from './portfolioDataAdapter';
import { usePortfolioStore } from './usePortfolioStore';
import { CoverSlide } from './components/CoverSlide';
import { ProjectSlide } from './components/ProjectSlide';
import { OutroSlide } from './components/OutroSlide';
import { YearNav } from './components/YearNav';
import { ProgressBar } from './components/ProgressBar';
import { TweaksPanel } from './components/TweaksPanel';
import { CaseStudyPage } from './components/CaseStudyPage';

// Called once at module level — pure function, no React dependency
const adaptedProjects = adaptProjects(projects);

export function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const busyRef = useRef(false);
  const store = usePortfolioStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Unified slides array — index 0 is cover, 1..N are projects, N+1 is outro
  const slides = [
    { type: 'cover' as const },
    ...adaptedProjects.map(p => ({ ...p, type: 'project' as const })),
    { type: 'outro' as const },
  ];

  const DURATION = 0.9;
  const EASE = 'power2.inOut';

  const go = useCallback((n: number, force = false) => {
    if (busyRef.current && !force) return;
    const total = slides.length;
    const next = ((n % total) + total) % total;
    const cur = store.currentIndex;
    if (next === cur && !force) return;

    busyRef.current = true;
    gsap.to(slideRefs.current[cur], { opacity: 0, pointerEvents: 'none', duration: DURATION, ease: EASE });
    gsap.to(slideRefs.current[next], {
      opacity: 1, pointerEvents: 'auto', duration: DURATION, ease: EASE,
      onComplete: () => { busyRef.current = false; },
    });
    store.setIndex(next);

    const nextSlide = slides[next];
    if (nextSlide.type === 'project') {
      store.setActiveYear(nextSlide.year);
      setSearchParams({ p: nextSlide.slug }, { replace: true });
    } else {
      store.setActiveYear('2025');
      setSearchParams({}, { replace: true });
    }
    localStorage.setItem('portfolio-slide', String(next));
  }, [slides, store, setSearchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount: set initial slide from URL param or localStorage, then show it
  useEffect(() => {
    // Confirm all slides start at opacity 0 (CSS already sets this, GSAP confirms)
    slideRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, pointerEvents: 'none' });
    });

    // Determine starting index from URL param or localStorage
    const slug = searchParams.get('p');
    let startIdx = 0;
    if (slug) {
      const found = slides.findIndex(
        s => s.type === 'project' && (s as (typeof adaptedProjects)[0] & { type: 'project' }).slug === slug
      );
      if (found !== -1) startIdx = found;
    } else {
      const saved = localStorage.getItem('portfolio-slide');
      if (saved) startIdx = Math.min(parseInt(saved, 10), slides.length - 1);
    }

    // Show starting slide immediately (no transition on initial render)
    if (slideRefs.current[startIdx]) {
      gsap.set(slideRefs.current[startIdx], { opacity: 1, pointerEvents: 'auto' });
    }
    store.setIndex(startIdx);

    const startSlide = slides[startIdx];
    if (startSlide.type === 'project') {
      store.setActiveYear((startSlide as (typeof adaptedProjects)[0] & { type: 'project' }).year);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — run once on mount only

  // Keyboard navigation with e.repeat guard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.repeat) return; // Guard against held-down key fire
      if (e.key === 'ArrowRight') go(store.currentIndex + 1);
      if (e.key === 'ArrowLeft') go(store.currentIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [go, store.currentIndex]);

  // Derive current slide title for ProgressBar
  const currentSlide = slides[store.currentIndex];
  const currentTitle =
    currentSlide.type === 'cover'
      ? 'Couverture'
      : currentSlide.type === 'outro'
      ? 'Contact'
      : (currentSlide as (typeof adaptedProjects)[0] & { type: 'project' }).name.join(' ');

  // Helper: assign ref for a slide element
  const setSlideRef = (i: number) => (el: HTMLElement | null) => {
    slideRefs.current[i] = el;
  };

  return (
    <div data-portfolio ref={rootRef}>
      {/* Chrome — fixed UI elements */}
      <div className="chrome">
        <a href="/" className="logo">
          <img src="/brand-large-white.png" alt="Hargile" />
        </a>
        <div className="topmeta">
          <span><span className="dot" />Dispo — Q3 2026</span>
          <button
            onClick={() => go(slides.length - 1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
          >
            Contact
          </button>
          <a
            className="cta"
            href="#"
            onClick={(e) => { e.preventDefault(); go(slides.length - 1); }}
          >
            Travaillons ensemble →
          </a>
        </div>
        <YearNav
          slides={adaptedProjects}
          currentIndex={store.currentIndex}
          onGo={go}
        />
        <ProgressBar
          current={store.currentIndex}
          total={slides.length}
          currentTitle={currentTitle}
        />
        <div className="nav">
          <button onClick={() => go(store.currentIndex - 1)}>←</button>
          <button onClick={() => go(store.currentIndex + 1)} className="next">→</button>
        </div>
      </div>

      {/* Stage — all slides stacked, GSAP controls opacity */}
      <main className="stage">
        {/* Cover slide — index 0 */}
        <CoverSlide
          ref={setSlideRef(0) as React.Ref<HTMLDivElement>}
          slides={adaptedProjects}
          onGoToProjects={() => go(1)}
        />
        {/* Project slides — index 1..N */}
        {adaptedProjects.map((slide, i) => (
          <ProjectSlide
            key={slide.slug}
            ref={setSlideRef(i + 1) as React.Ref<HTMLElement>}
            slide={slide}
            index={i}
          />
        ))}
        {/* Outro slide — index N+1 */}
        <OutroSlide ref={setSlideRef(slides.length - 1) as React.Ref<HTMLElement>} />
      </main>

      <TweaksPanel portfolioRef={rootRef} />

      {/* Nested route for case study — /portfolio/case-study?p=<slug> */}
      <Routes>
        <Route path="case-study" element={<CaseStudyPage />} />
      </Routes>
    </div>
  );
}
