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

    const raf = requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      gsap.killTweensOf(track);

      // Desktop: fixed 60s (original feel). Mobile: slower 40px/s.
      const duration = window.innerWidth < 768 ? halfWidth / 35 : 75;

      // Proxy + wrap: playhead runs forever, wrap keeps x in [-halfWidth, 0)
      // so there is never a hard position reset — fully seamless
      const proxy = { x: 0 };
      const wrap = gsap.utils.wrap(-halfWidth, 0);

      gsap.to(proxy, {
        x: -halfWidth,
        duration,
        ease: 'none',
        repeat: -1,
        onUpdate() {
          gsap.set(track, { x: wrap(proxy.x) });
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
      <div ref={trackRef} className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
});
