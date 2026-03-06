import { create } from 'zustand';
import { projects } from '../data/projects';

interface SliderState {
  currentIndex: number;
  direction: 1 | -1;
  isAnimating: boolean;
  totalSlides: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  setAnimating: (v: boolean) => void;
}

export const useSliderStore = create<SliderState>((set, get) => ({
  currentIndex: 0,
  direction: 1,
  isAnimating: false,
  totalSlides: projects.length,
  goToSlide: (index) => {
    const { currentIndex, isAnimating, totalSlides } = get();
    if (isAnimating || index === currentIndex) return;
    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    if (clamped === currentIndex) return;
    set({
      currentIndex: clamped,
      direction: clamped > currentIndex ? 1 : -1,
      isAnimating: true,
    });
  },
  nextSlide: () => {
    const { currentIndex, isAnimating, totalSlides } = get();
    if (isAnimating || currentIndex >= totalSlides - 1) return;
    set({ currentIndex: currentIndex + 1, direction: 1, isAnimating: true });
  },
  prevSlide: () => {
    const { currentIndex, isAnimating } = get();
    if (isAnimating || currentIndex <= 0) return;
    set({ currentIndex: currentIndex - 1, direction: -1, isAnimating: true });
  },
  setAnimating: (v) => set({ isAnimating: v }),
}));
