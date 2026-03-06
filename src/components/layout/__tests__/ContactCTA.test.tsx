import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactCTA } from '../ContactCTA';

describe('ContactCTA', () => {
  it('renders an anchor element with href="mailto:contact@hargile.com"', () => {
    render(<ContactCTA />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'mailto:contact@hargile.com');
  });

  it('displays text "Travaillons ensemble"', () => {
    render(<ContactCTA />);
    expect(screen.getByText('Travaillons ensemble')).toBeInTheDocument();
  });

  it('has position fixed with bottom-right placement', () => {
    render(<ContactCTA />);
    const link = screen.getByRole('link');
    expect(link.className).toMatch(/fixed/);
    expect(link.className).toMatch(/bottom-8/);
    expect(link.className).toMatch(/right-8/);
  });

  it('has z-50 for proper stacking', () => {
    render(<ContactCTA />);
    const link = screen.getByRole('link');
    expect(link.className).toMatch(/z-50/);
  });
});
