import type { PortfolioSlideData } from '../types';
import { usePortfolioStore } from '../usePortfolioStore';

interface YearNavProps {
  slides: PortfolioSlideData[];
  currentIndex: number;
  onGo: (slideIndex: number) => void;
  className?: string;
}

export function YearNav({ slides, currentIndex, onGo, className }: YearNavProps) {
  const activeYear = usePortfolioStore((s) => s.activeYear);
  const setActiveYear = usePortfolioStore((s) => s.setActiveYear);

  // Unique years sorted descending
  const years = [...new Set(slides.map(s => s.year))].sort((a, b) => Number(b) - Number(a));

  // Projects for the currently active year
  const projectsForYear = slides.filter(s => s.year === activeYear);

  function handleYearClick(yr: string) {
    setActiveYear(yr);
    // Navigate to first project of the selected year (offset by 1 for cover slide)
    const firstSlide = slides.find(s => s.year === yr);
    if (firstSlide) {
      const slideIndex = 1 + slides.findIndex(s => s.slug === firstSlide.slug);
      onGo(slideIndex);
    }
  }

  function handleDotClick(slug: string) {
    // slideIndex = 1 (cover) + position in slides array
    const idx = slides.findIndex(s => s.slug === slug);
    if (idx !== -1) onGo(1 + idx);
  }

  return (
    <nav className={['year-nav', className].filter(Boolean).join(' ')}>
      <div className="year-tabs">
        {years.map(yr => (
          <button
            key={yr}
            className={['year-tab', activeYear === yr ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => handleYearClick(yr)}
          >
            {yr}
          </button>
        ))}
      </div>
      <div className="proj-dots">
        {projectsForYear.map(slide => {
          const slideIndex = 1 + slides.findIndex(s => s.slug === slide.slug);
          const isActive = currentIndex === slideIndex;
          return (
            <button
              key={slide.slug}
              className={['proj-dot', isActive ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={() => handleDotClick(slide.slug)}
              title={slide.name[0]}
            >
              <span className="dot-mark" />
              <span className="dot-label">{slide.name[0]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
