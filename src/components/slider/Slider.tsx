import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';
import { useSliderStore } from '../../store/useSliderStore';
import { projects } from '../../data/projects';
import { Slide } from './Slide';
import { SliderControls } from './SliderControls';

gsap.registerPlugin(Observer, useGSAP);

export function Slider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(0);

  const { contextSafe } = useGSAP(
    () => {
      // Initial setup: all slides offscreen, first slide visible
      gsap.set('[data-index]', { xPercent: 100 });
      gsap.set('[data-index="0"]', { xPercent: 0 });

      // Unified input handling via GSAP Observer
      Observer.create({
        target: containerRef.current!,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 10,
        dragMinimum: 5,
        preventDefault: true,
        onDown: () => {
          const store = useSliderStore.getState();
          if (!store.isAnimating) store.nextSlide();
        },
        onUp: () => {
          const store = useSliderStore.getState();
          if (!store.isAnimating) store.prevSlide();
        },
      });
    },
    { scope: containerRef }
  );

  // Animate slide transitions when currentIndex changes
  const currentIndex = useSliderStore((s) => s.currentIndex);
  const direction = useSliderStore((s) => s.direction);

  const animateTransition = contextSafe(
    (newIndex: number, prevIndex: number, dir: number) => {
      const tl = gsap.timeline({
        onComplete: () => useSliderStore.getState().setAnimating(false),
      });

      // Slide the previous slide out
      tl.to(`[data-index="${prevIndex}"]`, {
        xPercent: -100 * dir,
        duration: 0.8,
        ease: 'power3.inOut',
      });

      // Slide the new slide in
      tl.fromTo(
        `[data-index="${newIndex}"]`,
        { xPercent: 100 * dir },
        { xPercent: 0, duration: 0.8, ease: 'power3.inOut' },
        '<' // concurrent with exit
      );
    }
  );

  useEffect(() => {
    if (currentIndex !== prevIndexRef.current) {
      animateTransition(currentIndex, prevIndexRef.current, direction);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex, direction, animateTransition]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
    >
      {projects.map((project, index) => (
        <Slide key={project.id} project={project} index={index} />
      ))}
      <SliderControls />
    </div>
  );
}
