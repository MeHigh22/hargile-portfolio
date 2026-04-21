import type { PortfolioSlideData } from '../types';

interface YearNavProps {
  slides: PortfolioSlideData[];
  currentIndex: number; // 0 = cover, 1..N = projects, N+1 = outro
  activeYear: string;
  onGo: (slideIndex: number) => void;
  onYearChange: (year: string) => void;
}

export function YearNav({ slides, currentIndex, activeYear, onGo, onYearChange }: YearNavProps) {
  const years = [...new Set(slides.map(s => s.year))].sort((a, b) => Number(b) - Number(a));

  // On cover (0) or outro (last): show year tabs only, no dots
  const isChrome = currentIndex === 0 || currentIndex === slides.length + 1;
  const visibleDots = isChrome ? [] : slides.filter(s => s.year === activeYear);

  return (
    <nav className="year-nav">
      <div className="year-tabs">
        {years.map(yr => (
          <button
            key={yr}
            className={['year-tab', yr === activeYear ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => {
              onYearChange(yr);
              const first = slides.find(s => s.year === yr);
              if (first) onGo(slides.indexOf(first) + 1);
            }}
          >
            {yr}
          </button>
        ))}
      </div>
      <div className="proj-dots">
        {visibleDots.map(slide => {
          const slideIndex = slides.indexOf(slide) + 1;
          const isActive = currentIndex === slideIndex;
          return (
            <div
              key={slide.slug}
              className={['proj-dot', isActive ? 'active' : ''].filter(Boolean).join(' ')}
              onClick={() => onGo(slideIndex)}
            >
              <span className="dot-label">{slide.name[0]}{slide.name[1] ? ' ' + slide.name[1] : ''}</span>
              <span className="dot-mark" />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
