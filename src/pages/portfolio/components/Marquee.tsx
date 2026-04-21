interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const content = items.map((item, i) => (
    <span key={i}>
      {item}<span className="star">✦</span>
    </span>
  ));
  return (
    <div className={['marquee', className].filter(Boolean).join(' ')}>
      <div className="marquee-track">{content}</div>
      <div className="marquee-track" aria-hidden={true}>{content}</div>
    </div>
  );
}
