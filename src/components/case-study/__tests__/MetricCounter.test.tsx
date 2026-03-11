import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetricCounter, parseMetricValue } from '../MetricCounter';
import type { CaseStudyMetric } from '../../../data/types';

vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    to: vi.fn(),
    set: vi.fn(),
    registerPlugin: vi.fn(),
    matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
  },
}));

const mockPanelRef = { current: document.createElement('div') };

describe('parseMetricValue', () => {
  it('parses a negative percentage value', () => {
    const result = parseMetricValue('-60%');
    expect(result.prefix).toBe('');
    expect(result.numeric).toBe(-60);
    expect(result.suffix).toBe('%');
  });

  it('parses a positive percentage with + prefix', () => {
    const result = parseMetricValue('+85%');
    expect(result.prefix).toBe('+');
    expect(result.numeric).toBe(85);
    expect(result.suffix).toBe('%');
  });

  it('parses a decimal rating like 4.7/5', () => {
    const result = parseMetricValue('4.7/5');
    expect(result.prefix).toBe('');
    expect(result.numeric).toBe(4.7);
    expect(result.suffix).toBe('/5');
  });

  it('parses a value with text suffix like 3x secteur', () => {
    const result = parseMetricValue('3x secteur');
    expect(result.prefix).toBe('');
    expect(result.numeric).toBe(3);
    expect(result.suffix).toBe('x secteur');
  });

  it('parses a value with + prefix and text suffix', () => {
    const result = parseMetricValue('+320%');
    expect(result.prefix).toBe('+');
    expect(result.numeric).toBe(320);
    expect(result.suffix).toBe('%');
  });

  it('falls back gracefully when no number found', () => {
    const result = parseMetricValue('N/A');
    expect(result.prefix).toBe('');
    expect(result.numeric).toBe(0);
    expect(result.suffix).toBe('N/A');
  });

  it('parses a plain number string', () => {
    const result = parseMetricValue('92%');
    expect(result.prefix).toBe('');
    expect(result.numeric).toBe(92);
    expect(result.suffix).toBe('%');
  });
});

describe('MetricCounter', () => {
  const metric: CaseStudyMetric = {
    label: "Temps d'analyse",
    value: '-60%',
  };

  it('renders the metric label', () => {
    render(
      <MetricCounter
        metric={metric}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={true}
      />
    );
    expect(screen.getByText("Temps d'analyse")).toBeInTheDocument();
  });

  it('renders metric value directly when reducedMotion=true', () => {
    render(
      <MetricCounter
        metric={metric}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={true}
      />
    );
    expect(screen.getByText('-60%')).toBeInTheDocument();
  });

  it('renders prefix, numeric placeholder, and suffix when reducedMotion=false', () => {
    render(
      <MetricCounter
        metric={metric}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={false}
      />
    );
    expect(screen.getByText('-60%')).toBeInTheDocument();
  });

  it('renders label with uppercase mono font class', () => {
    render(
      <MetricCounter
        metric={metric}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={true}
      />
    );
    const labelEl = screen.getByText("Temps d'analyse");
    expect(labelEl.className).toContain('font-mono');
    expect(labelEl.className).toContain('uppercase');
  });

  it('handles value with text suffix like 3x secteur', () => {
    const metricWithText: CaseStudyMetric = { label: 'Taux de conversion', value: '3x secteur' };
    render(
      <MetricCounter
        metric={metricWithText}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={true}
      />
    );
    expect(screen.getByText('3x secteur')).toBeInTheDocument();
  });

  it('handles decimal value like 4.7/5', () => {
    const metricDecimal: CaseStudyMetric = { label: 'Satisfaction', value: '4.7/5' };
    render(
      <MetricCounter
        metric={metricDecimal}
        index={0}
        panelRef={mockPanelRef}
        reducedMotion={true}
      />
    );
    expect(screen.getByText('4.7/5')).toBeInTheDocument();
  });
});
