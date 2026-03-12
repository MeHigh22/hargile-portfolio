import { useSliderStore } from '../../store/useSliderStore';

export function ProgressIndicator() {
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const totalSlides = useSliderStore((s) => s.totalSlides);

  const current = String(currentIndex + 1).padStart(2, '0');
  const total = String(totalSlides).padStart(2, '0');
  const percentage = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-3">
      <span className="font-mono text-sm text-text-secondary">
        {current}
      </span>
      <div className="w-32 h-0.5 bg-border rounded-full overflow-hidden">
        <div
          data-testid="progress-bar"
          className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-mono text-sm text-text-muted">
        {total}
      </span>
    </div>
  );
}
