import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHashSync } from '../useHashSync';
import { useSliderStore } from '../../store/useSliderStore';
import { projects } from '../../data/projects';

describe('useHashSync', () => {
  beforeEach(() => {
    // Reset store
    useSliderStore.setState({
      currentIndex: 0,
      direction: 1,
      isAnimating: false,
    });
    // Reset hash
    window.location.hash = '';
    // Mock history methods
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
    vi.spyOn(window.history, 'replaceState').mockImplementation(() => {});
  });

  it('reads hash on mount and calls goToSlide for matching project', () => {
    const targetProject = projects[3];
    window.location.hash = `#${targetProject.id}`;

    renderHook(() => useHashSync());

    // goToSlide sets isAnimating to true when navigating
    const state = useSliderStore.getState();
    expect(state.currentIndex).toBe(3);
  });

  it('ignores unrecognized hash on mount', () => {
    window.location.hash = '#nonexistent';

    renderHook(() => useHashSync());

    expect(useSliderStore.getState().currentIndex).toBe(0);
  });

  it('updates hash via pushState when currentIndex changes', () => {
    renderHook(() => useHashSync());

    act(() => {
      useSliderStore.setState({ currentIndex: 2, isAnimating: false });
    });

    expect(window.history.pushState).toHaveBeenCalledWith(
      null,
      '',
      `#${projects[2].id}`
    );
  });

  it('does not pushState if hash already matches current project (loop prevention)', () => {
    window.location.hash = `#${projects[0].id}`;

    renderHook(() => useHashSync());

    // Reset mock call count after mount
    (window.history.pushState as ReturnType<typeof vi.fn>).mockClear();

    // Set to index 0 again (same as hash)
    act(() => {
      useSliderStore.setState({ currentIndex: 0, isAnimating: false });
    });

    expect(window.history.pushState).not.toHaveBeenCalled();
  });

  it('handles popstate event by navigating to hash project', () => {
    renderHook(() => useHashSync());

    // Simulate browser back/forward
    window.location.hash = `#${projects[5].id}`;
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(useSliderStore.getState().currentIndex).toBe(5);
  });

  it('uses replaceState for initial load hash update', () => {
    renderHook(() => useHashSync());

    // On mount with index 0, it should use replaceState (not pushState) to set initial hash
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      `#${projects[0].id}`
    );
  });
});
