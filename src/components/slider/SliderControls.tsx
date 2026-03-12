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
    'flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full border border-text/20 text-text transition-all duration-300';
  const btnEnabled = 'hover:bg-text/10 hover:scale-110 cursor-pointer';
  const btnDisabled = 'opacity-30 cursor-not-allowed';

  return (
    <>
      {/* Bottom: centered on mobile, right on desktop */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-8 z-40 flex items-center gap-2 md:gap-3">
        <span className="font-mono text-xs text-text-secondary tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(totalSlides).padStart(2, '0')}
        </span>

        <div className="w-px h-4 bg-text/20" />

        <button
          aria-label="Previous project"
          disabled={isFirst || isAnimating}
          onClick={prevSlide}
          className={clsx(btnBase, isFirst || isAnimating ? btnDisabled : btnEnabled)}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>

        <button
          aria-label="Next project"
          disabled={isLast || isAnimating}
          onClick={nextSlide}
          className={clsx(btnBase, isLast || isAnimating ? btnDisabled : btnEnabled)}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 4L14 10L8 16" />
          </svg>
        </button>
      </div>
    </>
  );
}
