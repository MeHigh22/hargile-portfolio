import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { CaseStudyMetric } from '../../data/types';

gsap.registerPlugin(ScrollTrigger);

export interface ParsedMetric {
  prefix: string;
  numeric: number;
  suffix: string;
}

export function parseMetricValue(value: string): ParsedMetric {
  // Match optional non-digit prefix, then a number (possibly negative, possibly decimal), then the rest
  const match = value.match(/^([^0-9-]*)(-?[\d.]+)(.*)$/);
  if (!match) {
    return { prefix: '', numeric: 0, suffix: value };
  }
  return {
    prefix: match[1],
    numeric: parseFloat(match[2]),
    suffix: match[3],
  };
}

export interface MetricCounterProps {
  metric: CaseStudyMetric;
  index: number;
  panelRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
}

export function MetricCounter({ metric, index, panelRef, reducedMotion }: MetricCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<{ val: number }>({ val: 0 });

  const parsed = parseMetricValue(metric.value);
  const hasDecimal = !Number.isInteger(parsed.numeric);

  useEffect(() => {
    if (reducedMotion) return;
    if (!containerRef.current || !panelRef.current) return;

    const ctx = gsap.context(() => {
      valRef.current.val = 0;
      const absNumeric = Math.abs(parsed.numeric);
      const isNegative = parsed.numeric < 0;

      ScrollTrigger.create({
        scroller: panelRef.current,
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(valRef.current, {
            val: absNumeric,
            duration: 1,
            ease: 'power2.out',
            delay: index * 0.12,
            snap: { val: hasDecimal ? 0.1 : 1 },
            onUpdate: () => {
              const numEl = containerRef.current?.querySelector('[data-metric-num]');
              if (numEl) {
                const displayVal = hasDecimal
                  ? valRef.current.val.toFixed(1)
                  : Math.round(valRef.current.val).toString();
                numEl.textContent = parsed.prefix + (isNegative ? '-' : '') + displayVal + parsed.suffix;
              }
            },
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, parsed.numeric, parsed.prefix, parsed.suffix, hasDecimal, index, panelRef]);

  return (
    <div ref={containerRef} className="flex flex-col gap-1">
      {reducedMotion ? (
        <span className="text-4xl md:text-5xl font-bold text-accent">
          {metric.value}
        </span>
      ) : (
        <span
          data-metric-num
          className="text-4xl md:text-5xl font-bold text-accent"
        >
          {metric.value}
        </span>
      )}
      <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
        {metric.label}
      </span>
    </div>
  );
}
