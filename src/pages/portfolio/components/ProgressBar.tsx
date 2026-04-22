interface ProgressBarProps {
  current: number;
  total: number;
  currentTitle: string;
  className?: string;
}

export function ProgressBar({ current, total, currentTitle, className }: ProgressBarProps) {
  const fillPct = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <div className={['bottom', className].filter(Boolean).join(' ')}>
      <div className="counter">
        <span className="big">{String(current + 1).padStart(2, '0')}</span>
        &nbsp;/&nbsp;
        <span>{String(total).padStart(2, '0')}</span>
        &nbsp;&nbsp;
        <span className="slide-title">{currentTitle}</span>
      </div>
      <div className="progress">
        <div className="fill" style={{ width: `${fillPct}%` }} />
        <div className="ticks">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className="tick" />
          ))}
        </div>
      </div>
    </div>
  );
}
