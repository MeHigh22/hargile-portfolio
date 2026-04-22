import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Slide } from '../Slide';
import type { ProjectData } from '../../../data/types';

const mockProject: ProjectData = {
  id: 'test-project',
  title1: 'Test',
  title2: 'Project',
  category: 'Plateforme SaaS',
  year: '2025',
  subtitle: 'A test subtitle',
  client: 'Test Corp',
  services: 'UI/UX, Dev',
  duration: '4 mois',
  tech: 'React, Node.js, AWS',
  heroImg: 'https://example.com/hero.jpg',
  colors: {
    accent: '#96b8f7',
    background: '#06080d',
    gradientFrom: '#96b8f7',
    gradientTo: '#b896f7',
  },
  ambience: 'grid',
  imageRatio: 'balanced',
  industry: 'SaaS',
  narrative: {
    problem: 'The old dashboard was slow.',
    solution: 'Complete redesign with reactive architecture.',
    outcome: 'Analysis time reduced by 60%.',
  },
};

describe('Slide', () => {
  it('renders an img element with src matching project.heroImg', () => {
    render(<Slide project={mockProject} index={0} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProject.heroImg);
  });

  it('renders three labeled narrative sections: Probleme, Solution, Resultat', () => {
    render(<Slide project={mockProject} index={0} />);
    expect(screen.getByText('Probleme')).toBeInTheDocument();
    expect(screen.getByText('Solution')).toBeInTheDocument();
    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText(mockProject.narrative.problem)).toBeInTheDocument();
    expect(screen.getByText(mockProject.narrative.solution)).toBeInTheDocument();
    expect(screen.getByText(mockProject.narrative.outcome)).toBeInTheDocument();
  });

  it('renders project.industry as a pill/chip tag', () => {
    render(<Slide project={mockProject} index={0} />);
    expect(screen.getByText('SaaS')).toBeInTheDocument();
  });

  it('renders each tech item as individual pill/chip tags', () => {
    render(<Slide project={mockProject} index={0} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('renders project.year as a pill/chip tag', () => {
    render(<Slide project={mockProject} index={0} />);
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('preserves data-index attribute on root element', () => {
    const { container } = render(<Slide project={mockProject} index={3} />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('data-index', '3');
  });

  it('has data-anim attributes for animation targeting', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    expect(container.querySelector('[data-anim="category"]')).toBeInTheDocument();
    expect(container.querySelector('[data-anim="title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-anim="narrative"]')).toBeInTheDocument();
    expect(container.querySelector('[data-anim="tags"]')).toBeInTheDocument();
    expect(container.querySelector('[data-anim="hero"]')).toBeInTheDocument();
  });

  it('uses loading="eager" for index 0 and 1, lazy otherwise', () => {
    const { unmount } = render(<Slide project={mockProject} index={0} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    unmount();

    const { unmount: unmount1 } = render(<Slide project={mockProject} index={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
    unmount1();

    render(<Slide project={mockProject} index={2} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('renders hero image inside a <picture> element', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const picture = container.querySelector('picture');
    expect(picture).toBeInTheDocument();
  });

  it('picture element contains a WebP source', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const webpSource = container.querySelector('source[type="image/webp"]');
    expect(webpSource).toBeInTheDocument();
  });

  it('picture element contains a JPEG source', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const jpegSource = container.querySelector('source[type="image/jpeg"]');
    expect(jpegSource).toBeInTheDocument();
  });

  it('img inside picture has data-parallax attribute', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const img = container.querySelector('picture img');
    expect(img).toHaveAttribute('data-parallax');
  });

  it('img inside picture has scale- class for parallax headroom', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const img = container.querySelector('picture img');
    expect(img?.className).toMatch(/scale-/);
  });

  it('hero image srcset includes 3 responsive breakpoints in WebP source', () => {
    const { container } = render(<Slide project={mockProject} index={0} />);
    const webpSource = container.querySelector('source[type="image/webp"]');
    const srcSet = webpSource?.getAttribute('srcset') ?? '';
    expect(srcSet).toContain('640w');
    expect(srcSet).toContain('1280w');
    expect(srcSet).toContain('1920w');
  });

  it('applies loading="lazy" on img for slides with index >= 2', () => {
    const { container } = render(<Slide project={mockProject} index={2} />);
    const img = container.querySelector('picture img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
