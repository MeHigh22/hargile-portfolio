import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';
import { useParallax } from '../useParallax';

vi.mock('gsap', () => ({
  default: {
    to:  vi.fn(() => ({ kill: vi.fn() })),
    set: vi.fn(),
  },
}));

describe('useParallax', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    const slide = document.createElement('div');
    const heroImg = document.createElement('img');
    heroImg.setAttribute('data-parallax', '');
    slide.appendChild(heroImg);
    container.appendChild(slide);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('starts an ambient tween on the hero element', async () => {
    const gsap = (await import('gsap')).default;

    renderHook(() => {
      const containerRef  = useRef<HTMLDivElement>(container);
      const slideRefs     = useRef<(HTMLDivElement | null)[]>([container.querySelector('div') as HTMLDivElement]);
      const animatingRef  = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, false, 'grid');
      return null;
    });

    expect(gsap.to).toHaveBeenCalledWith(
      expect.any(HTMLImageElement),
      expect.objectContaining({ repeat: -1, yoyo: true })
    );
  });

  it('does not start a tween when isReducedMotion is true', async () => {
    const gsap = (await import('gsap')).default;

    renderHook(() => {
      const containerRef  = useRef<HTMLDivElement>(container);
      const slideRefs     = useRef<(HTMLDivElement | null)[]>([container.querySelector('div') as HTMLDivElement]);
      const animatingRef  = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, true, 'grid');
      return null;
    });

    expect(gsap.to).not.toHaveBeenCalled();
  });

  it('kills the tween on unmount', async () => {
    const killMock = vi.fn();
    const gsap = (await import('gsap')).default;
    vi.mocked(gsap.to).mockReturnValue({ kill: killMock } as unknown as ReturnType<typeof gsap.to>);

    const { unmount } = renderHook(() => {
      const containerRef  = useRef<HTMLDivElement>(container);
      const slideRefs     = useRef<(HTMLDivElement | null)[]>([container.querySelector('div') as HTMLDivElement]);
      const animatingRef  = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, false, 'pulse');
      return null;
    });

    unmount();
    expect(killMock).toHaveBeenCalled();
  });

  it('uses different motion configs per ambience type', async () => {
    const gsap = (await import('gsap')).default;

    const testAmbience = async (ambience: 'grid' | 'pulse' | 'drift') => {
      vi.mocked(gsap.to).mockClear();
      const { unmount } = renderHook(() => {
        const containerRef = useRef<HTMLDivElement>(container);
        const slideRefs    = useRef<(HTMLDivElement | null)[]>([container.querySelector('div') as HTMLDivElement]);
        const animatingRef = useRef(false);
        useParallax(containerRef, slideRefs, 0, animatingRef, false, ambience);
        return null;
      });
      const call = vi.mocked(gsap.to).mock.calls[0]?.[1] as Record<string, unknown>;
      unmount();
      return call;
    };

    const grid  = await testAmbience('grid');
    const pulse = await testAmbience('pulse');
    const drift = await testAmbience('drift');

    // Each ambience should produce distinct motion parameters
    expect(grid?.duration).not.toBe(pulse?.duration);
    expect(pulse?.duration).not.toBe(drift?.duration);
  });
});
