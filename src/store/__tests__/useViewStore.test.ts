import { describe, it, expect, beforeEach } from 'vitest';
import { useViewStore } from '../useViewStore';
import { useSliderStore } from '../useSliderStore';

describe('useViewStore', () => {
  beforeEach(() => {
    // Reset both stores to initial state before each test
    useViewStore.setState({ mode: 'slider', activeProjectId: null });
    useSliderStore.setState({ isAnimating: false });
  });

  describe('initial state', () => {
    it('starts in slider mode', () => {
      expect(useViewStore.getState().mode).toBe('slider');
    });

    it('starts with null activeProjectId', () => {
      expect(useViewStore.getState().activeProjectId).toBeNull();
    });
  });

  describe('openCase', () => {
    it('sets mode to "case"', () => {
      useViewStore.getState().openCase('atlas');
      expect(useViewStore.getState().mode).toBe('case');
    });

    it('sets activeProjectId to the given project id', () => {
      useViewStore.getState().openCase('atlas');
      expect(useViewStore.getState().activeProjectId).toBe('atlas');
    });

    it('works for any project id', () => {
      useViewStore.getState().openCase('pulse');
      expect(useViewStore.getState().activeProjectId).toBe('pulse');

      useViewStore.setState({ mode: 'slider', activeProjectId: null });
      useViewStore.getState().openCase('verde');
      expect(useViewStore.getState().activeProjectId).toBe('verde');
    });

    it('is blocked (no-op) when useSliderStore.isAnimating is true', () => {
      useSliderStore.setState({ isAnimating: true });
      useViewStore.getState().openCase('atlas');

      // State must not have changed
      expect(useViewStore.getState().mode).toBe('slider');
      expect(useViewStore.getState().activeProjectId).toBeNull();
    });

    it('works when useSliderStore.isAnimating is false', () => {
      useSliderStore.setState({ isAnimating: false });
      useViewStore.getState().openCase('verde');

      expect(useViewStore.getState().mode).toBe('case');
      expect(useViewStore.getState().activeProjectId).toBe('verde');
    });
  });

  describe('closeCase', () => {
    it('resets mode to "slider"', () => {
      // First open a case
      useViewStore.setState({ mode: 'case', activeProjectId: 'atlas' });

      useViewStore.getState().closeCase();
      expect(useViewStore.getState().mode).toBe('slider');
    });

    it('resets activeProjectId to null', () => {
      useViewStore.setState({ mode: 'case', activeProjectId: 'atlas' });

      useViewStore.getState().closeCase();
      expect(useViewStore.getState().activeProjectId).toBeNull();
    });

    it('can be called from slider mode without error', () => {
      expect(() => useViewStore.getState().closeCase()).not.toThrow();
      expect(useViewStore.getState().mode).toBe('slider');
      expect(useViewStore.getState().activeProjectId).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('full round-trip: slider -> case -> slider', () => {
      const store = useViewStore.getState();

      // Open case
      store.openCase('pulse');
      expect(useViewStore.getState().mode).toBe('case');
      expect(useViewStore.getState().activeProjectId).toBe('pulse');

      // Close case
      useViewStore.getState().closeCase();
      expect(useViewStore.getState().mode).toBe('slider');
      expect(useViewStore.getState().activeProjectId).toBeNull();
    });

    it('openCase while already in case mode updates activeProjectId', () => {
      useViewStore.setState({ mode: 'case', activeProjectId: 'atlas' });
      useSliderStore.setState({ isAnimating: false });

      useViewStore.getState().openCase('verde');
      expect(useViewStore.getState().activeProjectId).toBe('verde');
    });
  });
});
