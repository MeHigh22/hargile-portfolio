import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NextProjectCard } from '../NextProjectCard';

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

const mockOpenCase = vi.fn();

vi.mock('../../../store/useViewStore', () => ({
  useViewStore: {
    getState: vi.fn(() => ({ openCase: mockOpenCase })),
  },
}));

describe('NextProjectCard', () => {
  beforeEach(() => {
    mockOpenCase.mockClear();
  });

  it('renders "Projet suivant" label', () => {
    render(<NextProjectCard projectId="atlas" />);
    expect(screen.getByText('Projet suivant')).toBeInTheDocument();
  });

  it('renders next project title after atlas (which is pulse)', () => {
    render(<NextProjectCard projectId="atlas" />);
    // After atlas comes pulse — title is "Pulse"
    expect(screen.getByText(/Pulse/i)).toBeInTheDocument();
  });

  it('renders next project title after pulse (which is verde)', () => {
    render(<NextProjectCard projectId="pulse" />);
    expect(screen.getByText(/Verde/i)).toBeInTheDocument();
  });

  it('wraps circularly: after verde comes atlas', () => {
    render(<NextProjectCard projectId="verde" />);
    expect(screen.getByText(/Atlas/i)).toBeInTheDocument();
  });

  it('renders next project category', () => {
    render(<NextProjectCard projectId="atlas" />);
    // Pulse's category is "Application Mobile"
    expect(screen.getByText('Application Mobile')).toBeInTheDocument();
  });

  it('calls openCase with next project id on click', () => {
    render(<NextProjectCard projectId="atlas" />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOpenCase).toHaveBeenCalledWith('pulse');
  });

  it('calls openCase with atlas when clicking from verde (circular)', () => {
    render(<NextProjectCard projectId="verde" />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockOpenCase).toHaveBeenCalledWith('atlas');
  });

  it('has minimum height on the card', () => {
    render(<NextProjectCard projectId="atlas" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('min-h-');
  });

  it('has cursor-pointer on the clickable card', () => {
    const { container } = render(<NextProjectCard projectId="atlas" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('cursor-pointer');
  });
});
