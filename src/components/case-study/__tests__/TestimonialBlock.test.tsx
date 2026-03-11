import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TestimonialBlock } from '../TestimonialBlock';
import type { CaseStudyTestimonial } from '../../../data/types';

const mockTestimonial: CaseStudyTestimonial = {
  quote: "Hargile a transforme la facon dont nos equipes prennent des decisions.",
  author: 'Caroline Fontaine',
  role: 'Directrice des Operations, Atlas Corp.',
};

describe('TestimonialBlock', () => {
  it('renders the quote text', () => {
    render(<TestimonialBlock testimonial={mockTestimonial} />);
    expect(screen.getByText(mockTestimonial.quote)).toBeInTheDocument();
  });

  it('renders the author name', () => {
    render(<TestimonialBlock testimonial={mockTestimonial} />);
    expect(screen.getByText(/Caroline Fontaine/)).toBeInTheDocument();
  });

  it('renders the author role', () => {
    render(<TestimonialBlock testimonial={mockTestimonial} />);
    expect(screen.getByText(/Directrice des Operations, Atlas Corp\./)).toBeInTheDocument();
  });

  it('uses a blockquote element', () => {
    const { container } = render(<TestimonialBlock testimonial={mockTestimonial} />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('has accent border class on blockquote', () => {
    const { container } = render(<TestimonialBlock testimonial={mockTestimonial} />);
    const blockquote = container.querySelector('blockquote') as HTMLElement;
    expect(blockquote.className).toContain('border-l-4');
    expect(blockquote.className).toContain('border-accent');
  });

  it('has generous padding on blockquote', () => {
    const { container } = render(<TestimonialBlock testimonial={mockTestimonial} />);
    const blockquote = container.querySelector('blockquote') as HTMLElement;
    expect(blockquote.className).toContain('pl-8');
    expect(blockquote.className).toContain('py-6');
  });

  it('quote text is large and italic', () => {
    render(<TestimonialBlock testimonial={mockTestimonial} />);
    const quoteEl = screen.getByText(mockTestimonial.quote);
    expect(quoteEl.className).toContain('text-xl');
    expect(quoteEl.className).toContain('italic');
  });

  it('author line uses font-mono class', () => {
    render(<TestimonialBlock testimonial={mockTestimonial} />);
    // Author line contains "-- Caroline Fontaine, Directrice..."
    const authorEl = screen.getByText(/Caroline Fontaine/);
    expect(authorEl.className).toContain('font-mono');
  });
});
