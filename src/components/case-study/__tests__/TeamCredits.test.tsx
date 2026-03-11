import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TeamCredits } from '../TeamCredits';
import type { CaseStudyTeamMember } from '../../../data/types';

const mockTeam: CaseStudyTeamMember[] = [
  { name: 'Thomas Beaumont', role: 'Lead Designer' },
  { name: 'Sarah Michelet', role: 'Ingenieure Frontend' },
  { name: 'Alexandre Perrin', role: 'Architecte Backend' },
];

describe('TeamCredits', () => {
  it('renders one card per team member', () => {
    render(<TeamCredits team={mockTeam} />);
    expect(screen.getByText('Thomas Beaumont')).toBeInTheDocument();
    expect(screen.getByText('Sarah Michelet')).toBeInTheDocument();
    expect(screen.getByText('Alexandre Perrin')).toBeInTheDocument();
  });

  it('renders each member role', () => {
    render(<TeamCredits team={mockTeam} />);
    expect(screen.getByText('Lead Designer')).toBeInTheDocument();
    expect(screen.getByText('Ingenieure Frontend')).toBeInTheDocument();
    expect(screen.getByText('Architecte Backend')).toBeInTheDocument();
  });

  it('renders initial avatar for each member (first letter of name)', () => {
    render(<TeamCredits team={mockTeam} />);
    // Initials: T, S, A
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('uses a responsive grid layout', () => {
    const { container } = render(<TeamCredits team={mockTeam} />);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-2');
  });

  it('each card has border and rounded corners', () => {
    const { container } = render(<TeamCredits team={mockTeam} />);
    const cards = container.querySelectorAll('.rounded-lg');
    expect(cards.length).toBeGreaterThanOrEqual(mockTeam.length);
  });

  it('renders without errors when team array is empty', () => {
    expect(() => {
      render(<TeamCredits team={[]} />);
    }).not.toThrow();
  });

  it('avatar circle has text-accent class', () => {
    const { container } = render(<TeamCredits team={[mockTeam[0]]} />);
    const avatar = container.querySelector('.text-accent') as HTMLElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.textContent).toBe('T');
  });
});
