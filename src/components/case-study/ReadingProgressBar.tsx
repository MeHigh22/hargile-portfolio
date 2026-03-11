import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface ReadingProgressBarProps {
  panelRef: React.RefObject<HTMLDivElement | null>;
}

export function ReadingProgressBar({ panelRef }: ReadingProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const hasFadedIn = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !barRef.current) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = panel;
      const scrollable = scrollHeight - clientHeight;
      if (scrollable <= 0) return;

      const pct = (scrollTop / scrollable) * 100;

      if (!hasFadedIn.current && scrollTop > 10) {
        hasFadedIn.current = true;
        gsap.to(barRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }

      gsap.set(barRef.current, { width: pct + '%' });
    };

    panel.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      panel.removeEventListener('scroll', handleScroll);
    };
  }, [panelRef]);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[3px] bg-accent z-[110]"
      style={{ opacity: 0, width: '0%' }}
    />
  );
}
