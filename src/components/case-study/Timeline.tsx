import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CaseStudyTimelineStep } from '../../data/types';

gsap.registerPlugin(ScrollTrigger);

interface TimelineProps {
  steps: CaseStudyTimelineStep[];
  panelRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}

export function Timeline({ steps, panelRef, reducedMotion }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current || !panelRef.current) return;
    if (steps.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate the connector line drawing down from scaleY(0) to scaleY(1)
      if (connectorRef.current) {
        gsap.set(connectorRef.current, { scaleY: 0, transformOrigin: 'top' });
        ScrollTrigger.create({
          trigger: containerRef.current,
          scroller: panelRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          once: true,
          onEnter: () => {
            gsap.to(connectorRef.current, {
              scaleY: 1,
              duration: 1.2,
              ease: 'power3.out',
            });
          },
        });
      }

      // Animate each node row: fade in from below + fill dot
      rowRefs.current.forEach((row, i) => {
        const nodeDot = nodeRefs.current[i];
        if (!row) return;

        gsap.set(row, { opacity: 0, y: 20 });

        ScrollTrigger.create({
          trigger: row,
          scroller: panelRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(row, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              delay: i * 0.08,
            });
            if (nodeDot) {
              // Animate node dot from unfilled (accent/20) to solid accent
              gsap.to(nodeDot, {
                backgroundColor: 'var(--color-accent)',
                duration: 0.4,
                ease: 'power3.out',
                delay: i * 0.08 + 0.15,
              });
            }
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [steps, panelRef, reducedMotion]);

  return (
    <div ref={containerRef} className="relative pl-8">
      {/* Vertical connector line */}
      <div
        ref={connectorRef}
        data-timeline-connector
        className="absolute left-3.25 top-2 bottom-2 w-0.5 bg-accent"
        style={reducedMotion ? {} : { transformOrigin: 'top' }}
      />

      {/* Timeline nodes */}
      <div className="space-y-10">
        {steps.map((step, index) => (
          <div
            key={index}
            ref={(el) => { rowRefs.current[index] = el; }}
            className="relative"
          >
            {/* Circular node dot */}
            <div
              ref={(el) => { nodeRefs.current[index] = el; }}
              data-timeline-node
              className="absolute -left-6.5 top-1 w-4 h-4 rounded-full border-2 border-accent"
              style={{
                backgroundColor: reducedMotion
                  ? 'var(--color-accent)'
                  : 'color-mix(in srgb, var(--color-accent) 20%, transparent)',
              }}
            />

            {/* Step header: phase name + duration */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-mono text-sm text-accent">{step.phase}</span>
              <span className="font-mono text-xs text-text-secondary">{step.duration}</span>
            </div>

            {/* Description */}
            <p className="text-text text-sm leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
