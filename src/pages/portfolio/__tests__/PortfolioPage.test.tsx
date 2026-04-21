import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../../../App';
import { PortfolioPage } from '../PortfolioPage';

// Mock GSAP — comprehensive mock to cover SlideAmbience.fromTo and all Slider/CaseStudy usage
vi.mock('gsap', () => ({
  default: {
    context: vi.fn(() => ({ revert: vi.fn() })),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn(), from: vi.fn(), fromTo: vi.fn() })),
    registerPlugin: vi.fn(),
    matchMedia: vi.fn(() => ({ add: vi.fn(), revert: vi.fn() })),
    killTweensOf: vi.fn(),
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() },
}));
vi.mock('gsap/Observer', () => ({
  Observer: { create: vi.fn(() => ({ kill: vi.fn(), enable: vi.fn(), disable: vi.fn() })) },
}));

describe('PortfolioPage smoke tests', () => {
  it('renders PortfolioPage without throwing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/portfolio']}>
        <Routes>
          <Route path="/portfolio/*" element={<PortfolioPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.querySelector('[data-portfolio]')).toBeTruthy();
  });

  it('renders App (/) without throwing', () => {
    // Use try/catch instead of expect().not.toThrow() to get real error details
    // and avoid AggregateError wrapping from React 18 act() internals
    let renderError: unknown = null;
    try {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </MemoryRouter>
      );
    } catch (err) {
      renderError = err;
    }
    expect(renderError).toBeNull();
  });
});
