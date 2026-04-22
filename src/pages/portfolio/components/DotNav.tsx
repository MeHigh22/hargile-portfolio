import type { PortfolioSlideData } from '../types';

interface DotNavProps {
  totalCount: number;
  slides: PortfolioSlideData[];  // project slides only (not cover/outro)
  currentIndex: number;
  onGo: (index: number) => void;
}

export function DotNav({ totalCount, slides, currentIndex, onGo }: DotNavProps) {
  return (
    <div className="dot-nav" role="tablist" aria-label="Navigation entre diapositives">
      {Array.from({ length: totalCount }, (_, i) => {
        const isActive = i === currentIndex;
        const isOutro = i === totalCount - 1;
        const label =
          i === 0
            ? 'Aller à la couverture'
            : isOutro
            ? 'Aller au contact'
            : `Aller au projet ${slides[i - 1]?.name.join(' ')}`;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            className={['dot-nav-btn', isActive ? 'active' : ''].filter(Boolean).join(' ')}
            onClick={() => onGo(i)}
          />
        );
      })}
    </div>
  );
}
