import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DeliverableGallery } from '../DeliverableGallery';

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

const mockImages = [
  'https://images.unsplash.com/photo-111?fm=webp&w=800&q=80',
  'https://images.unsplash.com/photo-222?fm=webp&w=800&q=80',
  'https://images.unsplash.com/photo-333?fm=webp&w=800&q=80',
];

describe('DeliverableGallery', () => {
  it('renders one img per image URL', () => {
    const { container } = render(
      <DeliverableGallery images={mockImages} panelRef={mockPanelRef} reducedMotion={true} />
    );
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(mockImages.length);
  });

  it('each img has the correct src attribute', () => {
    const { container } = render(
      <DeliverableGallery images={mockImages} panelRef={mockPanelRef} reducedMotion={true} />
    );
    const imgs = container.querySelectorAll('img');
    mockImages.forEach((url, i) => {
      expect((imgs[i] as HTMLImageElement).src).toBe(url);
    });
  });

  it('each img has lazy loading attribute', () => {
    const { container } = render(
      <DeliverableGallery images={mockImages} panelRef={mockPanelRef} reducedMotion={true} />
    );
    const imgs = container.querySelectorAll('img');
    imgs.forEach((img) => {
      expect(img.getAttribute('loading')).toBe('lazy');
    });
  });

  it('each image wrapper has overflow-hidden class', () => {
    const { container } = render(
      <DeliverableGallery images={mockImages} panelRef={mockPanelRef} reducedMotion={true} />
    );
    const wrappers = container.querySelectorAll('.overflow-hidden');
    expect(wrappers.length).toBeGreaterThanOrEqual(mockImages.length);
  });

  it('uses grid layout classes', () => {
    const { container } = render(
      <DeliverableGallery images={mockImages} panelRef={mockPanelRef} reducedMotion={true} />
    );
    // The inner grid container should have grid class
    const gridEl = container.querySelector('.grid');
    expect(gridEl).toBeInTheDocument();
  });

  it('renders empty without errors when images array is empty', () => {
    expect(() => {
      render(
        <DeliverableGallery images={[]} panelRef={mockPanelRef} reducedMotion={true} />
      );
    }).not.toThrow();
  });
});
