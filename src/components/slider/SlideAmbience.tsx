import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import type { SlideAmbience } from '../../data/types';

interface SlideAmbienceProps {
  ambience: SlideAmbience;
}

/** Atlas / data / tech — subtle dot matrix grid, reads as precision */
function GridAmbience() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-accent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.055,
        }}
      />
    </div>
  );
}

/** Pulse / health / wellness — expanding concentric rings, reads as heartbeat */
function PulseAmbience() {
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rings = [r1.current, r2.current, r3.current];
    rings.forEach((ring, i) => {
      if (!ring) return;
      gsap.fromTo(
        ring,
        { scale: 0.5, opacity: 0.22 },
        { scale: 2.8, opacity: 0, duration: 3.8, ease: 'power1.out', repeat: -1, delay: i * 1.25 }
      );
    });
    return () => { rings.forEach((r) => r && gsap.killTweensOf(r)); };
  }, []);

  const base = 'absolute w-40 h-40 rounded-full border border-accent/50';
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute" style={{ bottom: '30%', left: '20%' }}>
        <div ref={r1} className={base} style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-50%,-50%)' }} />
        <div ref={r2} className={base} style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-50%,-50%)' }} />
        <div ref={r3} className={base} style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-50%,-50%)' }} />
      </div>
    </div>
  );
}

/** Verde / eco / nature — floating organic blobs, reads as alive and slow */
function DriftAmbience() {
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (b1.current) gsap.to(b1.current, { x: 40, y: -30, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
    if (b2.current) gsap.to(b2.current, { x: -30, y: 40, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true });
    if (b3.current) gsap.to(b3.current, { x: 20, y: 20,  duration: 18, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 4 });
    return () => { [b1, b2, b3].forEach((r) => r.current && gsap.killTweensOf(r.current)); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div ref={b1} className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/[0.05] blur-3xl" />
      <div ref={b2} className="absolute bottom-1/3 left-1/2 w-56 h-56 rounded-full bg-accent/[0.04] blur-2xl" />
      <div ref={b3} className="absolute top-1/2 left-1/6 w-40 h-40 rounded-full bg-accent/[0.03] blur-2xl" />
    </div>
  );
}

export function SlideAmbience({ ambience }: SlideAmbienceProps) {
  if (ambience === 'grid')  return <GridAmbience />;
  if (ambience === 'pulse') return <PulseAmbience />;
  return <DriftAmbience />;
}
