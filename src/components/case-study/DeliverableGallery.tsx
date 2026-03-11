import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface DeliverableGalleryProps {
  images: string[];
  panelRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}

export function DeliverableGallery({ images, panelRef, reducedMotion }: DeliverableGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current || !panelRef.current) return;
    if (images.length === 0) return;

    const ctx = gsap.context(() => {
      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        const imgEl = el.querySelector('img');
        if (!imgEl) return;

        gsap.set(imgEl, { opacity: 0, y: 24 });

        ScrollTrigger.create({
          scroller: panelRef.current,
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(imgEl, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              delay: i * 0.08,
            });
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images, reducedMotion, panelRef]);

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2" ref={containerRef}>
      <div className="columns-2 md:columns-3 gap-4 px-4 md:px-8">
        {images.map((url, i) => (
          <div
            key={url}
            ref={(el) => { imageRefs.current[i] = el; }}
            className="break-inside-avoid mb-4"
          >
            <img
              src={url}
              alt=""
              loading="lazy"
              className="w-full h-auto block rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
