import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Timeline } from '../Timeline';
import type { CaseStudyTimelineStep } from '../../../data/types';

// Mock GSAP to avoid DOM lifecycle issues in unit tests
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

const mockSteps: CaseStudyTimelineStep[] = [
  {
    phase: 'Découverte',
    duration: '2 semaines',
    description: 'Interviews utilisateurs et audit de l\'existant.',
  },
  {
    phase: 'Design',
    duration: '4 semaines',
    description: 'Wireframes, prototypes haute fidélité et tests utilisateurs.',
  },
  {
    phase: 'Développement',
    duration: '8 semaines',
    description: 'Implémentation frontend et backend, intégration API.',
  },
];

const mockPanelRef = { current: document.createElement('div') };

describe('Timeline', () => {
  it('renders one node per CaseStudyTimelineStep', () => {
    const { container } = render(
      <Timeline steps={mockSteps} panelRef={mockPanelRef} reducedMotion={false} />
    );
    // Each step should have a circular dot node
    const nodes = container.querySelectorAll('[data-timeline-node]');
    expect(nodes).toHaveLength(mockSteps.length);
  });

  it('each node displays step.phase and step.duration', () => {
    render(
      <Timeline steps={mockSteps} panelRef={mockPanelRef} reducedMotion={false} />
    );
    expect(screen.getByText('Découverte')).toBeInTheDocument();
    expect(screen.getByText('2 semaines')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('4 semaines')).toBeInTheDocument();
    expect(screen.getByText('Développement')).toBeInTheDocument();
    expect(screen.getByText('8 semaines')).toBeInTheDocument();
  });

  it('each node displays step.description', () => {
    render(
      <Timeline steps={mockSteps} panelRef={mockPanelRef} reducedMotion={false} />
    );
    expect(screen.getByText('Interviews utilisateurs et audit de l\'existant.')).toBeInTheDocument();
    expect(screen.getByText('Wireframes, prototypes haute fidélité et tests utilisateurs.')).toBeInTheDocument();
    expect(screen.getByText('Implémentation frontend et backend, intégration API.')).toBeInTheDocument();
  });

  it('renders a vertical connector line element', () => {
    const { container } = render(
      <Timeline steps={mockSteps} panelRef={mockPanelRef} reducedMotion={false} />
    );
    const connectorLine = container.querySelector('[data-timeline-connector]');
    expect(connectorLine).toBeInTheDocument();
  });

  it('when reducedMotion=true, all nodes are visible (opacity not set to 0)', () => {
    const { container } = render(
      <Timeline steps={mockSteps} panelRef={mockPanelRef} reducedMotion={true} />
    );
    const nodes = container.querySelectorAll('[data-timeline-node]');
    nodes.forEach((node) => {
      // In reduced motion mode, nodes should not have opacity:0 inline style
      expect((node as HTMLElement).style.opacity).not.toBe('0');
    });
  });

  it('renders without errors when steps array is empty', () => {
    expect(() => {
      render(
        <Timeline steps={[]} panelRef={mockPanelRef} reducedMotion={false} />
      );
    }).not.toThrow();
  });

  it('applies font-mono class to phase name', () => {
    render(
      <Timeline steps={[mockSteps[0]]} panelRef={mockPanelRef} reducedMotion={false} />
    );
    const phaseEl = screen.getByText('Découverte');
    expect(phaseEl.className).toContain('font-mono');
  });

  it('applies font-mono class to duration', () => {
    render(
      <Timeline steps={[mockSteps[0]]} panelRef={mockPanelRef} reducedMotion={false} />
    );
    const durationEl = screen.getByText('2 semaines');
    expect(durationEl.className).toContain('font-mono');
  });
});
