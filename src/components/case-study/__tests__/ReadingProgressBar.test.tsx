import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReadingProgressBar } from '../ReadingProgressBar';

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

describe('ReadingProgressBar', () => {
  it('renders a fixed bar element', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar).toBeInTheDocument();
    expect(bar.className).toContain('fixed');
  });

  it('is positioned at top-0 left-0', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain('top-0');
    expect(bar.className).toContain('left-0');
  });

  it('has h-[3px] height class', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain('h-[3px]');
  });

  it('has bg-accent color class', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain('bg-accent');
  });

  it('has z-[110] to stay above case study', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.className).toContain('z-[110]');
  });

  it('starts with opacity 0 inline style', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.opacity).toBe('0');
  });

  it('starts with width 0% inline style', () => {
    const { container } = render(<ReadingProgressBar panelRef={mockPanelRef} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.style.width).toBe('0%');
  });
});
