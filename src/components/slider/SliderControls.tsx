import { clsx } from 'clsx';
import { useSliderStore } from '../../store/useSliderStore';

export function SliderControls() {
  const nextSlide = useSliderStore((s) => s.nextSlide);
  const prevSlide = useSliderStore((s) => s.prevSlide);
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const totalSlides = useSliderStore((s) => s.totalSlides);
  const isAnimating = useSliderStore((s) => s.isAnimating);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSlides - 1;

  const btnBase =
    'flex items-center justify-center w-12 h-12 rounded-full border border-text/20 text-text transition-all duration-300';
  const btnEnabled = 'hover:bg-text/10 hover:scale-110 cursor-pointer';
  const btnDisabled = 'opacity-30 cursor-not-allowed';

  return (
    <div className="fixed bottom-8 right-8 z-40 flex items-center gap-4">
      {/* Counter */}
      <span className="font-mono text-sm text-text-secondary mr-2">
        {String(currentIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </span>

      {/* Prev */}
      <button
        aria-label="Previous project"
        disabled={isFirst || isAnimating}
        onClick={prevSlide}
        className={clsx(btnBase, isFirst || isAnimating ? btnDisabled : btnEnabled)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 4L6 10L12 16" />
        </svg>
      </button>

      {/* Next */}
      <button
        aria-label="Next project"
        disabled={isLast || isAnimating}
        onClick={nextSlide}
        className={clsx(btnBase, isLast || isAnimating ? btnDisabled : btnEnabled)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 4L14 10L8 16" />
        </svg>
      </button>
    </div>
  );
}
