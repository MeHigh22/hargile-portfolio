import { describe, it, expect, beforeEach } from 'vitest';
import { useSliderStore } from '../useSliderStore';
import { projects } from '../../data/projects';

describe('useSliderStore', () => {
  beforeEach(() => {
    useSliderStore.setState({
      currentIndex: 0,
      direction: 1,
      isAnimating: false,
    });
  });

  it('totalSlides equals projects.length (12+)', () => {
    const { totalSlides } = useSliderStore.getState();
    expect(totalSlides).toBe(projects.length);
    expect(totalSlides).toBeGreaterThanOrEqual(12);
  });

  describe('nextSlide', () => {
    it('increments currentIndex by 1 and sets direction to 1', () => {
      useSliderStore.getState().nextSlide();
      const state = useSliderStore.getState();
      expect(state.currentIndex).toBe(1);
      expect(state.direction).toBe(1);
    });

    it('sets isAnimating to true', () => {
      useSliderStore.getState().nextSlide();
      expect(useSliderStore.getState().isAnimating).toBe(true);
    });

    it('does nothing when currentIndex is at last slide', () => {
      const total = useSliderStore.getState().totalSlides;
      useSliderStore.setState({ currentIndex: total - 1 });
      useSliderStore.getState().nextSlide();
      expect(useSliderStore.getState().currentIndex).toBe(total - 1);
    });

    it('is blocked when isAnimating is true', () => {
      useSliderStore.setState({ isAnimating: true });
      useSliderStore.getState().nextSlide();
      expect(useSliderStore.getState().currentIndex).toBe(0);
    });
  });

  describe('prevSlide', () => {
    it('decrements currentIndex by 1 and sets direction to -1', () => {
      useSliderStore.setState({ currentIndex: 3 });
      useSliderStore.getState().prevSlide();
      const state = useSliderStore.getState();
      expect(state.currentIndex).toBe(2);
      expect(state.direction).toBe(-1);
    });

    it('sets isAnimating to true', () => {
      useSliderStore.setState({ currentIndex: 3 });
      useSliderStore.getState().prevSlide();
      expect(useSliderStore.getState().isAnimating).toBe(true);
    });

    it('does nothing when currentIndex is 0', () => {
      useSliderStore.getState().prevSlide();
      expect(useSliderStore.getState().currentIndex).toBe(0);
    });

    it('is blocked when isAnimating is true', () => {
      useSliderStore.setState({ currentIndex: 3, isAnimating: true });
      useSliderStore.getState().prevSlide();
      expect(useSliderStore.getState().currentIndex).toBe(3);
    });
  });

  describe('goToSlide', () => {
    it('sets currentIndex to n and computes direction from current position (forward)', () => {
      useSliderStore.getState().goToSlide(5);
      const state = useSliderStore.getState();
      expect(state.currentIndex).toBe(5);
      expect(state.direction).toBe(1);
    });

    it('sets direction to -1 when navigating backward', () => {
      useSliderStore.setState({ currentIndex: 5 });
      useSliderStore.getState().goToSlide(2);
      const state = useSliderStore.getState();
      expect(state.currentIndex).toBe(2);
      expect(state.direction).toBe(-1);
    });

    it('clamps index to valid range [0, totalSlides-1] (upper)', () => {
      const total = useSliderStore.getState().totalSlides;
      useSliderStore.getState().goToSlide(100);
      expect(useSliderStore.getState().currentIndex).toBe(total - 1);
    });

    it('clamps index to valid range [0, totalSlides-1] (lower)', () => {
      useSliderStore.setState({ currentIndex: 5 });
      useSliderStore.getState().goToSlide(-10);
      expect(useSliderStore.getState().currentIndex).toBe(0);
    });

    it('does nothing when navigating to the same index', () => {
      useSliderStore.setState({ currentIndex: 3, isAnimating: false });
      useSliderStore.getState().goToSlide(3);
      expect(useSliderStore.getState().isAnimating).toBe(false);
    });

    it('is blocked when isAnimating is true', () => {
      useSliderStore.setState({ isAnimating: true });
      useSliderStore.getState().goToSlide(5);
      expect(useSliderStore.getState().currentIndex).toBe(0);
    });

    it('sets isAnimating to true on successful navigation', () => {
      useSliderStore.getState().goToSlide(5);
      expect(useSliderStore.getState().isAnimating).toBe(true);
    });
  });

  describe('setAnimating', () => {
    it('sets isAnimating to false to unlock navigation', () => {
      useSliderStore.setState({ isAnimating: true });
      useSliderStore.getState().setAnimating(false);
      expect(useSliderStore.getState().isAnimating).toBe(false);
    });

    it('sets isAnimating to true', () => {
      useSliderStore.getState().setAnimating(true);
      expect(useSliderStore.getState().isAnimating).toBe(true);
    });
  });
});
