import { memo, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MarqueeProps {
  items: string[];
  className?: string;
}

export const Marquee = memo(function Marquee({ items, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Wait one frame so the browser has painted and scrollWidth is accurate
    const raf = requestAnimationFrame(() => {
      const fullWidth = track.scrollWidth / 2; // two identical tracks
      gsap.killTweensOf(track);
      gsap.set(track, { x: 0 });
      gsap.to(track, {
        x: -fullWidth,
        duration: 40,
        ease: 'none',
        repeat: -1,
        // snap the position back on each repeat so floating-point never drifts
        onRepeat() {
          gsap.set(track, { x: 0 });
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      gsap.killTweensOf(track);
    };
  }, [items]);

  const content = items.map((item, i) => (
    <span key={i}>
      {item}<span className="star">✦</span>
    </span>
  ));

  return (
    <div className={['marquee', className].filter(Boolean).join(' ')}>
      {/* Single div containing two copies — GSAP slides it left by exactly one copy width */}
      <div ref={trackRef} className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
});
