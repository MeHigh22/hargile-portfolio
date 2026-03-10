import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRef } from 'react';
import { useParallax } from '../useParallax';

// Mock gsap
vi.mock('gsap', () => {
  const tickerCallbacks: Array<() => void> = [];

  const quickToFn = vi.fn(() => vi.fn());

  return {
    default: {
      quickTo: quickToFn,
      ticker: {
        add: vi.fn((cb: () => void) => { tickerCallbacks.push(cb); }),
        remove: vi.fn((cb: () => void) => {
          const idx = tickerCallbacks.indexOf(cb);
          if (idx !== -1) tickerCallbacks.splice(idx, 1);
        }),
      },
      set: vi.fn(),
    },
  };
});

describe('useParallax', () => {
  let container: HTMLDivElement;
  let heroImg: HTMLImageElement;

  beforeEach(async () => {
    container = document.createElement('div');
    container.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 1920,
      height: 1080,
      right: 1920,
      bottom: 1080,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));

    const slide = document.createElement('div');
    heroImg = document.createElement('img');
    heroImg.setAttribute('data-parallax', '');
    slide.appendChild(heroImg);
    container.appendChild(slide);
    document.body.appendChild(container);

    const gsap = (await import('gsap')).default;
    vi.mocked(gsap.quickTo).mockReturnValue(vi.fn() as ReturnType<typeof gsap.quickTo>);
    vi.mocked(gsap.ticker.add).mockClear();
    vi.mocked(gsap.ticker.remove).mockClear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('adds a mousemove listener to the container element', async () => {
    const addEventSpy = vi.spyOn(container, 'addEventListener');

    const { result } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      const slideRefs = useRef<(HTMLDivElement | null)[]>([
        container.querySelector('div') as HTMLDivElement,
      ]);
      const animatingRef = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, false);
      return null;
    });

    expect(result.current).toBeNull();
    expect(addEventSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('removes the mousemove listener on cleanup', async () => {
    const removeEventSpy = vi.spyOn(container, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      const slideRefs = useRef<(HTMLDivElement | null)[]>([
        container.querySelector('div') as HTMLDivElement,
      ]);
      const animatingRef = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, false);
      return null;
    });

    unmount();

    expect(removeEventSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('adds a ticker callback on mount', async () => {
    const gsap = (await import('gsap')).default;

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      const slideRefs = useRef<(HTMLDivElement | null)[]>([
        container.querySelector('div') as HTMLDivElement,
      ]);
      const animatingRef = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, false);
      return null;
    });

    expect(gsap.ticker.add).toHaveBeenCalledWith(expect.any(Function));
  });

  it('does not add listener when isReducedMotion is true', async () => {
    const addEventSpy = vi.spyOn(container, 'addEventListener');

    renderHook(() => {
      const containerRef = useRef<HTMLDivElement>(container);
      const slideRefs = useRef<(HTMLDivElement | null)[]>([
        container.querySelector('div') as HTMLDivElement,
      ]);
      const animatingRef = useRef(false);
      useParallax(containerRef, slideRefs, 0, animatingRef, true);
      return null;
    });

    expect(addEventSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
  });
});
